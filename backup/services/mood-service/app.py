"""
HugMood Mood Service

Handles mood tracking, analytics, and mood-related features.
Exposes a GraphQL API for mood operations.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import jwt
from datetime import datetime, timedelta
import logging
from ariadne import load_schema_from_path, make_executable_schema, graphql_sync
from ariadne import ObjectType, QueryType, MutationType
from ariadne.constants import PLAYGROUND_HTML
import json
import sqlite3  # Using SQLite for simplicity; in production, use PostgreSQL with SQLAlchemy
from functools import wraps
import math
import random

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key')
PORT = int(os.environ.get('PORT', 5003))

# Service URLs
AUTH_SERVICE_URL = os.environ.get('AUTH_SERVICE_URL', 'http://localhost:5001')
USER_SERVICE_URL = os.environ.get('USER_SERVICE_URL', 'http://localhost:5002')

# Database setup - would typically use SQLAlchemy in production
def get_db():
    db = sqlite3.connect('mood.db')
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        
        # Create moods table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS moods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            mood TEXT NOT NULL,
            score INTEGER NOT NULL,
            note TEXT,
            activities TEXT,
            is_public BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create mood_analytics table to cache analytics
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS mood_analytics_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            time_range INTEGER NOT NULL,
            data TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, time_range)
        )
        ''')
        
        db.commit()

# Authentication utilities
def get_user_from_header():
    """Get user ID from X-User-ID header"""
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return None
    
    return {'id': int(user_id)}

# Mood functions
def create_mood(user_id, mood_data):
    """Create a new mood entry"""
    db = get_db()
    cursor = db.cursor()
    
    mood = mood_data.get('mood')
    score = mood_data.get('score')
    note = mood_data.get('note')
    activities = json.dumps(mood_data.get('activities', []))
    is_public = 1 if mood_data.get('isPublic', False) else 0
    
    try:
        cursor.execute(
            '''
            INSERT INTO moods (user_id, mood, score, note, activities, is_public)
            VALUES (?, ?, ?, ?, ?, ?)
            ''',
            (user_id, mood, score, note, activities, is_public)
        )
        db.commit()
        
        # Get the created mood
        cursor.execute(
            'SELECT * FROM moods WHERE id = ?',
            (cursor.lastrowid,)
        )
        mood = cursor.fetchone()
        
        # Convert to dict
        mood_dict = dict(mood)
        
        # Parse activities from JSON string
        try:
            mood_dict['activities'] = json.loads(mood_dict['activities'])
        except:
            mood_dict['activities'] = []
        
        # Convert is_public to boolean
        mood_dict['is_public'] = bool(mood_dict['is_public'])
        
        return mood_dict
    except Exception as e:
        logger.error(f"Error creating mood: {str(e)}")
        return None

def get_user_moods(user_id, limit=50):
    """Get mood history for a user"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            '''
            SELECT * FROM moods 
            WHERE user_id = ? 
            ORDER BY created_at DESC
            LIMIT ?
            ''',
            (user_id, limit)
        )
        moods = cursor.fetchall()
        
        # Convert to list of dicts
        mood_list = []
        for mood in moods:
            mood_dict = dict(mood)
            
            # Parse activities from JSON string
            try:
                mood_dict['activities'] = json.loads(mood_dict['activities'])
            except:
                mood_dict['activities'] = []
            
            # Convert is_public to boolean
            mood_dict['is_public'] = bool(mood_dict['is_public'])
            
            mood_list.append(mood_dict)
        
        return mood_list
    except Exception as e:
        logger.error(f"Error getting user moods: {str(e)}")
        return []

def get_public_moods(limit=20):
    """Get public moods feed"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            '''
            SELECT m.*, u.username, u.display_name, u.avatar_url 
            FROM moods m
            LEFT JOIN user_profiles u ON m.user_id = u.id
            WHERE m.is_public = 1
            ORDER BY m.created_at DESC
            LIMIT ?
            ''',
            (limit,)
        )
        moods = cursor.fetchall()
        
        # Convert to list of dicts
        mood_list = []
        for mood in moods:
            mood_dict = dict(mood)
            
            # Parse activities from JSON string
            try:
                mood_dict['activities'] = json.loads(mood_dict['activities'])
            except:
                mood_dict['activities'] = []
            
            # Convert is_public to boolean
            mood_dict['is_public'] = bool(mood_dict['is_public'])
            
            mood_list.append(mood_dict)
        
        return mood_list
    except Exception as e:
        logger.error(f"Error getting public moods: {str(e)}")
        return []

def get_mood_analytics(user_id, time_range=30):
    """Generate mood analytics for a user"""
    # Check for cached analytics
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            '''
            SELECT data, updated_at FROM mood_analytics_cache
            WHERE user_id = ? AND time_range = ?
            ''',
            (user_id, time_range)
        )
        cached = cursor.fetchone()
        
        # Check if cache is fresh (less than 1 hour old)
        if cached:
            cache_time = datetime.strptime(cached['updated_at'], '%Y-%m-%d %H:%M:%S')
            if datetime.utcnow() - cache_time < timedelta(hours=1):
                return json.loads(cached['data'])
        
        # Get mood history for the time range
        now = datetime.utcnow()
        start_date = now - timedelta(days=time_range)
        
        cursor.execute(
            '''
            SELECT * FROM moods
            WHERE user_id = ? AND created_at >= ?
            ORDER BY created_at
            ''',
            (user_id, start_date.strftime('%Y-%m-%d %H:%M:%S'))
        )
        moods = cursor.fetchall()
        
        # Convert to list of dicts
        mood_list = []
        for mood in moods:
            mood_dict = dict(mood)
            
            # Parse activities from JSON string
            try:
                mood_dict['activities'] = json.loads(mood_dict['activities'])
            except:
                mood_dict['activities'] = []
            
            # Convert is_public to boolean
            mood_dict['is_public'] = bool(mood_dict['is_public'])
            
            mood_list.append(mood_dict)
        
        # Generate analytics
        analytics = generate_mood_analytics(user_id, mood_list, time_range)
        
        # Cache the analytics
        analytics_json = json.dumps(analytics)
        cursor.execute(
            '''
            INSERT OR REPLACE INTO mood_analytics_cache
            (user_id, time_range, data, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ''',
            (user_id, time_range, analytics_json)
        )
        db.commit()
        
        return analytics
    except Exception as e:
        logger.error(f"Error generating mood analytics: {str(e)}")
        return {
            'userId': user_id,
            'timeRange': time_range,
            'error': str(e)
        }

def generate_mood_analytics(user_id, moods, time_range):
    """Generate detailed mood analytics"""
    # Prepare result object
    analytics = {
        'userId': user_id,
        'timeRange': time_range,
        'moodFrequency': {},
        'moodByDayOfWeek': {},
        'moodByTimeOfDay': {},
        'averageScore': 0,
        'streak': calculate_mood_streak(moods),
        'insights': [],
        'recommendations': []
    }
    
    # If no moods, return empty analytics
    if not moods:
        return analytics
    
    # Calculate mood frequency
    analytics['moodFrequency'] = calculate_mood_frequency(moods)
    
    # Calculate mood by day of week
    analytics['moodByDayOfWeek'] = calculate_mood_by_day_of_week(moods)
    
    # Calculate mood by time of day
    analytics['moodByTimeOfDay'] = calculate_mood_by_time_of_day(moods)
    
    # Calculate average score
    if moods:
        total_score = sum(mood['score'] for mood in moods)
        analytics['averageScore'] = round(total_score / len(moods), 1)
    
    # Generate insights
    analytics['insights'] = generate_insights(
        moods,
        analytics['moodFrequency'],
        analytics['moodByDayOfWeek'],
        analytics['moodByTimeOfDay'],
        analytics['streak']
    )
    
    # Generate recommendations
    analytics['recommendations'] = generate_recommendations(
        moods,
        analytics['moodFrequency'],
        analytics['moodByDayOfWeek'],
        analytics['moodByTimeOfDay'],
        analytics['streak']
    )
    
    return analytics

def calculate_mood_frequency(moods):
    """Calculate frequency of each mood"""
    frequency = {}
    
    for mood in moods:
        mood_name = mood['mood']
        if mood_name in frequency:
            frequency[mood_name] += 1
        else:
            frequency[mood_name] = 1
    
    return frequency

def calculate_mood_by_day_of_week(moods):
    """Calculate mood patterns by day of week"""
    days = {
        0: 'Monday',
        1: 'Tuesday',
        2: 'Wednesday',
        3: 'Thursday',
        4: 'Friday',
        5: 'Saturday',
        6: 'Sunday'
    }
    
    # Initialize data structure
    day_data = {day: {'count': 0, 'score_sum': 0, 'moods': {}} for day in days.values()}
    
    # Process moods
    for mood in moods:
        try:
            date = datetime.strptime(mood['created_at'], '%Y-%m-%d %H:%M:%S')
            day_name = days[date.weekday()]
            
            # Update counts and scores
            day_data[day_name]['count'] += 1
            day_data[day_name]['score_sum'] += mood['score']
            
            # Update mood frequency for this day
            mood_name = mood['mood']
            if mood_name in day_data[day_name]['moods']:
                day_data[day_name]['moods'][mood_name] += 1
            else:
                day_data[day_name]['moods'][mood_name] = 1
        except Exception as e:
            logger.error(f"Error processing mood date: {str(e)}")
    
    # Calculate averages
    for day, data in day_data.items():
        if data['count'] > 0:
            data['average_score'] = round(data['score_sum'] / data['count'], 1)
        else:
            data['average_score'] = 0
    
    return day_data

def calculate_mood_by_time_of_day(moods):
    """Calculate mood patterns by time of day"""
    time_periods = {
        'Morning': (5, 11),   # 5:00 AM - 11:59 AM
        'Afternoon': (12, 16), # 12:00 PM - 4:59 PM
        'Evening': (17, 20),   # 5:00 PM - 8:59 PM
        'Night': (21, 4)       # 9:00 PM - 4:59 AM
    }
    
    # Initialize data structure
    time_data = {period: {'count': 0, 'score_sum': 0, 'moods': {}} for period in time_periods.keys()}
    
    # Process moods
    for mood in moods:
        try:
            date = datetime.strptime(mood['created_at'], '%Y-%m-%d %H:%M:%S')
            hour = date.hour
            
            # Determine time period
            period = None
            for p, (start, end) in time_periods.items():
                if start <= end:
                    if start <= hour <= end:
                        period = p
                        break
                else:  # Handle night (wraps around from 21 to 4)
                    if hour >= start or hour <= end:
                        period = p
                        break
            
            if not period:
                continue
            
            # Update counts and scores
            time_data[period]['count'] += 1
            time_data[period]['score_sum'] += mood['score']
            
            # Update mood frequency for this time period
            mood_name = mood['mood']
            if mood_name in time_data[period]['moods']:
                time_data[period]['moods'][mood_name] += 1
            else:
                time_data[period]['moods'][mood_name] = 1
        except Exception as e:
            logger.error(f"Error processing mood time: {str(e)}")
    
    # Calculate averages
    for period, data in time_data.items():
        if data['count'] > 0:
            data['average_score'] = round(data['score_sum'] / data['count'], 1)
        else:
            data['average_score'] = 0
    
    return time_data

def calculate_mood_streak(moods):
    """Calculate the current mood tracking streak"""
    if not moods:
        return 0
    
    # Sort moods by date (newest first)
    sorted_moods = sorted(moods, key=lambda m: m['created_at'], reverse=True)
    
    today = datetime.utcnow().date()
    
    # Check if there's a mood entry for today
    latest_mood_date = datetime.strptime(sorted_moods[0]['created_at'], '%Y-%m-%d %H:%M:%S').date()
    if latest_mood_date < today:
        # No entry for today, streak broken
        return 0
    
    # Calculate streak
    streak = 1
    last_date = latest_mood_date
    
    for mood in sorted_moods[1:]:
        mood_date = datetime.strptime(mood['created_at'], '%Y-%m-%d %H:%M:%S').date()
        
        # Check if this mood is from the previous day
        if (last_date - mood_date).days == 1:
            streak += 1
            last_date = mood_date
        elif (last_date - mood_date).days > 1:
            # Gap in streak
            break
    
    return streak

def generate_insights(moods, mood_frequency, mood_by_day, mood_by_time, streak):
    """Generate insights based on mood data"""
    insights = []
    
    if not moods:
        insights.append("You haven't tracked any moods in this time period. Start tracking to get insights!")
        return insights
    
    # Streak insights
    if streak > 0:
        insights.append(f"You're on a {streak} day mood tracking streak! Keep going!")
    
    # Most frequent mood
    if mood_frequency:
        most_frequent_mood = max(mood_frequency.items(), key=lambda x: x[1])
        insights.append(f"Your most frequent mood was '{most_frequent_mood[0]}' ({most_frequent_mood[1]} times).")
    
    # Best day of the week
    best_day = None
    best_day_score = 0
    for day, data in mood_by_day.items():
        if data['count'] > 0 and data['average_score'] > best_day_score:
            best_day = day
            best_day_score = data['average_score']
    
    if best_day:
        insights.append(f"{best_day} tends to be your best day with an average mood score of {best_day_score}.")
    
    # Best time of day
    best_time = None
    best_time_score = 0
    for time, data in mood_by_time.items():
        if data['count'] > 0 and data['average_score'] > best_time_score:
            best_time = time
            best_time_score = data['average_score']
    
    if best_time:
        insights.append(f"You tend to feel best during the {best_time.lower()} (average score: {best_time_score}).")
    
    # Mood variety
    if len(mood_frequency) == 1:
        insights.append("You've only recorded one type of mood. Try being more specific about how you feel.")
    elif len(mood_frequency) > 3:
        insights.append(f"You've recorded {len(mood_frequency)} different moods, showing good emotional awareness.")
    
    # Consistency
    date_count = {}
    for mood in moods:
        date = mood['created_at'].split(' ')[0]
        if date in date_count:
            date_count[date] += 1
        else:
            date_count[date] = 1
    
    if len(date_count) > 0:
        avg_entries_per_day = sum(date_count.values()) / len(date_count)
        if avg_entries_per_day > 1.5:
            insights.append(f"You track your mood about {round(avg_entries_per_day, 1)} times per day, which is great for detailed insights.")
    
    return insights

def generate_recommendations(moods, mood_frequency, mood_by_day, mood_by_time, streak):
    """Generate recommendations based on mood data"""
    recommendations = []
    
    if not moods:
        recommendations.append("Start tracking your mood daily to get personalized recommendations.")
        return recommendations
    
    # Streak recommendations
    if streak == 0:
        recommendations.append("Try to track your mood every day to build a streak and get more accurate insights.")
    elif streak < 3:
        recommendations.append("Keep your streak going! Track your mood for at least 7 consecutive days for better patterns.")
    
    # Frequency recommendations
    if len(moods) < 7:
        recommendations.append("Track your mood more frequently to get more accurate insights and recommendations.")
    
    # Worst day recommendations
    worst_day = None
    worst_day_score = 10  # Start high
    for day, data in mood_by_day.items():
        if data['count'] > 0 and data['average_score'] < worst_day_score:
            worst_day = day
            worst_day_score = data['average_score']
    
    if worst_day and worst_day_score < 5:
        recommendations.append(f"Consider planning enjoyable activities for {worst_day}s to improve your mood.")
    
    # Mood improvement recommendations
    negative_moods = ['sad', 'anxious', 'stressed', 'angry', 'frustrated', 'overwhelmed', 'exhausted']
    has_negative_moods = False
    
    for mood in negative_moods:
        if mood in mood_frequency and mood_frequency[mood] > 0:
            has_negative_moods = True
            break
    
    if has_negative_moods:
        recommendations.append("Try mindfulness or breathing exercises when you're feeling down or stressed.")
        recommendations.append("Consider talking to someone you trust when you're experiencing difficult emotions.")
    
    # Time of day recommendations
    worst_time = None
    worst_time_score = 10  # Start high
    for time, data in mood_by_time.items():
        if data['count'] > 0 and data['average_score'] < worst_time_score:
            worst_time = time
            worst_time_score = data['average_score']
    
    if worst_time and worst_time_score < 5:
        if worst_time == 'Morning':
            recommendations.append("Your mornings could be better. Consider a morning routine with activities you enjoy.")
        elif worst_time == 'Afternoon':
            recommendations.append("Your afternoons could be better. Try taking short breaks or changing your environment.")
        elif worst_time == 'Evening':
            recommendations.append("Your evenings could be better. Consider relaxing activities to wind down.")
        elif worst_time == 'Night':
            recommendations.append("Your nights could be better. Consider improving your sleep routine or environment.")
    
    return recommendations

# GraphQL Schema
type_defs = """
type Query {
    moodHistory(userId: ID!, limit: Int): [Mood]
    publicMoods(limit: Int): [MoodWithUser]
    moodAnalytics(userId: ID!, timeRange: Int): MoodAnalytics
    mood(id: ID!): Mood
}

type Mutation {
    createMood(input: MoodInput!): Mood
    updateMood(id: ID!, input: MoodInput!): Mood
    deleteMood(id: ID!): Boolean
}

type Mood {
    id: ID!
    userId: ID!
    mood: String!
    score: Int!
    note: String
    activities: [String]
    isPublic: Boolean!
    createdAt: String!
}

type MoodWithUser {
    id: ID!
    userId: ID!
    mood: String!
    score: Int!
    note: String
    activities: [String]
    isPublic: Boolean!
    createdAt: String!
    username: String
    displayName: String
    avatarUrl: String
}

type MoodAnalytics {
    userId: ID!
    timeRange: Int!
    moodFrequency: JSONObject
    moodByDayOfWeek: JSONObject
    moodByTimeOfDay: JSONObject
    averageScore: Float
    streak: Int
    insights: [String]
    recommendations: [String]
}

input MoodInput {
    mood: String!
    score: Int!
    note: String
    activities: [String]
    isPublic: Boolean
}

scalar JSONObject
"""

# GraphQL resolvers
query = QueryType()
mutation = MutationType()
mood = ObjectType("Mood")

@query.field("moodHistory")
def resolve_mood_history(_, info, userId, limit=50):
    return get_user_moods(userId, limit)

@query.field("publicMoods")
def resolve_public_moods(_, info, limit=20):
    return get_public_moods(limit)

@query.field("moodAnalytics")
def resolve_mood_analytics(_, info, userId, timeRange=30):
    return get_mood_analytics(userId, timeRange)

@query.field("mood")
def resolve_mood(_, info, id):
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute('SELECT * FROM moods WHERE id = ?', (id,))
        mood = cursor.fetchone()
        
        if not mood:
            return None
        
        # Convert to dict
        mood_dict = dict(mood)
        
        # Parse activities from JSON string
        try:
            mood_dict['activities'] = json.loads(mood_dict['activities'])
        except:
            mood_dict['activities'] = []
        
        # Convert is_public to boolean
        mood_dict['is_public'] = bool(mood_dict['is_public'])
        
        return mood_dict
    except Exception as e:
        logger.error(f"Error getting mood: {str(e)}")
        return None

@mutation.field("createMood")
def resolve_create_mood(_, info, input):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    return create_mood(user['id'], input)

@mutation.field("updateMood")
def resolve_update_mood(_, info, id, input):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    db = get_db()
    cursor = db.cursor()
    
    # Check if the mood exists and belongs to the user
    cursor.execute('SELECT user_id FROM moods WHERE id = ?', (id,))
    mood = cursor.fetchone()
    
    if not mood:
        raise Exception("Mood not found")
    
    if mood['user_id'] != user['id']:
        raise Exception("Not authorized to update this mood")
    
    # Update the mood
    mood_value = input.get('mood')
    score = input.get('score')
    note = input.get('note')
    activities = json.dumps(input.get('activities', []))
    is_public = 1 if input.get('isPublic', False) else 0
    
    try:
        cursor.execute(
            '''
            UPDATE moods
            SET mood = ?, score = ?, note = ?, activities = ?, is_public = ?
            WHERE id = ?
            ''',
            (mood_value, score, note, activities, is_public, id)
        )
        db.commit()
        
        # Get the updated mood
        cursor.execute('SELECT * FROM moods WHERE id = ?', (id,))
        updated_mood = cursor.fetchone()
        
        # Convert to dict
        mood_dict = dict(updated_mood)
        
        # Parse activities from JSON string
        try:
            mood_dict['activities'] = json.loads(mood_dict['activities'])
        except:
            mood_dict['activities'] = []
        
        # Convert is_public to boolean
        mood_dict['is_public'] = bool(mood_dict['is_public'])
        
        return mood_dict
    except Exception as e:
        logger.error(f"Error updating mood: {str(e)}")
        raise Exception(f"Error updating mood: {str(e)}")

@mutation.field("deleteMood")
def resolve_delete_mood(_, info, id):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    db = get_db()
    cursor = db.cursor()
    
    # Check if the mood exists and belongs to the user
    cursor.execute('SELECT user_id FROM moods WHERE id = ?', (id,))
    mood = cursor.fetchone()
    
    if not mood:
        raise Exception("Mood not found")
    
    if mood['user_id'] != user['id']:
        raise Exception("Not authorized to delete this mood")
    
    try:
        cursor.execute('DELETE FROM moods WHERE id = ?', (id,))
        db.commit()
        return True
    except Exception as e:
        logger.error(f"Error deleting mood: {str(e)}")
        raise Exception(f"Error deleting mood: {str(e)}")

# Create executable schema
schema = make_executable_schema(type_defs, query, mutation, mood)

# Authentication middleware for GraphQL
def get_context_value():
    return {'user': get_user_from_header()}

# GraphQL endpoint
@app.route('/graphql', methods=['GET', 'POST'])
def graphql_server():
    # GraphQL Playground
    if request.method == 'GET':
        return PLAYGROUND_HTML, 200
    
    # Process GraphQL request
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=get_context_value(),
        debug=app.debug
    )
    
    status_code = 200 if success else 400
    return jsonify(result), status_code

# REST API endpoints

@app.route('/moods', methods=['POST'])
def create_mood_api():
    """Create a new mood entry"""
    user = get_user_from_header()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    mood_data = request.get_json()
    mood = create_mood(user['id'], mood_data)
    
    if not mood:
        return jsonify({'error': 'Failed to create mood'}), 500
    
    return jsonify(mood), 201

@app.route('/users/<int:user_id>/moods', methods=['GET'])
def get_user_moods_api(user_id):
    """Get mood history for a user"""
    limit = request.args.get('limit', 50, type=int)
    moods = get_user_moods(user_id, limit)
    return jsonify(moods), 200

@app.route('/moods/feed', methods=['GET'])
def get_public_moods_api():
    """Get public moods feed"""
    limit = request.args.get('limit', 20, type=int)
    moods = get_public_moods(limit)
    return jsonify(moods), 200

@app.route('/users/<int:user_id>/mood-analytics', methods=['GET'])
def get_mood_analytics_api(user_id):
    """Get mood analytics for a user"""
    time_range = request.args.get('timeRange', 30, type=int)
    analytics = get_mood_analytics(user_id, time_range)
    return jsonify(analytics), 200

@app.route('/moods/<int:mood_id>', methods=['GET'])
def get_mood_api(mood_id):
    """Get a specific mood entry"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute('SELECT * FROM moods WHERE id = ?', (mood_id,))
        mood = cursor.fetchone()
        
        if not mood:
            return jsonify({'error': 'Mood not found'}), 404
        
        # Convert to dict
        mood_dict = dict(mood)
        
        # Parse activities from JSON string
        try:
            mood_dict['activities'] = json.loads(mood_dict['activities'])
        except:
            mood_dict['activities'] = []
        
        # Convert is_public to boolean
        mood_dict['is_public'] = bool(mood_dict['is_public'])
        
        return jsonify(mood_dict), 200
    except Exception as e:
        logger.error(f"Error getting mood: {str(e)}")
        return jsonify({'error': f'Error getting mood: {str(e)}'}), 500

@app.route('/moods/<int:mood_id>', methods=['PUT'])
def update_mood_api(mood_id):
    """Update a mood entry"""
    user = get_user_from_header()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    db = get_db()
    cursor = db.cursor()
    
    # Check if the mood exists and belongs to the user
    cursor.execute('SELECT user_id FROM moods WHERE id = ?', (mood_id,))
    mood = cursor.fetchone()
    
    if not mood:
        return jsonify({'error': 'Mood not found'}), 404
    
    if mood['user_id'] != user['id']:
        return jsonify({'error': 'Not authorized to update this mood'}), 403
    
    # Update the mood
    mood_data = request.get_json()
    mood_value = mood_data.get('mood')
    score = mood_data.get('score')
    note = mood_data.get('note')
    activities = json.dumps(mood_data.get('activities', []))
    is_public = 1 if mood_data.get('isPublic', False) else 0
    
    try:
        cursor.execute(
            '''
            UPDATE moods
            SET mood = ?, score = ?, note = ?, activities = ?, is_public = ?
            WHERE id = ?
            ''',
            (mood_value, score, note, activities, is_public, mood_id)
        )
        db.commit()
        
        # Get the updated mood
        cursor.execute('SELECT * FROM moods WHERE id = ?', (mood_id,))
        updated_mood = cursor.fetchone()
        
        # Convert to dict
        mood_dict = dict(updated_mood)
        
        # Parse activities from JSON string
        try:
            mood_dict['activities'] = json.loads(mood_dict['activities'])
        except:
            mood_dict['activities'] = []
        
        # Convert is_public to boolean
        mood_dict['is_public'] = bool(mood_dict['is_public'])
        
        return jsonify(mood_dict), 200
    except Exception as e:
        logger.error(f"Error updating mood: {str(e)}")
        return jsonify({'error': f'Error updating mood: {str(e)}'}), 500

@app.route('/moods/<int:mood_id>', methods=['DELETE'])
def delete_mood_api(mood_id):
    """Delete a mood entry"""
    user = get_user_from_header()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    db = get_db()
    cursor = db.cursor()
    
    # Check if the mood exists and belongs to the user
    cursor.execute('SELECT user_id FROM moods WHERE id = ?', (mood_id,))
    mood = cursor.fetchone()
    
    if not mood:
        return jsonify({'error': 'Mood not found'}), 404
    
    if mood['user_id'] != user['id']:
        return jsonify({'error': 'Not authorized to delete this mood'}), 403
    
    try:
        cursor.execute('DELETE FROM moods WHERE id = ?', (mood_id,))
        db.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        logger.error(f"Error deleting mood: {str(e)}")
        return jsonify({'error': f'Error deleting mood: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'mood'}), 200

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Start server
    app.run(host='0.0.0.0', port=PORT)
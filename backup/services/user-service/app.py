"""
HugMood User Service

Manages user profiles, accounts, and user-related features.
Exposes a GraphQL API for user operations.
"""

from flask import Flask, request, jsonify, g
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
import requests

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key')
TOKEN_EXPIRATION = int(os.environ.get('TOKEN_EXPIRATION', 86400))  # 24 hours in seconds
PORT = int(os.environ.get('PORT', 5002))

# Service URLs
AUTH_SERVICE_URL = os.environ.get('AUTH_SERVICE_URL', 'http://localhost:5001')
MOOD_SERVICE_URL = os.environ.get('MOOD_SERVICE_URL', 'http://localhost:5003')
HUG_SERVICE_URL = os.environ.get('HUG_SERVICE_URL', 'http://localhost:5004')
SOCIAL_SERVICE_URL = os.environ.get('SOCIAL_SERVICE_URL', 'http://localhost:5005')
STREAK_SERVICE_URL = os.environ.get('STREAK_SERVICE_URL', 'http://localhost:5006')

# Database setup - would typically use SQLAlchemy in production
def get_db():
    db = sqlite3.connect('user.db')
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        
        # Create users table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_profiles (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            display_name TEXT,
            avatar_url TEXT,
            bio TEXT,
            location TEXT,
            website TEXT,
            theme_preference TEXT,
            notification_settings TEXT,
            privacy_settings TEXT,
            is_online BOOLEAN DEFAULT 0,
            last_online TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create badges table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            category TEXT,
            criteria TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create user_badges table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            badge_id INTEGER NOT NULL,
            earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user_profiles (id),
            FOREIGN KEY (badge_id) REFERENCES badges (id),
            UNIQUE(user_id, badge_id)
        )
        ''')
        
        db.commit()
        
        # Create some sample badges
        sample_badges = [
            ('Newcomer', 'Joined HugMood', '/badges/newcomer.png', 'account', 'Earned when joining HugMood'),
            ('Mood Tracker', 'Tracked moods for 7 consecutive days', '/badges/mood-tracker.png', 'streak', 'Track mood for 7 days in a row'),
            ('Hug Giver', 'Sent 10 hugs', '/badges/hug-giver.png', 'social', 'Send 10 hugs to others'),
            ('Hug Receiver', 'Received 10 hugs', '/badges/hug-receiver.png', 'social', 'Receive 10 hugs from others'),
            ('Community Supporter', 'Participated in 5 group hugs', '/badges/community.png', 'social', 'Join 5 group hugs')
        ]
        
        try:
            cursor.executemany(
                'INSERT OR IGNORE INTO badges (name, description, image_url, category, criteria) VALUES (?, ?, ?, ?, ?)',
                sample_badges
            )
            db.commit()
        except sqlite3.Error as e:
            logger.error(f"Error creating sample badges: {str(e)}")

# Authentication utilities
def verify_token(token):
    """Verify a JWT token and return the payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_user_from_header():
    """Get user ID from X-User-ID header"""
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return None
    
    return {'id': int(user_id)}

def get_user_by_id(user_id):
    """Get user profile by ID"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM user_profiles WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        # Try to get user from Auth service and create profile if it exists
        try:
            auth_response = requests.get(
                f"{AUTH_SERVICE_URL}/graphql",
                json={
                    "query": """
                    query GetUser($id: ID!) {
                        user(id: $id) {
                            id
                            username
                            email
                            displayName
                            avatarUrl
                            createdAt
                        }
                    }
                    """,
                    "variables": {
                        "id": user_id
                    }
                }
            )
            
            if auth_response.status_code == 200:
                auth_data = auth_response.json()
                if auth_data.get('data') and auth_data['data'].get('user'):
                    auth_user = auth_data['data']['user']
                    
                    # Create user profile
                    cursor.execute(
                        '''
                        INSERT INTO user_profiles 
                        (id, username, display_name, avatar_url) 
                        VALUES (?, ?, ?, ?)
                        ''',
                        (
                            user_id, 
                            auth_user.get('username'), 
                            auth_user.get('displayName'), 
                            auth_user.get('avatarUrl')
                        )
                    )
                    db.commit()
                    
                    # Get the created profile
                    cursor.execute('SELECT * FROM user_profiles WHERE id = ?', (user_id,))
                    user = cursor.fetchone()
        except Exception as e:
            logger.error(f"Error fetching user from Auth service: {str(e)}")
    
    if not user:
        return None
    
    return dict(user)

def search_users(query, limit=10):
    """Search users by username or display name"""
    db = get_db()
    cursor = db.cursor()
    
    search_query = f"%{query}%"
    cursor.execute(
        '''
        SELECT * FROM user_profiles 
        WHERE username LIKE ? OR display_name LIKE ? 
        ORDER BY username 
        LIMIT ?
        ''',
        (search_query, search_query, limit)
    )
    
    users = cursor.fetchall()
    return [dict(user) for user in users]

def update_user_profile(user_id, profile_data):
    """Update user profile"""
    db = get_db()
    cursor = db.cursor()
    
    # Get existing profile
    cursor.execute('SELECT * FROM user_profiles WHERE id = ?', (user_id,))
    existing = cursor.fetchone()
    
    if not existing:
        return None
    
    # Update fields
    update_fields = []
    params = []
    
    if 'displayName' in profile_data:
        update_fields.append('display_name = ?')
        params.append(profile_data['displayName'])
    
    if 'avatarUrl' in profile_data:
        update_fields.append('avatar_url = ?')
        params.append(profile_data['avatarUrl'])
    
    if 'bio' in profile_data:
        update_fields.append('bio = ?')
        params.append(profile_data['bio'])
    
    if 'location' in profile_data:
        update_fields.append('location = ?')
        params.append(profile_data['location'])
    
    if 'website' in profile_data:
        update_fields.append('website = ?')
        params.append(profile_data['website'])
    
    if 'themePreference' in profile_data:
        update_fields.append('theme_preference = ?')
        params.append(profile_data['themePreference'])
    
    if 'notificationSettings' in profile_data:
        update_fields.append('notification_settings = ?')
        params.append(json.dumps(profile_data['notificationSettings']))
    
    if 'privacySettings' in profile_data:
        update_fields.append('privacy_settings = ?')
        params.append(json.dumps(profile_data['privacySettings']))
    
    if not update_fields:
        return dict(existing)
    
    # Add updated_at and user_id
    update_fields.append('updated_at = CURRENT_TIMESTAMP')
    params.append(user_id)
    
    # Execute update
    cursor.execute(
        f'''
        UPDATE user_profiles 
        SET {', '.join(update_fields)} 
        WHERE id = ?
        ''',
        params
    )
    db.commit()
    
    # Get updated profile
    cursor.execute('SELECT * FROM user_profiles WHERE id = ?', (user_id,))
    updated = cursor.fetchone()
    
    return dict(updated) if updated else None

def get_user_badges(user_id):
    """Get badges for a user"""
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute(
        '''
        SELECT b.*, ub.earned_at 
        FROM badges b
        JOIN user_badges ub ON b.id = ub.badge_id
        WHERE ub.user_id = ?
        ORDER BY ub.earned_at DESC
        ''',
        (user_id,)
    )
    
    badges = cursor.fetchall()
    return [dict(badge) for badge in badges]

def award_badge(user_id, badge_id):
    """Award a badge to a user"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            'INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
            (user_id, badge_id)
        )
        db.commit()
        
        # Check if badge was awarded (not ignored due to uniqueness constraint)
        if cursor.rowcount > 0:
            # Get badge details
            cursor.execute('SELECT * FROM badges WHERE id = ?', (badge_id,))
            badge = cursor.fetchone()
            
            return {
                'success': True,
                'badge': dict(badge) if badge else {'id': badge_id}
            }
        else:
            # User already has this badge
            return {
                'success': False,
                'message': 'User already has this badge'
            }
    except sqlite3.Error as e:
        logger.error(f"Error awarding badge: {str(e)}")
        return {
            'success': False,
            'message': f"Error awarding badge: {str(e)}"
        }

def set_user_online_status(user_id, is_online):
    """Set user's online status"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        if is_online:
            cursor.execute(
                'UPDATE user_profiles SET is_online = 1, last_online = CURRENT_TIMESTAMP WHERE id = ?',
                (user_id,)
            )
        else:
            cursor.execute(
                'UPDATE user_profiles SET is_online = 0, last_online = CURRENT_TIMESTAMP WHERE id = ?',
                (user_id,)
            )
        db.commit()
        
        return {'success': True}
    except sqlite3.Error as e:
        logger.error(f"Error updating online status: {str(e)}")
        return {'success': False, 'message': str(e)}

# GraphQL Schema
type_defs = """
type Query {
    user(id: ID!): User
    users(ids: [ID!]): [User]
    searchUsers(query: String!, limit: Int): [User]
    badges: [Badge]
    userBadges(userId: ID!): [Badge]
}

type Mutation {
    updateProfile(input: UpdateProfileInput!): User
    awardBadge(userId: ID!, badgeId: ID!): BadgeResult
    setOnlineStatus(isOnline: Boolean!): StatusResult
}

type User {
    id: ID!
    username: String!
    displayName: String
    avatarUrl: String
    bio: String
    location: String
    website: String
    themePreference: String
    notificationSettings: NotificationSettings
    privacySettings: PrivacySettings
    isOnline: Boolean
    lastOnline: String
    createdAt: String!
    updatedAt: String
    badges: [Badge]
}

type Badge {
    id: ID!
    name: String!
    description: String
    imageUrl: String
    category: String
    criteria: String
    earnedAt: String
}

type NotificationSettings {
    pushEnabled: Boolean
    emailEnabled: Boolean
    moodUpdates: Boolean
    hugRequests: Boolean
    achievements: Boolean
}

type PrivacySettings {
    profileVisibility: String
    moodVisibility: String
    followersVisibility: String
}

type BadgeResult {
    success: Boolean!
    message: String
    badge: Badge
}

type StatusResult {
    success: Boolean!
    message: String
}

input UpdateProfileInput {
    displayName: String
    avatarUrl: String
    bio: String
    location: String
    website: String
    themePreference: String
    notificationSettings: NotificationSettingsInput
    privacySettings: PrivacySettingsInput
}

input NotificationSettingsInput {
    pushEnabled: Boolean
    emailEnabled: Boolean
    moodUpdates: Boolean
    hugRequests: Boolean
    achievements: Boolean
}

input PrivacySettingsInput {
    profileVisibility: String
    moodVisibility: String
    followersVisibility: String
}
"""

# GraphQL resolvers
query = QueryType()
mutation = MutationType()
user = ObjectType("User")

@query.field("user")
def resolve_user(_, info, id):
    return get_user_by_id(id)

@query.field("users")
def resolve_users(_, info, ids):
    users = []
    for user_id in ids:
        user = get_user_by_id(user_id)
        if user:
            users.append(user)
    return users

@query.field("searchUsers")
def resolve_search_users(_, info, query, limit=10):
    return search_users(query, limit)

@query.field("badges")
def resolve_badges(_, info):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM badges')
    badges = cursor.fetchall()
    return [dict(badge) for badge in badges]

@query.field("userBadges")
def resolve_user_badges(_, info, userId):
    return get_user_badges(userId)

@mutation.field("updateProfile")
def resolve_update_profile(_, info, input):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    return update_user_profile(user['id'], input)

@mutation.field("awardBadge")
def resolve_award_badge(_, info, userId, badgeId):
    context = info.context
    user = context.get('user')
    
    # In a real app, check if the requesting user has permission to award badges
    # For demo, just check if authenticated
    if not user:
        raise Exception("Authentication required")
    
    return award_badge(userId, badgeId)

@mutation.field("setOnlineStatus")
def resolve_set_online_status(_, info, isOnline):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    return set_user_online_status(user['id'], isOnline)

@user.field("badges")
def resolve_user_badges_field(obj, info):
    return get_user_badges(obj['id'])

@user.field("notificationSettings")
def resolve_notification_settings(obj, info):
    settings_json = obj.get('notification_settings')
    if not settings_json:
        return {
            'pushEnabled': True,
            'emailEnabled': True,
            'moodUpdates': True,
            'hugRequests': True,
            'achievements': True
        }
    
    try:
        return json.loads(settings_json)
    except:
        return {
            'pushEnabled': True,
            'emailEnabled': True,
            'moodUpdates': True,
            'hugRequests': True,
            'achievements': True
        }

@user.field("privacySettings")
def resolve_privacy_settings(obj, info):
    settings_json = obj.get('privacy_settings')
    if not settings_json:
        return {
            'profileVisibility': 'public',
            'moodVisibility': 'friends',
            'followersVisibility': 'public'
        }
    
    try:
        return json.loads(settings_json)
    except:
        return {
            'profileVisibility': 'public',
            'moodVisibility': 'friends',
            'followersVisibility': 'public'
        }

# Create executable schema
schema = make_executable_schema(type_defs, query, mutation, user)

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

# Traditional REST endpoints (for backward compatibility and non-GraphQL clients)

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Add badges
    user['badges'] = get_user_badges(user_id)
    
    return jsonify(user), 200

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    # Check if user is authorized to update this profile
    requester_id = request.headers.get('X-User-ID')
    if not requester_id or int(requester_id) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Update profile
    data = request.get_json()
    updated_user = update_user_profile(user_id, data)
    
    if not updated_user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(updated_user), 200

@app.route('/users/search', methods=['GET'])
def search_users_api():
    query = request.args.get('q', '')
    limit = request.args.get('limit', 10, type=int)
    
    if not query:
        return jsonify({'error': 'Search query is required'}), 400
    
    users = search_users(query, limit)
    return jsonify(users), 200

@app.route('/users/<int:user_id>/badges', methods=['GET'])
def get_user_badges_api(user_id):
    badges = get_user_badges(user_id)
    return jsonify(badges), 200

@app.route('/users/<int:user_id>/badges', methods=['POST'])
def award_badge_api(user_id):
    # Check if user is authorized to award badges
    requester_id = request.headers.get('X-User-ID')
    if not requester_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    badge_id = data.get('badgeId')
    
    if not badge_id:
        return jsonify({'error': 'Badge ID is required'}), 400
    
    result = award_badge(user_id, badge_id)
    
    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 400

@app.route('/users/<int:user_id>/online', methods=['PUT'])
def set_online_status_api(user_id):
    # Check if user is authorized
    requester_id = request.headers.get('X-User-ID')
    if not requester_id or int(requester_id) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    is_online = data.get('isOnline', False)
    
    result = set_user_online_status(user_id, is_online)
    
    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 400

@app.route('/data/badges', methods=['GET'])
def get_badges_api():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM badges')
    badges = cursor.fetchall()
    return jsonify([dict(badge) for badge in badges]), 200

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'user'}), 200

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Start server
    app.run(host='0.0.0.0', port=PORT)
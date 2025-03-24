"""
HugMood Hug Service

Handles hug interactions, group hugs, and hug-related features.
Exposes a GraphQL API for hug operations.
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
import requests
import uuid

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key')
PORT = int(os.environ.get('PORT', 5004))

# Service URLs
AUTH_SERVICE_URL = os.environ.get('AUTH_SERVICE_URL', 'http://localhost:5001')
USER_SERVICE_URL = os.environ.get('USER_SERVICE_URL', 'http://localhost:5002')

# Database setup - would typically use SQLAlchemy in production
def get_db():
    db = sqlite3.connect('hug.db')
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        
        # Create hugs table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS hugs (
            id TEXT PRIMARY KEY,
            sender_id INTEGER NOT NULL,
            recipient_id INTEGER NOT NULL,
            hug_type TEXT NOT NULL,
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create hug_requests table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS hug_requests (
            id TEXT PRIMARY KEY,
            requester_id INTEGER NOT NULL,
            recipient_id INTEGER,
            is_public BOOLEAN DEFAULT 0,
            message TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create group_hugs table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS group_hugs (
            id TEXT PRIMARY KEY,
            creator_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            hug_type TEXT NOT NULL,
            is_public BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create group_hug_participants table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS group_hug_participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES group_hugs (id),
            UNIQUE(group_id, user_id)
        )
        ''')
        
        # Create hug_types table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS hug_types (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        db.commit()
        
        # Create default hug types
        hug_types = [
            ('comfort', 'Comfort Hug', 'A warm, comforting hug for difficult times', '/images/hugs/comfort.png', 'emotional'),
            ('celebration', 'Celebration Hug', 'An excited, celebratory hug for good news', '/images/hugs/celebration.png', 'joy'),
            ('support', 'Support Hug', 'A supportive hug to show someone you care', '/images/hugs/support.png', 'emotional'),
            ('gratitude', 'Gratitude Hug', 'A hug expressing thanks and appreciation', '/images/hugs/gratitude.png', 'appreciation'),
            ('friendship', 'Friendship Hug', 'A friendly hug between friends', '/images/hugs/friendship.png', 'connection'),
            ('virtual', 'Virtual Hug', 'A digital squeeze when distance separates', '/images/hugs/virtual.png', 'digital'),
            ('energy', 'Energy Hug', 'A hug to boost someone\'s energy and spirit', '/images/hugs/energy.png', 'motivation'),
            ('healing', 'Healing Hug', 'A gentle hug with healing intentions', '/images/hugs/healing.png', 'wellness')
        ]
        
        try:
            for hug_type in hug_types:
                cursor.execute(
                    'INSERT OR IGNORE INTO hug_types (id, name, description, image_url, category) VALUES (?, ?, ?, ?, ?)',
                    hug_type
                )
            db.commit()
        except sqlite3.Error as e:
            logger.error(f"Error creating hug types: {str(e)}")

# Authentication utilities
def get_user_from_header():
    """Get user ID from X-User-ID header"""
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return None
    
    return {'id': int(user_id)}

# Hug functions
def send_hug(sender_id, hug_data):
    """Send a hug to a recipient"""
    db = get_db()
    cursor = db.cursor()
    
    recipient_id = hug_data.get('recipientId')
    hug_type = hug_data.get('hugType')
    message = hug_data.get('message')
    
    # Generate a UUID for the hug
    hug_id = str(uuid.uuid4())
    
    try:
        cursor.execute(
            '''
            INSERT INTO hugs (id, sender_id, recipient_id, hug_type, message)
            VALUES (?, ?, ?, ?, ?)
            ''',
            (hug_id, sender_id, recipient_id, hug_type, message)
        )
        db.commit()
        
        # Get the created hug
        cursor.execute(
            'SELECT * FROM hugs WHERE id = ?',
            (hug_id,)
        )
        hug = cursor.fetchone()
        
        # Convert to dict
        hug_dict = dict(hug)
        
        # Notify the recipient (in a real system, this would use a notification service)
        try:
            # This is a placeholder for actual notification logic
            logger.info(f"Notifying user {recipient_id} about new hug {hug_id}")
        except Exception as e:
            logger.error(f"Error notifying recipient: {str(e)}")
        
        return hug_dict
    except Exception as e:
        logger.error(f"Error creating hug: {str(e)}")
        return None

def request_hug(requester_id, request_data):
    """Request a hug"""
    db = get_db()
    cursor = db.cursor()
    
    recipient_id = request_data.get('recipientId')  # May be None for public requests
    is_public = 1 if request_data.get('isPublic', False) else 0
    message = request_data.get('message')
    
    # Generate a UUID for the request
    request_id = str(uuid.uuid4())
    
    try:
        cursor.execute(
            '''
            INSERT INTO hug_requests (id, requester_id, recipient_id, is_public, message)
            VALUES (?, ?, ?, ?, ?)
            ''',
            (request_id, requester_id, recipient_id, is_public, message)
        )
        db.commit()
        
        # Get the created request
        cursor.execute(
            'SELECT * FROM hug_requests WHERE id = ?',
            (request_id,)
        )
        hug_request = cursor.fetchone()
        
        # Convert to dict
        request_dict = dict(hug_request)
        
        # Convert is_public to boolean
        request_dict['is_public'] = bool(request_dict['is_public'])
        
        # Notify the recipient if specific (in a real system, use notification service)
        if recipient_id:
            try:
                # This is a placeholder for actual notification logic
                logger.info(f"Notifying user {recipient_id} about hug request {request_id}")
            except Exception as e:
                logger.error(f"Error notifying recipient: {str(e)}")
        
        # For public requests, broadcast to community (placeholder)
        if is_public:
            try:
                # This is a placeholder for actual broadcast logic
                logger.info(f"Broadcasting public hug request {request_id}")
            except Exception as e:
                logger.error(f"Error broadcasting request: {str(e)}")
        
        return request_dict
    except Exception as e:
        logger.error(f"Error creating hug request: {str(e)}")
        return None

def respond_to_hug_request(responder_id, request_id, accept, response_data=None):
    """Respond to a hug request"""
    db = get_db()
    cursor = db.cursor()
    
    # Check if the request exists and is pending
    cursor.execute(
        'SELECT * FROM hug_requests WHERE id = ? AND status = "pending"',
        (request_id,)
    )
    hug_request = cursor.fetchone()
    
    if not hug_request:
        return {
            'success': False,
            'message': 'Hug request not found or already responded to'
        }
    
    # Check if this is a directed request and if responder is the recipient
    if hug_request['recipient_id'] is not None and hug_request['recipient_id'] != responder_id:
        return {
            'success': False,
            'message': 'Not authorized to respond to this request'
        }
    
    # Update the request status
    status = 'accepted' if accept else 'declined'
    
    try:
        cursor.execute(
            'UPDATE hug_requests SET status = ? WHERE id = ?',
            (status, request_id)
        )
        db.commit()
        
        result = {
            'success': True,
            'message': f'Hug request {status}',
            'hug': None
        }
        
        # If accepted, create a hug
        if accept:
            # Extract message from response data if provided
            message = response_data.get('message') if response_data else None
            
            # Create hug data
            hug_data = {
                'recipientId': hug_request['requester_id'],
                'hugType': response_data.get('hugType', 'comfort'),  # Default to comfort hug
                'message': message
            }
            
            # Send the hug
            hug = send_hug(responder_id, hug_data)
            
            if hug:
                result['hug'] = hug
            else:
                result['message'] = 'Accepted but failed to create hug'
        
        return result
    except Exception as e:
        logger.error(f"Error responding to hug request: {str(e)}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }

def create_group_hug(creator_id, group_data):
    """Create a group hug"""
    db = get_db()
    cursor = db.cursor()
    
    title = group_data.get('title')
    description = group_data.get('description')
    hug_type = group_data.get('hugType')
    is_public = 1 if group_data.get('isPublic', False) else 0
    initial_participants = group_data.get('initialParticipantIds', [])
    
    # Generate a UUID for the group
    group_id = str(uuid.uuid4())
    
    try:
        cursor.execute(
            '''
            INSERT INTO group_hugs (id, creator_id, title, description, hug_type, is_public)
            VALUES (?, ?, ?, ?, ?, ?)
            ''',
            (group_id, creator_id, title, description, hug_type, is_public)
        )
        
        # Add creator as a participant
        cursor.execute(
            'INSERT INTO group_hug_participants (group_id, user_id) VALUES (?, ?)',
            (group_id, creator_id)
        )
        
        # Add initial participants
        for participant_id in initial_participants:
            if participant_id != creator_id:  # Creator already added
                cursor.execute(
                    'INSERT INTO group_hug_participants (group_id, user_id) VALUES (?, ?)',
                    (group_id, participant_id)
                )
        
        db.commit()
        
        # Get the created group with participants
        group = get_group_hug(group_id)
        
        return group
    except Exception as e:
        logger.error(f"Error creating group hug: {str(e)}")
        return None

def join_group_hug(user_id, group_id):
    """Join a group hug"""
    db = get_db()
    cursor = db.cursor()
    
    # Check if the group exists
    cursor.execute('SELECT * FROM group_hugs WHERE id = ?', (group_id,))
    group = cursor.fetchone()
    
    if not group:
        return {
            'success': False,
            'message': 'Group hug not found'
        }
    
    # Check if the user is already a participant
    cursor.execute(
        'SELECT * FROM group_hug_participants WHERE group_id = ? AND user_id = ?',
        (group_id, user_id)
    )
    existing = cursor.fetchone()
    
    if existing:
        return {
            'success': True,
            'message': 'Already a participant',
            'participant': dict(existing)
        }
    
    # Add the user as a participant
    try:
        cursor.execute(
            'INSERT INTO group_hug_participants (group_id, user_id) VALUES (?, ?)',
            (group_id, user_id)
        )
        db.commit()
        
        # Get the participant record
        cursor.execute(
            'SELECT * FROM group_hug_participants WHERE group_id = ? AND user_id = ?',
            (group_id, user_id)
        )
        participant = cursor.fetchone()
        
        return {
            'success': True,
            'message': 'Joined group hug',
            'participant': dict(participant)
        }
    except Exception as e:
        logger.error(f"Error joining group hug: {str(e)}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }

def get_group_hug(group_id):
    """Get a group hug with its participants"""
    db = get_db()
    cursor = db.cursor()
    
    # Get the group
    cursor.execute('SELECT * FROM group_hugs WHERE id = ?', (group_id,))
    group = cursor.fetchone()
    
    if not group:
        return None
    
    # Convert to dict
    group_dict = dict(group)
    
    # Convert is_public to boolean
    group_dict['is_public'] = bool(group_dict['is_public'])
    
    # Get participants
    cursor.execute(
        '''
        SELECT p.*, u.username, u.display_name, u.avatar_url
        FROM group_hug_participants p
        LEFT JOIN user_profiles u ON p.user_id = u.id
        WHERE p.group_id = ?
        ORDER BY p.joined_at
        ''',
        (group_id,)
    )
    participants = cursor.fetchall()
    
    # Convert to list of dicts
    participant_list = []
    for participant in participants:
        participant_dict = dict(participant)
        participant_list.append(participant_dict)
    
    group_dict['participants'] = participant_list
    
    return group_dict

def get_user_sent_hugs(user_id, limit=50):
    """Get hugs sent by a user"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            '''
            SELECT * FROM hugs 
            WHERE sender_id = ? 
            ORDER BY created_at DESC
            LIMIT ?
            ''',
            (user_id, limit)
        )
        hugs = cursor.fetchall()
        
        # Convert to list of dicts
        hug_list = []
        for hug in hugs:
            hug_dict = dict(hug)
            hug_list.append(hug_dict)
        
        return hug_list
    except Exception as e:
        logger.error(f"Error getting sent hugs: {str(e)}")
        return []

def get_user_received_hugs(user_id, limit=50):
    """Get hugs received by a user"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            '''
            SELECT * FROM hugs 
            WHERE recipient_id = ? 
            ORDER BY created_at DESC
            LIMIT ?
            ''',
            (user_id, limit)
        )
        hugs = cursor.fetchall()
        
        # Convert to list of dicts
        hug_list = []
        for hug in hugs:
            hug_dict = dict(hug)
            hug_list.append(hug_dict)
        
        return hug_list
    except Exception as e:
        logger.error(f"Error getting received hugs: {str(e)}")
        return []

def get_user_hug_requests(user_id, limit=50):
    """Get hug requests for a user"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            '''
            SELECT * FROM hug_requests 
            WHERE recipient_id = ? OR (is_public = 1 AND status = 'pending') 
            ORDER BY created_at DESC
            LIMIT ?
            ''',
            (user_id, limit)
        )
        requests = cursor.fetchall()
        
        # Convert to list of dicts
        request_list = []
        for req in requests:
            req_dict = dict(req)
            
            # Convert is_public to boolean
            req_dict['is_public'] = bool(req_dict['is_public'])
            
            request_list.append(req_dict)
        
        return request_list
    except Exception as e:
        logger.error(f"Error getting hug requests: {str(e)}")
        return []

def get_hug_types():
    """Get all available hug types"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute('SELECT * FROM hug_types ORDER BY name')
        types = cursor.fetchall()
        
        # Convert to list of dicts
        type_list = [dict(type_data) for type_data in types]
        
        return type_list
    except Exception as e:
        logger.error(f"Error getting hug types: {str(e)}")
        return []

def get_group_hugs(limit=20, user_id=None):
    """Get group hugs, optionally filtered by user participation"""
    db = get_db()
    cursor = db.cursor()
    
    try:
        if user_id:
            # Get groups the user is part of
            cursor.execute(
                '''
                SELECT g.* 
                FROM group_hugs g
                JOIN group_hug_participants p ON g.id = p.group_id
                WHERE p.user_id = ?
                ORDER BY g.created_at DESC
                LIMIT ?
                ''',
                (user_id, limit)
            )
        else:
            # Get public groups
            cursor.execute(
                '''
                SELECT * FROM group_hugs 
                WHERE is_public = 1
                ORDER BY created_at DESC
                LIMIT ?
                ''',
                (limit,)
            )
        
        groups = cursor.fetchall()
        
        # Convert to list of dicts and get participants
        group_list = []
        for group in groups:
            group_dict = dict(group)
            
            # Convert is_public to boolean
            group_dict['is_public'] = bool(group_dict['is_public'])
            
            # Get participants
            cursor.execute(
                '''
                SELECT p.*, u.username, u.display_name, u.avatar_url
                FROM group_hug_participants p
                LEFT JOIN user_profiles u ON p.user_id = u.id
                WHERE p.group_id = ?
                ORDER BY p.joined_at
                LIMIT 10
                ''',
                (group_dict['id'],)
            )
            participants = cursor.fetchall()
            
            # Convert to list of dicts
            participant_list = []
            for participant in participants:
                participant_dict = dict(participant)
                participant_list.append(participant_dict)
            
            group_dict['participants'] = participant_list
            
            # Get participant count
            cursor.execute(
                'SELECT COUNT(*) as count FROM group_hug_participants WHERE group_id = ?',
                (group_dict['id'],)
            )
            count = cursor.fetchone()
            group_dict['participantCount'] = count['count']
            
            group_list.append(group_dict)
        
        return group_list
    except Exception as e:
        logger.error(f"Error getting group hugs: {str(e)}")
        return []

# GraphQL Schema
type_defs = """
type Query {
    sentHugs(userId: ID!, limit: Int): [Hug]
    receivedHugs(userId: ID!, limit: Int): [Hug]
    hugRequests(userId: ID!, limit: Int): [HugRequest]
    groupHugs(limit: Int): [GroupHug]
    userGroupHugs(userId: ID!, limit: Int): [GroupHug]
    groupHug(id: ID!): GroupHug
    hugTypes: [HugType]
    hug(id: ID!): Hug
}

type Mutation {
    sendHug(input: HugInput!): Hug
    requestHug(input: HugRequestInput!): HugRequest
    respondToHugRequest(requestId: ID!, accept: Boolean!, response: HugResponseInput): HugRequestResponse
    createGroupHug(input: GroupHugInput!): GroupHug
    joinGroupHug(groupId: ID!): GroupHugJoinResult
    leaveGroupHug(groupId: ID!): Boolean
}

type Hug {
    id: ID!
    senderId: ID!
    recipientId: ID!
    hugType: String!
    message: String
    createdAt: String!
    sender: User
    recipient: User
}

type HugRequest {
    id: ID!
    requesterId: ID!
    recipientId: ID
    isPublic: Boolean!
    message: String
    status: String!
    createdAt: String!
    requester: User
    recipient: User
}

type HugRequestResponse {
    success: Boolean!
    message: String
    hug: Hug
}

type GroupHug {
    id: ID!
    creatorId: ID!
    title: String!
    description: String
    hugType: String!
    isPublic: Boolean!
    participants: [GroupHugParticipant]
    participantCount: Int
    createdAt: String!
    creator: User
}

type GroupHugParticipant {
    id: ID!
    groupId: ID!
    userId: ID!
    joinedAt: String!
    user: User
    username: String
    displayName: String
    avatarUrl: String
}

type GroupHugJoinResult {
    success: Boolean!
    message: String
    participant: GroupHugParticipant
}

type HugType {
    id: ID!
    name: String!
    description: String
    imageUrl: String
    category: String
    createdAt: String!
}

type User {
    id: ID!
    username: String
    displayName: String
    avatarUrl: String
}

input HugInput {
    recipientId: ID!
    hugType: String!
    message: String
}

input HugRequestInput {
    recipientId: ID
    isPublic: Boolean!
    message: String
}

input HugResponseInput {
    hugType: String
    message: String
}

input GroupHugInput {
    title: String!
    description: String
    hugType: String!
    isPublic: Boolean!
    initialParticipantIds: [ID]
}
"""

# GraphQL resolvers
query = QueryType()
mutation = MutationType()
hug_type = ObjectType("Hug")
request_type = ObjectType("HugRequest")
group_type = ObjectType("GroupHug")

@query.field("sentHugs")
def resolve_sent_hugs(_, info, userId, limit=50):
    return get_user_sent_hugs(userId, limit)

@query.field("receivedHugs")
def resolve_received_hugs(_, info, userId, limit=50):
    return get_user_received_hugs(userId, limit)

@query.field("hugRequests")
def resolve_hug_requests(_, info, userId, limit=50):
    return get_user_hug_requests(userId, limit)

@query.field("groupHugs")
def resolve_group_hugs(_, info, limit=20):
    return get_group_hugs(limit)

@query.field("userGroupHugs")
def resolve_user_group_hugs(_, info, userId, limit=20):
    return get_group_hugs(limit, userId)

@query.field("groupHug")
def resolve_group_hug(_, info, id):
    return get_group_hug(id)

@query.field("hugTypes")
def resolve_hug_types(_, info):
    return get_hug_types()

@query.field("hug")
def resolve_hug(_, info, id):
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute('SELECT * FROM hugs WHERE id = ?', (id,))
        hug = cursor.fetchone()
        
        if not hug:
            return None
        
        return dict(hug)
    except Exception as e:
        logger.error(f"Error getting hug: {str(e)}")
        return None

@mutation.field("sendHug")
def resolve_send_hug(_, info, input):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    return send_hug(user['id'], input)

@mutation.field("requestHug")
def resolve_request_hug(_, info, input):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    return request_hug(user['id'], input)

@mutation.field("respondToHugRequest")
def resolve_respond_to_hug_request(_, info, requestId, accept, response=None):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    return respond_to_hug_request(user['id'], requestId, accept, response)

@mutation.field("createGroupHug")
def resolve_create_group_hug(_, info, input):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    return create_group_hug(user['id'], input)

@mutation.field("joinGroupHug")
def resolve_join_group_hug(_, info, groupId):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    return join_group_hug(user['id'], groupId)

@mutation.field("leaveGroupHug")
def resolve_leave_group_hug(_, info, groupId):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            'DELETE FROM group_hug_participants WHERE group_id = ? AND user_id = ?',
            (groupId, user['id'])
        )
        db.commit()
        
        return True
    except Exception as e:
        logger.error(f"Error leaving group hug: {str(e)}")
        raise Exception(f"Error leaving group hug: {str(e)}")

# User field resolvers
@hug_type.field("sender")
def resolve_hug_sender(obj, info):
    sender_id = obj.get('sender_id')
    
    # In a real implementation, fetch user data from User service
    # This is a placeholder
    return {
        'id': sender_id,
        'username': f'user{sender_id}',
        'displayName': f'User {sender_id}',
        'avatarUrl': None
    }

@hug_type.field("recipient")
def resolve_hug_recipient(obj, info):
    recipient_id = obj.get('recipient_id')
    
    # In a real implementation, fetch user data from User service
    # This is a placeholder
    return {
        'id': recipient_id,
        'username': f'user{recipient_id}',
        'displayName': f'User {recipient_id}',
        'avatarUrl': None
    }

@request_type.field("requester")
def resolve_request_requester(obj, info):
    requester_id = obj.get('requester_id')
    
    # In a real implementation, fetch user data from User service
    # This is a placeholder
    return {
        'id': requester_id,
        'username': f'user{requester_id}',
        'displayName': f'User {requester_id}',
        'avatarUrl': None
    }

@request_type.field("recipient")
def resolve_request_recipient(obj, info):
    recipient_id = obj.get('recipient_id')
    
    if not recipient_id:
        return None
    
    # In a real implementation, fetch user data from User service
    # This is a placeholder
    return {
        'id': recipient_id,
        'username': f'user{recipient_id}',
        'displayName': f'User {recipient_id}',
        'avatarUrl': None
    }

@group_type.field("creator")
def resolve_group_creator(obj, info):
    creator_id = obj.get('creator_id')
    
    # In a real implementation, fetch user data from User service
    # This is a placeholder
    return {
        'id': creator_id,
        'username': f'user{creator_id}',
        'displayName': f'User {creator_id}',
        'avatarUrl': None
    }

# Create executable schema
schema = make_executable_schema(type_defs, query, mutation, hug_type, request_type, group_type)

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

@app.route('/hugs', methods=['POST'])
def send_hug_api():
    """Send a hug to a recipient"""
    user = get_user_from_header()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    hug_data = request.get_json()
    hug = send_hug(user['id'], hug_data)
    
    if not hug:
        return jsonify({'error': 'Failed to send hug'}), 500
    
    return jsonify(hug), 201

@app.route('/hug-requests', methods=['POST'])
def request_hug_api():
    """Request a hug"""
    user = get_user_from_header()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    request_data = request.get_json()
    hug_request = request_hug(user['id'], request_data)
    
    if not hug_request:
        return jsonify({'error': 'Failed to create hug request'}), 500
    
    return jsonify(hug_request), 201

@app.route('/hug-requests/<request_id>/respond', methods=['POST'])
def respond_to_hug_request_api(request_id):
    """Respond to a hug request"""
    user = get_user_from_header()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    data = request.get_json()
    accept = data.get('accept', False)
    response_data = data.get('response')
    
    result = respond_to_hug_request(user['id'], request_id, accept, response_data)
    
    if not result['success']:
        return jsonify({'error': result['message']}), 400
    
    return jsonify(result), 200

@app.route('/group-hugs', methods=['POST'])
def create_group_hug_api():
    """Create a group hug"""
    user = get_user_from_header()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    group_data = request.get_json()
    group = create_group_hug(user['id'], group_data)
    
    if not group:
        return jsonify({'error': 'Failed to create group hug'}), 500
    
    return jsonify(group), 201

@app.route('/group-hugs/<group_id>/join', methods=['POST'])
def join_group_hug_api(group_id):
    """Join a group hug"""
    user = get_user_from_header()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    result = join_group_hug(user['id'], group_id)
    
    if not result['success']:
        return jsonify({'error': result['message']}), 400
    
    return jsonify(result), 200

@app.route('/group-hugs/<group_id>/leave', methods=['POST'])
def leave_group_hug_api(group_id):
    """Leave a group hug"""
    user = get_user_from_header()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    db = get_db()
    cursor = db.cursor()
    
    try:
        cursor.execute(
            'DELETE FROM group_hug_participants WHERE group_id = ? AND user_id = ?',
            (group_id, user['id'])
        )
        db.commit()
        
        return jsonify({'success': True}), 200
    except Exception as e:
        logger.error(f"Error leaving group hug: {str(e)}")
        return jsonify({'error': f'Error leaving group hug: {str(e)}'}), 500

@app.route('/users/<int:user_id>/sent-hugs', methods=['GET'])
def get_sent_hugs_api(user_id):
    """Get hugs sent by a user"""
    limit = request.args.get('limit', 50, type=int)
    hugs = get_user_sent_hugs(user_id, limit)
    return jsonify(hugs), 200

@app.route('/users/<int:user_id>/received-hugs', methods=['GET'])
def get_received_hugs_api(user_id):
    """Get hugs received by a user"""
    limit = request.args.get('limit', 50, type=int)
    hugs = get_user_received_hugs(user_id, limit)
    return jsonify(hugs), 200

@app.route('/users/<int:user_id>/hug-requests', methods=['GET'])
def get_hug_requests_api(user_id):
    """Get hug requests for a user"""
    limit = request.args.get('limit', 50, type=int)
    requests = get_user_hug_requests(user_id, limit)
    return jsonify(requests), 200

@app.route('/group-hugs', methods=['GET'])
def get_group_hugs_api():
    """Get public group hugs"""
    limit = request.args.get('limit', 20, type=int)
    groups = get_group_hugs(limit)
    return jsonify(groups), 200

@app.route('/users/<int:user_id>/group-hugs', methods=['GET'])
def get_user_group_hugs_api(user_id):
    """Get group hugs for a user"""
    limit = request.args.get('limit', 20, type=int)
    groups = get_group_hugs(limit, user_id)
    return jsonify(groups), 200

@app.route('/group-hugs/<group_id>', methods=['GET'])
def get_group_hug_api(group_id):
    """Get a specific group hug"""
    group = get_group_hug(group_id)
    
    if not group:
        return jsonify({'error': 'Group hug not found'}), 404
    
    return jsonify(group), 200

@app.route('/data/hug-types', methods=['GET'])
def get_hug_types_api():
    """Get all available hug types"""
    types = get_hug_types()
    return jsonify(types), 200

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'hug'}), 200

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Start server
    app.run(host='0.0.0.0', port=PORT)
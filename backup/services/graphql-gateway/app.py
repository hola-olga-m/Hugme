"""
HugMood GraphQL API Gateway

A unified GraphQL API gateway that orchestrates requests across microservices.
Implements a GraphQL mesh pattern for federated queries across service boundaries.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sockets import Sockets
import os
import jwt
import json
import logging
import requests
from ariadne import load_schema_from_path, make_executable_schema, graphql_sync
from ariadne import ObjectType, QueryType, MutationType, SubscriptionType
from ariadne.constants import PLAYGROUND_HTML
from ariadne.asgi.graphql_ws import GraphQLWSConsumer
from functools import wraps
from uuid import uuid4
from datetime import datetime, timedelta

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)
sockets = Sockets(app)

# Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key')
PORT = int(os.environ.get('PORT', 5000))
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

# Service URLs
AUTH_SERVICE_URL = os.environ.get('AUTH_SERVICE_URL', 'http://localhost:5001')
USER_SERVICE_URL = os.environ.get('USER_SERVICE_URL', 'http://localhost:5002')
MOOD_SERVICE_URL = os.environ.get('MOOD_SERVICE_URL', 'http://localhost:5003')
HUG_SERVICE_URL = os.environ.get('HUG_SERVICE_URL', 'http://localhost:5004')
SOCIAL_SERVICE_URL = os.environ.get('SOCIAL_SERVICE_URL', 'http://localhost:5005')
STREAK_SERVICE_URL = os.environ.get('STREAK_SERVICE_URL', 'http://localhost:5006')

# WebSocket clients
ws_clients = {}

# Authentication utilities
def get_token_from_request():
    """Extract JWT token from request headers"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    
    try:
        return auth_header.split(' ')[1]
    except (IndexError, AttributeError):
        return None

def authenticate():
    """Verify JWT token and return payload"""
    token = get_token_from_request()
    if not token:
        return None
    
    try:
        # Verify token with Auth service
        response = requests.post(
            f"{AUTH_SERVICE_URL}/graphql",
            json={
                "query": """
                query ValidateToken($token: String!) {
                    validateToken(token: $token) {
                        valid
                        user {
                            id
                            username
                        }
                    }
                }
                """,
                "variables": {"token": token}
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('data') and result['data'].get('validateToken'):
                validation = result['data']['validateToken']
                if validation.get('valid') and validation.get('user'):
                    return validation['user']
        
        # Fallback to local validation if Auth service is unavailable
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return {'id': payload.get('id')}
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return None

def login_required(f):
    """Decorator for endpoints requiring authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = authenticate()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        # Add user to request context
        request.user = user
        
        return f(*args, **kwargs)
    return decorated_function

# GraphQL Schema
type_defs = """
type Query {
    # User-related queries
    me: User
    user(id: ID!): User
    searchUsers(query: String!, limit: Int): [User]
    
    # Mood-related queries
    moodHistory(userId: ID!, limit: Int): [Mood]
    moodAnalytics(userId: ID!, timeRange: Int): MoodAnalytics
    
    # Hug-related queries
    receivedHugs(userId: ID!, limit: Int): [Hug]
    sentHugs(userId: ID!, limit: Int): [Hug]
    hugRequests(userId: ID!, limit: Int): [HugRequest]
    groupHugs(limit: Int): [GroupHug]
    
    # Social-related queries
    followers(userId: ID!, limit: Int): [User]
    following(userId: ID!, limit: Int): [User]
    
    # Streak-related queries
    userStreak(userId: ID!): UserStreak
    streakLeaderboard(limit: Int): [UserStreak]
    
    # Badges
    badges: [Badge]
    userBadges(userId: ID!): [Badge]
}

type Mutation {
    # Auth mutations
    login(email: String!, password: String!): AuthPayload
    register(input: RegisterInput!): AuthPayload
    refreshToken(token: String!): AuthPayload
    logout: Boolean
    changePassword(currentPassword: String!, newPassword: String!): PasswordChangeResult
    
    # User profile mutations
    updateProfile(input: UpdateProfileInput!): User
    
    # Mood mutations
    createMood(input: MoodInput!): Mood
    
    # Hug mutations
    sendHug(input: HugInput!): Hug
    requestHug(input: HugRequestInput!): HugRequest
    respondToHugRequest(requestId: ID!, accept: Boolean!): HugRequestResponse
    createGroupHug(input: GroupHugInput!): GroupHug
    joinGroupHug(groupId: ID!): GroupHugParticipant
    
    # Social mutations
    followUser(userId: ID!, follow: Boolean!): FollowResult
    shareToSocial(input: SocialShareInput!): SocialShareResult
}

type Subscription {
    userOnlineStatus(userId: ID!): OnlineStatusUpdate
    newHug(userId: ID): Hug
    newHugRequest(userId: ID): HugRequest
    moodUpdate(userId: ID): Mood
    streakUpdate(userId: ID): UserStreak
    newGroupHug: GroupHug
}

# Auth types
type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
}

type PasswordChangeResult {
    success: Boolean!
    message: String
}

# User types
type User {
    id: ID!
    username: String!
    email: String
    displayName: String
    avatarUrl: String
    bio: String
    location: String
    website: String
    isOnline: Boolean
    lastOnline: String
    createdAt: String!
    updatedAt: String
    badges: [Badge]
    mood: Mood
    streak: UserStreak
    sentHugs: [Hug]
    receivedHugs: [Hug]
    followers: [User]
    following: [User]
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

# Mood types
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

# Hug types
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
    createdAt: String!
    creator: User
}

type GroupHugParticipant {
    id: ID!
    groupId: ID!
    userId: ID!
    joinedAt: String!
    user: User
}

# Social types
type FollowResult {
    success: Boolean!
    message: String
}

type SocialShareResult {
    success: Boolean!
    message: String
    url: String
}

type OnlineStatusUpdate {
    userId: ID!
    isOnline: Boolean!
    lastOnline: String
}

# Streak types
type UserStreak {
    id: ID!
    userId: ID!
    currentStreak: Int!
    longestStreak: Int!
    streakStartDate: String
    lastActivityDate: String
    totalPoints: Int!
    level: Int!
    createdAt: String!
    updatedAt: String!
    user: User
}

# Scalar type for arbitrary JSON
scalar JSONObject

# Input types
input RegisterInput {
    username: String!
    email: String!
    password: String!
    displayName: String
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

input MoodInput {
    mood: String!
    score: Int!
    note: String
    activities: [String]
    isPublic: Boolean
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

input GroupHugInput {
    title: String!
    description: String
    hugType: String!
    isPublic: Boolean!
    initialParticipantIds: [ID]
}

input SocialShareInput {
    platform: String!
    contentType: String!
    contentId: ID!
    message: String
}
"""

# Initialize resolvers
query = QueryType()
mutation = MutationType()
subscription = SubscriptionType()
user_type = ObjectType("User")
mood_type = ObjectType("Mood")

# Query resolvers
@query.field("me")
def resolve_me(_, info):
    context = info.context
    user = context.get('user')
    
    if not user:
        return None
    
    try:
        # Forward to User service
        response = requests.get(
            f"{USER_SERVICE_URL}/users/{user['id']}",
            headers={'X-User-ID': str(user['id'])}
        )
        
        if response.status_code == 200:
            return response.json()
        
        return None
    except Exception as e:
        logger.error(f"Error fetching current user: {str(e)}")
        return None

@query.field("user")
def resolve_user(_, info, id):
    try:
        # Forward to User service
        response = requests.get(f"{USER_SERVICE_URL}/users/{id}")
        
        if response.status_code == 200:
            return response.json()
        
        return None
    except Exception as e:
        logger.error(f"Error fetching user: {str(e)}")
        return None

@query.field("mood_history")
def resolve_mood_history(_, info, userId, limit=None):
    try:
        # Forward to Mood service (placeholder)
        # In a real implementation, this would call the Mood microservice
        return []
    except Exception as e:
        logger.error(f"Error fetching mood history: {str(e)}")
        return []

# Mutation resolvers
@mutation.field("login")
def resolve_login(_, info, email, password):
    try:
        # Forward to Auth service
        response = requests.post(
            f"{AUTH_SERVICE_URL}/auth/login",
            json={"email": email, "password": password}
        )
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 401:
            raise Exception("Invalid email or password")
        else:
            raise Exception("Authentication service error")
    except requests.RequestException as e:
        logger.error(f"Error connecting to Auth service: {str(e)}")
        raise Exception("Authentication service unavailable")

@mutation.field("register")
def resolve_register(_, info, input):
    try:
        # Forward to Auth service
        response = requests.post(
            f"{AUTH_SERVICE_URL}/auth/register",
            json=input
        )
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 409:
            error_data = response.json()
            raise Exception(error_data.get('error', 'Registration failed'))
        else:
            raise Exception("Authentication service error")
    except requests.RequestException as e:
        logger.error(f"Error connecting to Auth service: {str(e)}")
        raise Exception("Authentication service unavailable")

@mutation.field("create_mood")
def resolve_create_mood(_, info, input):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    # In a real implementation, this would call the Mood microservice
    return None

@mutation.field("send_hug")
def resolve_send_hug(_, info, input):
    context = info.context
    user = context.get('user')
    
    if not user:
        raise Exception("Authentication required")
    
    # In a real implementation, this would call the Hug microservice
    return None

# User field resolvers
@user_type.field("sent_hugs")
def resolve_sent_hugs(obj, info):
    # In a real implementation, this would call the Hug microservice
    return []

@user_type.field("received_hugs")
def resolve_received_hugs(obj, info):
    # In a real implementation, this would call the Hug microservice
    return []

@user_type.field("followers")
def resolve_followers(obj, info):
    # In a real implementation, this would call the Social microservice
    return []

@user_type.field("following")
def resolve_following(obj, info):
    # In a real implementation, this would call the Social microservice
    return []

@user_type.field("user_mood_history")
def resolve_user_mood_history(obj, info):
    # In a real implementation, this would call the Mood microservice
    return []

@user_type.field("user_streak")
def resolve_user_streak(obj, info):
    # In a real implementation, this would call the Streak microservice
    return None

# Create executable schema
schema = make_executable_schema(type_defs, query, mutation, subscription, user_type, mood_type)

# Authentication middleware for GraphQL
def get_graphql_context():
    user = authenticate()
    return {'user': user}

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
        context_value=get_graphql_context(),
        debug=app.debug
    )
    
    status_code = 200 if success else 400
    return jsonify(result), status_code

# WebSocket GraphQL endpoint
@sockets.route('/graphql')
def graphql_ws(ws):
    client_id = str(uuid4())
    ws_clients[client_id] = {
        'ws': ws,
        'authenticated': False,
        'user_id': None
    }
    
    logger.info(f"WebSocket client connected: {client_id}")
    
    try:
        while not ws.closed:
            message = ws.receive()
            if message:
                try:
                    data = json.loads(message)
                    handle_graphql_ws_message(ws, data, client_id)
                except json.JSONDecodeError:
                    logger.error(f"Invalid WebSocket message format: {message}")
                except Exception as e:
                    logger.error(f"Error handling WebSocket message: {str(e)}")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
    finally:
        if client_id in ws_clients:
            # Notify others if an authenticated user went offline
            if ws_clients[client_id]['authenticated'] and ws_clients[client_id]['user_id']:
                user_id = ws_clients[client_id]['user_id']
                # Set user offline in User service
                try:
                    requests.put(
                        f"{USER_SERVICE_URL}/users/{user_id}/online",
                        json={'isOnline': False},
                        headers={'X-User-ID': str(user_id)}
                    )
                except Exception as e:
                    logger.error(f"Error setting user offline: {str(e)}")
                
                # Broadcast to other clients
                broadcast_user_status(user_id, False)
            
            del ws_clients[client_id]
            logger.info(f"WebSocket client disconnected: {client_id}")

def handle_graphql_ws_message(ws, data, client_id):
    """Handle GraphQL WebSocket message"""
    message_type = data.get('type')
    
    if message_type == 'connection_init':
        # Authentication via connection params
        payload = data.get('payload', {})
        token = payload.get('authToken')
        
        if token:
            try:
                # Verify token with Auth service
                response = requests.post(
                    f"{AUTH_SERVICE_URL}/graphql",
                    json={
                        "query": """
                        query ValidateToken($token: String!) {
                            validateToken(token: $token) {
                                valid
                                user {
                                    id
                                    username
                                }
                            }
                        }
                        """,
                        "variables": {"token": token}
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get('data') and result['data'].get('validateToken'):
                        validation = result['data']['validateToken']
                        if validation.get('valid') and validation.get('user'):
                            user = validation['user']
                            ws_clients[client_id]['authenticated'] = True
                            ws_clients[client_id]['user_id'] = user['id']
                            
                            # Set user online in User service
                            try:
                                requests.put(
                                    f"{USER_SERVICE_URL}/users/{user['id']}/online",
                                    json={'isOnline': True},
                                    headers={'X-User-ID': str(user['id'])}
                                )
                            except Exception as e:
                                logger.error(f"Error setting user online: {str(e)}")
                            
                            # Broadcast to other clients
                            broadcast_user_status(user['id'], True)
            except Exception as e:
                logger.error(f"Error during WebSocket authentication: {str(e)}")
        
        # Acknowledge the connection
        ws.send(json.dumps({
            'type': 'connection_ack'
        }))
    
    elif message_type == 'subscribe':
        # Handle subscription
        # This is a simplified example - a real implementation would use a proper subscription server
        subscription_id = data.get('id')
        payload = data.get('payload', {})
        
        # Send initial dummy data for now
        # In a real implementation, this would register the subscription and send updates when available
        ws.send(json.dumps({
            'type': 'next',
            'id': subscription_id,
            'payload': {
                'data': {
                    # Example data based on common subscriptions
                    'userOnlineStatus': {
                        'userId': '1',
                        'isOnline': True,
                        'lastOnline': datetime.utcnow().isoformat()
                    }
                }
            }
        }))
    
    elif message_type == 'complete':
        # Client is unsubscribing
        pass

def broadcast_user_status(user_id, is_online):
    """Broadcast user online status to subscribed clients"""
    last_online = datetime.utcnow().isoformat() if not is_online else None
    
    status_update = {
        'type': 'next',
        'payload': {
            'data': {
                'userOnlineStatus': {
                    'userId': str(user_id),
                    'isOnline': is_online,
                    'lastOnline': last_online
                }
            }
        }
    }
    
    # Send to all authenticated clients who might be subscribed
    for client_id, client in ws_clients.items():
        if client['authenticated']:
            try:
                # In a real implementation, we would check if the client is actually subscribed to this user's status
                status_update['id'] = f"userStatus_{user_id}"  # Using a predictable ID for the example
                client['ws'].send(json.dumps(status_update))
            except Exception as e:
                logger.error(f"Error broadcasting user status: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    # Check health of all services
    services_health = check_services_health()
    
    all_healthy = all(service['status'] == 'healthy' for service in services_health.values())
    status_code = 200 if all_healthy else 503
    
    return jsonify({
        'status': 'healthy' if all_healthy else 'degraded',
        'services': services_health
    }), status_code

def check_services_health():
    """Check health of all microservices"""
    services = {
        'auth': AUTH_SERVICE_URL,
        'user': USER_SERVICE_URL,
        'gateway': 'self'
    }
    
    health_status = {}
    
    for name, url in services.items():
        if url == 'self':
            health_status[name] = {
                'status': 'healthy',
                'url': 'self'
            }
            continue
        
        try:
            response = requests.get(f"{url}/health", timeout=2)
            health_status[name] = {
                'status': 'healthy' if response.status_code == 200 else 'unhealthy',
                'url': url
            }
        except requests.RequestException:
            health_status[name] = {
                'status': 'unhealthy',
                'url': url
            }
    
    return health_status

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    
    server = pywsgi.WSGIServer(('0.0.0.0', PORT), app, handler_class=WebSocketHandler)
    logger.info(f"Starting GraphQL Gateway on port {PORT}")
    server.serve_forever()
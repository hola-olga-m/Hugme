"""
HugMood API Gateway Service

Flask-based API Gateway that routes requests to appropriate microservices.
Handles authentication, request forwarding, and WebSocket connections.
"""

from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
from flask_sockets import Sockets
import os
import jwt
import json
import logging
import requests
from uuid import uuid4
from datetime import datetime, timedelta
from functools import wraps

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)
sockets = Sockets(app)

# Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key')
PORT = int(os.environ.get('PORT', 4000))
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

# Service URLs
AUTH_SERVICE_URL = os.environ.get('AUTH_SERVICE_URL', 'http://localhost:5001')
USER_SERVICE_URL = os.environ.get('USER_SERVICE_URL', 'http://localhost:5002')
MOOD_SERVICE_URL = os.environ.get('MOOD_SERVICE_URL', 'http://localhost:5003')
HUG_SERVICE_URL = os.environ.get('HUG_SERVICE_URL', 'http://localhost:5004')
SOCIAL_SERVICE_URL = os.environ.get('SOCIAL_SERVICE_URL', 'http://localhost:5005')
STREAK_SERVICE_URL = os.environ.get('STREAK_SERVICE_URL', 'http://localhost:5006')
GRAPHQL_GATEWAY_URL = os.environ.get('GRAPHQL_GATEWAY_URL', 'http://localhost:5000')

# WebSocket clients
ws_clients = {}

# Authentication utilities
def authenticate():
    """Verify JWT token from Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    
    try:
        # Extract token
        token = auth_header.split(' ')[1]
        
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
                            email
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
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return {'id': payload.get('id')}
        except:
            return None
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

def optional_auth(f):
    """Decorator that attaches user info if authenticated but doesn't require it"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = authenticate()
        request.user = user  # May be None
        return f(*args, **kwargs)
    return decorated_function

def forward_request(service, path, method='GET', data=None, headers=None):
    """Forward request to microservice and return response"""
    url = f"{service}{path}"
    
    # Forward headers
    forwarded_headers = {}
    if headers:
        forwarded_headers.update(headers)
    
    # Add user ID header if authenticated
    if hasattr(request, 'user') and request.user:
        forwarded_headers['X-User-ID'] = str(request.user['id'])
    
    try:
        # Make request to service
        if method == 'GET':
            response = requests.get(url, headers=forwarded_headers)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=forwarded_headers)
        elif method == 'PUT':
            response = requests.put(url, json=data, headers=forwarded_headers)
        elif method == 'DELETE':
            response = requests.delete(url, headers=forwarded_headers)
        else:
            return jsonify({'error': f'Unsupported method: {method}'}), 400
        
        # Return response from service
        return response.json(), response.status_code
    except requests.RequestException as e:
        logger.error(f"Error forwarding request to {url}: {str(e)}")
        return {
            'error': 'Service unavailable',
            'details': str(e)
        }, 503

# REST API Endpoints

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    services_status = {}
    
    # Check each service
    services = {
        'auth': AUTH_SERVICE_URL,
        'user': USER_SERVICE_URL,
        'graphql': GRAPHQL_GATEWAY_URL,
        'gateway': 'self'
    }
    
    for name, url in services.items():
        if url == 'self':
            services_status[name] = {
                'status': 'healthy',
                'url': 'self'
            }
            continue
        
        try:
            response = requests.get(f"{url}/health", timeout=2)
            services_status[name] = {
                'status': 'healthy' if response.status_code == 200 else 'unhealthy',
                'url': url
            }
        except requests.RequestException:
            services_status[name] = {
                'status': 'unhealthy',
                'url': url
            }
    
    all_healthy = all(service['status'] == 'healthy' for service in services_status.values())
    
    return jsonify({
        'status': 'healthy' if all_healthy else 'degraded',
        'services': services_status
    }), 200 if all_healthy else 503

# Auth endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    """Forward login request to Auth service"""
    data = request.json
    return forward_request(AUTH_SERVICE_URL, '/auth/login', method='POST', data=data)

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Forward registration request to Auth service"""
    data = request.json
    return forward_request(AUTH_SERVICE_URL, '/auth/register', method='POST', data=data)

@app.route('/api/auth/token', methods=['POST'])
def refresh_token():
    """Forward token refresh request to Auth service"""
    data = request.json
    return forward_request(AUTH_SERVICE_URL, '/auth/token', method='POST', data=data)

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Forward logout request to Auth service"""
    return forward_request(AUTH_SERVICE_URL, '/auth/logout', method='POST')

# User endpoints
@app.route('/api/users/<user_id>', methods=['GET'])
@optional_auth
def get_user(user_id):
    """Get user profile"""
    return forward_request(USER_SERVICE_URL, f'/users/{user_id}')

@app.route('/api/users/<user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    """Update user profile"""
    data = request.json
    return forward_request(USER_SERVICE_URL, f'/users/{user_id}', method='PUT', data=data)

@app.route('/api/users/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current user profile"""
    user_id = request.user['id']
    return forward_request(USER_SERVICE_URL, f'/users/{user_id}')

# Mood endpoints
@app.route('/api/moods', methods=['POST'])
@login_required
def create_mood():
    """Create mood entry"""
    data = request.json
    return forward_request(MOOD_SERVICE_URL, '/moods', method='POST', data=data)

@app.route('/api/users/<user_id>/moods', methods=['GET'])
@optional_auth
def get_moods(user_id):
    """Get mood history for a user"""
    return forward_request(MOOD_SERVICE_URL, f'/users/{user_id}/moods')

@app.route('/api/moods/feed', methods=['GET'])
@optional_auth
def get_mood_feed():
    """Get mood feed (public moods)"""
    return forward_request(MOOD_SERVICE_URL, '/moods/feed')

# Hug endpoints
@app.route('/api/hugs', methods=['POST'])
@login_required
def send_hug():
    """Send a hug"""
    data = request.json
    return forward_request(HUG_SERVICE_URL, '/hugs', method='POST', data=data)

@app.route('/api/hug-requests', methods=['POST'])
@login_required
def request_hug():
    """Request a hug"""
    data = request.json
    return forward_request(HUG_SERVICE_URL, '/hug-requests', method='POST', data=data)

@app.route('/api/users/<user_id>/received-hugs', methods=['GET'])
@optional_auth
def get_received_hugs(user_id):
    """Get hugs received by a user"""
    return forward_request(HUG_SERVICE_URL, f'/users/{user_id}/received-hugs')

@app.route('/api/users/<user_id>/sent-hugs', methods=['GET'])
@optional_auth
def get_sent_hugs(user_id):
    """Get hugs sent by a user"""
    return forward_request(HUG_SERVICE_URL, f'/users/{user_id}/sent-hugs')

@app.route('/api/group-hugs', methods=['POST'])
@login_required
def create_group_hug():
    """Create a group hug"""
    data = request.json
    return forward_request(HUG_SERVICE_URL, '/group-hugs', method='POST', data=data)

@app.route('/api/group-hugs/<group_id>/join', methods=['POST'])
@login_required
def join_group_hug(group_id):
    """Join a group hug"""
    return forward_request(HUG_SERVICE_URL, f'/group-hugs/{group_id}/join', method='POST')

# Social endpoints
@app.route('/api/follows', methods=['POST'])
@login_required
def follow_user():
    """Follow or unfollow a user"""
    data = request.json
    return forward_request(SOCIAL_SERVICE_URL, '/follows', method='POST', data=data)

@app.route('/api/users/<user_id>/followers', methods=['GET'])
@optional_auth
def get_followers(user_id):
    """Get followers for a user"""
    return forward_request(SOCIAL_SERVICE_URL, f'/users/{user_id}/followers')

@app.route('/api/users/<user_id>/following', methods=['GET'])
@optional_auth
def get_following(user_id):
    """Get users followed by a user"""
    return forward_request(SOCIAL_SERVICE_URL, f'/users/{user_id}/following')

@app.route('/api/share', methods=['POST'])
@login_required
def share_content():
    """Share content to social platform"""
    data = request.json
    return forward_request(SOCIAL_SERVICE_URL, '/share', method='POST', data=data)

# Streak endpoints
@app.route('/api/users/<user_id>/streaks', methods=['GET'])
@optional_auth
def get_streaks(user_id):
    """Get streak information for a user"""
    return forward_request(STREAK_SERVICE_URL, f'/users/{user_id}/streaks')

@app.route('/api/streaks/leaderboard', methods=['GET'])
def get_streak_leaderboard():
    """Get streak leaderboard"""
    return forward_request(STREAK_SERVICE_URL, '/streaks/leaderboard')

# Generic data fetch endpoint
@app.route('/api/data/<data_type>', methods=['GET'])
@optional_auth
def fetch_data(data_type):
    """Generic data fetching endpoint - routes to appropriate service"""
    # Map data types to services
    service_map = {
        'user_badges': USER_SERVICE_URL,
        'badges': USER_SERVICE_URL,
        'mood_analytics': MOOD_SERVICE_URL,
        'hug_types': HUG_SERVICE_URL,
        'streak_rewards': STREAK_SERVICE_URL
    }
    
    # Determine service based on data type
    service = service_map.get(data_type)
    if not service:
        return jsonify({'error': f'Unknown data type: {data_type}'}), 400
    
    # Map data types to endpoints
    endpoint_map = {
        'user_badges': '/data/user-badges',
        'badges': '/data/badges',
        'mood_analytics': '/data/mood-analytics',
        'hug_types': '/data/hug-types',
        'streak_rewards': '/data/streak-rewards'
    }
    
    endpoint = endpoint_map.get(data_type, f'/data/{data_type}')
    
    return forward_request(service, endpoint)

# GraphQL Proxy
@app.route('/graphql', methods=['GET', 'POST'])
def graphql_proxy():
    """Proxy GraphQL requests to GraphQL Gateway"""
    if request.method == 'GET':
        return redirect(f"{GRAPHQL_GATEWAY_URL}/graphql")
    
    # Forward POST request
    data = request.json
    headers = {
        'Content-Type': 'application/json'
    }
    
    # Forward Authorization header if present
    auth_header = request.headers.get('Authorization')
    if auth_header:
        headers['Authorization'] = auth_header
    
    return forward_request(GRAPHQL_GATEWAY_URL, '/graphql', method='POST', data=data, headers=headers)

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

# WebSocket endpoint
@sockets.route('/ws')
def websocket_endpoint(ws):
    """WebSocket endpoint for real-time communication"""
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
                    handle_websocket_message(ws, data, client_id)
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
            
            del ws_clients[client_id]
            logger.info(f"WebSocket client disconnected: {client_id}")

def handle_websocket_message(ws, data, client_id):
    """Process incoming WebSocket message"""
    message_type = data.get('type')
    
    # Handle authentication messages
    if message_type == 'auth':
        handle_authentication(ws, data, client_id)
        return
    
    # Require authentication for other message types
    if not ws_clients[client_id]['authenticated']:
        ws.send(json.dumps({
            'type': 'error',
            'error': 'Authentication required'
        }))
        return
    
    # Route message to appropriate handler
    if message_type == 'fetch_data':
        handle_fetch_data(ws, data, client_id)
    else:
        # Forward to appropriate service based on message type
        service_map = {
            'mood_update': MOOD_SERVICE_URL,
            'send_hug': HUG_SERVICE_URL,
            'request_hug': HUG_SERVICE_URL,
            'group_hug': HUG_SERVICE_URL,
            'follow_user': SOCIAL_SERVICE_URL,
            'social_share': SOCIAL_SERVICE_URL
        }
        
        service = service_map.get(message_type)
        if service:
            endpoint = f"/api/{message_type.replace('_', '-')}"
            handle_service_message(ws, data, client_id, service, endpoint)
        else:
            ws.send(json.dumps({
                'type': 'error',
                'error': f'Unknown message type: {message_type}'
            }))

def handle_authentication(ws, data, client_id):
    """Handle WebSocket authentication"""
    auth_data = data.get('data', {})
    token = auth_data.get('token')
    
    if not token:
        ws.send(json.dumps({
            'type': 'auth_response',
            'success': False,
            'error': 'Token is required'
        }))
        return
    
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
                            email
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
                    
                    ws.send(json.dumps({
                        'type': 'auth_response',
                        'success': True,
                        'user': user
                    }))
                    return
        
        # Token validation failed
        ws.send(json.dumps({
            'type': 'auth_response',
            'success': False,
            'error': 'Invalid token'
        }))
    except Exception as e:
        logger.error(f"Auth service error: {str(e)}")
        ws.send(json.dumps({
            'type': 'auth_response',
            'success': False,
            'error': 'Authentication service error'
        }))

def route_websocket_message(ws, data, client_id):
    """Route WebSocket message to appropriate service"""
    message_type = data.get('type')
    
    # Map message types to services
    service_map = {
        'mood_update': MOOD_SERVICE_URL,
        'send_hug': HUG_SERVICE_URL,
        'request_hug': HUG_SERVICE_URL,
        'group_hug': HUG_SERVICE_URL,
        'follow_user': SOCIAL_SERVICE_URL,
        'social_share': SOCIAL_SERVICE_URL
    }
    
    service = service_map.get(message_type)
    if not service:
        ws.send(json.dumps({
            'type': 'error',
            'error': f'Unknown message type: {message_type}'
        }))
        return
    
    # Map message types to endpoints
    endpoint_map = {
        'mood_update': '/api/moods',
        'send_hug': '/api/hugs',
        'request_hug': '/api/hug-requests',
        'group_hug': '/api/group-hugs',
        'follow_user': '/api/follows',
        'social_share': '/api/share'
    }
    
    endpoint = endpoint_map.get(message_type)
    handle_service_message(ws, data, client_id, service, endpoint)

def handle_fetch_data(ws, data, client_id):
    """Handle data fetching requests"""
    fetch_data = data.get('data', {})
    data_type = fetch_data.get('type')
    
    if not data_type:
        ws.send(json.dumps({
            'type': 'fetch_response',
            'success': False,
            'error': 'Data type is required'
        }))
        return
    
    # Map data types to services
    service_map = {
        'user_profile': USER_SERVICE_URL,
        'user_badges': USER_SERVICE_URL,
        'badges': USER_SERVICE_URL,
        'mood_history': MOOD_SERVICE_URL,
        'mood_analytics': MOOD_SERVICE_URL,
        'received_hugs': HUG_SERVICE_URL,
        'sent_hugs': HUG_SERVICE_URL,
        'hug_requests': HUG_SERVICE_URL,
        'group_hugs': HUG_SERVICE_URL,
        'followers': SOCIAL_SERVICE_URL,
        'following': SOCIAL_SERVICE_URL,
        'streak_info': STREAK_SERVICE_URL,
        'streak_rewards': STREAK_SERVICE_URL
    }
    
    service = service_map.get(data_type)
    if not service:
        ws.send(json.dumps({
            'type': 'fetch_response',
            'success': False,
            'error': f'Unknown data type: {data_type}'
        }))
        return
    
    # Map data types to endpoints
    endpoint_map = {
        'user_profile': '/users',
        'user_badges': '/users/{userId}/badges',
        'badges': '/data/badges',
        'mood_history': '/users/{userId}/moods',
        'mood_analytics': '/users/{userId}/mood-analytics',
        'received_hugs': '/users/{userId}/received-hugs',
        'sent_hugs': '/users/{userId}/sent-hugs',
        'hug_requests': '/users/{userId}/hug-requests',
        'group_hugs': '/group-hugs',
        'followers': '/users/{userId}/followers',
        'following': '/users/{userId}/following',
        'streak_info': '/users/{userId}/streaks',
        'streak_rewards': '/data/streak-rewards'
    }
    
    endpoint = endpoint_map.get(data_type)
    if not endpoint:
        ws.send(json.dumps({
            'type': 'fetch_response',
            'success': False,
            'error': f'No endpoint mapped for data type: {data_type}'
        }))
        return
    
    # Replace dynamic parts in the endpoint
    user_id = fetch_data.get('userId')
    if '{userId}' in endpoint:
        if not user_id:
            # If no userId provided, use the authenticated user's ID
            user_id = ws_clients[client_id]['user_id']
        
        endpoint = endpoint.replace('{userId}', str(user_id))
    
    # Make request to service
    try:
        response = requests.get(
            f"{service}{endpoint}",
            headers={'X-User-ID': str(ws_clients[client_id]['user_id'])}
        )
        
        if response.status_code == 200:
            ws.send(json.dumps({
                'type': 'fetch_response',
                'success': True,
                'data': {
                    'type': data_type,
                    'result': response.json()
                }
            }))
        else:
            ws.send(json.dumps({
                'type': 'fetch_response',
                'success': False,
                'error': f'Service returned error: {response.status_code}'
            }))
    except Exception as e:
        logger.error(f"Error fetching data from {service}{endpoint}: {str(e)}")
        ws.send(json.dumps({
            'type': 'fetch_response',
            'success': False,
            'error': 'Service unavailable'
        }))

def handle_service_message(ws, data, client_id, service, endpoint):
    """Forward WebSocket message to microservice via HTTP and return response"""
    message_data = data.get('data', {})
    
    try:
        response = requests.post(
            f"{service}{endpoint}",
            json=message_data,
            headers={'X-User-ID': str(ws_clients[client_id]['user_id'])}
        )
        
        if response.status_code == 200:
            ws.send(json.dumps({
                'type': f"{data['type']}_response",
                'success': True,
                'data': response.json()
            }))
        else:
            error_data = {}
            try:
                error_data = response.json()
            except:
                error_data = {'message': f'Service returned error: {response.status_code}'}
            
            ws.send(json.dumps({
                'type': f"{data['type']}_response",
                'success': False,
                'error': error_data.get('error', error_data.get('message', 'Unknown error'))
            }))
    except Exception as e:
        logger.error(f"Error forwarding message to {service}{endpoint}: {str(e)}")
        ws.send(json.dumps({
            'type': f"{data['type']}_response",
            'success': False,
            'error': 'Service unavailable'
        }))

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    
    server = pywsgi.WSGIServer(('0.0.0.0', PORT), app, handler_class=WebSocketHandler)
    logger.info(f"Starting API Gateway on port {PORT}")
    server.serve_forever()
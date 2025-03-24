"""
HugMood Auth Service

Handles authentication, authorization, and user identity.
Exposes a GraphQL API for auth operations.
"""

from flask import Flask, request, jsonify, g
from flask_cors import CORS
import os
import jwt
from datetime import datetime, timedelta
import logging
import bcrypt
from ariadne import load_schema_from_path, make_executable_schema, graphql_sync
from ariadne import ObjectType, QueryType, MutationType
from ariadne.constants import PLAYGROUND_HTML
import json
import sqlite3  # Using SQLite for simplicity; in production, use PostgreSQL with SQLAlchemy
from functools import wraps

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key')
TOKEN_EXPIRATION = int(os.environ.get('TOKEN_EXPIRATION', 86400))  # 24 hours in seconds
PORT = int(os.environ.get('PORT', 5001))

# Database setup - would typically use SQLAlchemy in production
def get_db():
    db = sqlite3.connect('auth.db')
    db.row_factory = sqlite3.Row
    return db

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        
        # Create users table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            display_name TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create refresh_tokens table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        ''')
        
        # Create social_accounts table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS social_accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            provider TEXT NOT NULL,
            provider_user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(provider, provider_user_id)
        )
        ''')
        
        db.commit()
        
        # Create sample user for testing
        try:
            hashed = bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute(
                'INSERT OR IGNORE INTO users (username, email, password, display_name) VALUES (?, ?, ?, ?)',
                ('testuser', 'test@example.com', hashed, 'Test User')
            )
            db.commit()
        except sqlite3.IntegrityError:
            # User already exists
            pass

# Authentication utilities
def create_token(user_id, expires_in=TOKEN_EXPIRATION):
    """Create a JWT token for a user"""
    payload = {
        'id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=expires_in),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """Verify a JWT token and return the payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_user_by_id(user_id):
    """Get user by ID"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        return None
    
    # Convert to dict and remove password
    user_dict = dict(user)
    user_dict.pop('password', None)
    return user_dict

def get_user_by_email(email):
    """Get user by email"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    return cursor.fetchone()

def get_user_by_username(username):
    """Get user by username"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    return cursor.fetchone()

def authenticate(email_or_username, password):
    """Authenticate user with email/username and password"""
    db = get_db()
    cursor = db.cursor()
    
    # Check if input is email or username
    if '@' in email_or_username:
        cursor.execute('SELECT * FROM users WHERE email = ?', (email_or_username,))
    else:
        cursor.execute('SELECT * FROM users WHERE username = ?', (email_or_username,))
    
    user = cursor.fetchone()
    
    if not user:
        return None
    
    # Check password
    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        # Convert to dict and remove password
        user_dict = dict(user)
        user_dict.pop('password', None)
        return user_dict
    
    return None

def create_user(username, email, password, display_name=None):
    """Create a new user"""
    db = get_db()
    cursor = db.cursor()
    
    # Hash password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    try:
        cursor.execute(
            'INSERT INTO users (username, email, password, display_name) VALUES (?, ?, ?, ?)',
            (username, email, hashed, display_name or username)
        )
        db.commit()
        
        # Get the created user
        user_id = cursor.lastrowid
        return get_user_by_id(user_id)
    except sqlite3.IntegrityError:
        # Username or email already exists
        return None

# GraphQL Schema
type_defs = """
type Query {
    me: User
    validateToken(token: String!): TokenValidation
}

type Mutation {
    login(email: String!, password: String!): AuthPayload
    register(input: RegisterInput!): AuthPayload
    refreshToken(token: String!): AuthPayload
    logout: Boolean
    # Social auth
    socialAuth(provider: String!, token: String!): AuthPayload
    changePassword(currentPassword: String!, newPassword: String!): PasswordChangeResult
    # Password recovery
    requestPasswordReset(email: String!): PasswordResetResult
    resetPassword(token: String!, newPassword: String!): PasswordResetResult
}

type User {
    id: ID!
    username: String!
    email: String!
    displayName: String
    avatarUrl: String
    createdAt: String!
}

type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
}

type TokenValidation {
    valid: Boolean!
    user: User
}

type PasswordChangeResult {
    success: Boolean!
    message: String
}

type PasswordResetResult {
    success: Boolean!
    message: String
}

input RegisterInput {
    username: String!
    email: String!
    password: String!
    displayName: String
}
"""

# GraphQL resolvers
query = QueryType()
mutation = MutationType()
user = ObjectType("User")

@query.field("me")
def resolve_me(_, info):
    context = info.context
    if not context.get('user'):
        return None
    
    return get_user_by_id(context['user']['id'])

@query.field("validateToken")
def resolve_validate_token(_, info, token):
    payload = verify_token(token)
    if not payload:
        return {"valid": False, "user": None}
    
    user = get_user_by_id(payload['id'])
    return {
        "valid": True,
        "user": user
    }

@mutation.field("login")
def resolve_login(_, info, email, password):
    user = authenticate(email, password)
    if not user:
        raise Exception("Invalid email/username or password")
    
    token = create_token(user['id'])
    refresh_token = create_token(user['id'], expires_in=TOKEN_EXPIRATION * 7)  # 7 days
    
    # Store refresh token in database
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        (user['id'], refresh_token, datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION * 7))
    )
    db.commit()
    
    return {
        "token": token,
        "refreshToken": refresh_token,
        "user": user
    }

@mutation.field("register")
def resolve_register(_, info, input):
    username = input.get('username')
    email = input.get('email')
    password = input.get('password')
    display_name = input.get('displayName')
    
    # Validate input
    if not username or not email or not password:
        raise Exception("Username, email, and password are required")
    
    # Check if username or email already exists
    if get_user_by_username(username):
        raise Exception("Username already exists")
    
    if get_user_by_email(email):
        raise Exception("Email already exists")
    
    # Create user
    user = create_user(username, email, password, display_name)
    if not user:
        raise Exception("Failed to create user")
    
    # Create tokens
    token = create_token(user['id'])
    refresh_token = create_token(user['id'], expires_in=TOKEN_EXPIRATION * 7)  # 7 days
    
    # Store refresh token in database
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        (user['id'], refresh_token, datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION * 7))
    )
    db.commit()
    
    return {
        "token": token,
        "refreshToken": refresh_token,
        "user": user
    }

@mutation.field("refreshToken")
def resolve_refresh_token(_, info, token):
    # Verify the refresh token
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM refresh_tokens WHERE token = ?', (token,))
    token_record = cursor.fetchone()
    
    if not token_record:
        raise Exception("Invalid refresh token")
    
    # Check if token is expired
    expires_at = datetime.strptime(token_record['expires_at'], '%Y-%m-%d %H:%M:%S.%f')
    if expires_at < datetime.utcnow():
        # Delete expired token
        cursor.execute('DELETE FROM refresh_tokens WHERE id = ?', (token_record['id'],))
        db.commit()
        raise Exception("Refresh token expired")
    
    # Get user
    user = get_user_by_id(token_record['user_id'])
    if not user:
        raise Exception("User not found")
    
    # Create new tokens
    new_token = create_token(user['id'])
    new_refresh_token = create_token(user['id'], expires_in=TOKEN_EXPIRATION * 7)  # 7 days
    
    # Delete old refresh token and store new one
    cursor.execute('DELETE FROM refresh_tokens WHERE id = ?', (token_record['id'],))
    cursor.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        (user['id'], new_refresh_token, datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION * 7))
    )
    db.commit()
    
    return {
        "token": new_token,
        "refreshToken": new_refresh_token,
        "user": user
    }

@mutation.field("logout")
def resolve_logout(_, info):
    context = info.context
    if not context.get('user'):
        return True
    
    # Delete refresh tokens for user
    db = get_db()
    cursor = db.cursor()
    cursor.execute('DELETE FROM refresh_tokens WHERE user_id = ?', (context['user']['id'],))
    db.commit()
    
    return True

@mutation.field("changePassword")
def resolve_change_password(_, info, currentPassword, newPassword):
    context = info.context
    if not context.get('user'):
        raise Exception("Authentication required")
    
    user_id = context['user']['id']
    
    # Get user with password
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        raise Exception("User not found")
    
    # Verify current password
    if not bcrypt.checkpw(currentPassword.encode('utf-8'), user['password'].encode('utf-8')):
        return {
            "success": False,
            "message": "Current password is incorrect"
        }
    
    # Hash new password
    hashed = bcrypt.hashpw(newPassword.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Update password
    cursor.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        (hashed, user_id)
    )
    db.commit()
    
    # Invalidate all refresh tokens for the user
    cursor.execute('DELETE FROM refresh_tokens WHERE user_id = ?', (user_id,))
    db.commit()
    
    return {
        "success": True,
        "message": "Password changed successfully"
    }

# Create executable schema
schema = make_executable_schema(type_defs, query, mutation, user)

# Authentication middleware for GraphQL
def get_context_value():
    auth_header = request.headers.get('Authorization')
    context = {}
    
    if auth_header:
        try:
            token = auth_header.split(' ')[1]
            payload = verify_token(token)
            if payload:
                context['user'] = payload
        except (IndexError, AttributeError):
            pass
    
    return context

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

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = authenticate(email, password)
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    token = create_token(user['id'])
    refresh_token = create_token(user['id'], expires_in=TOKEN_EXPIRATION * 7)
    
    # Store refresh token
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        (user['id'], refresh_token, datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION * 7))
    )
    db.commit()
    
    return jsonify({
        'token': token,
        'refreshToken': refresh_token,
        'user': user
    }), 200

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    display_name = data.get('displayName')
    
    if not username or not email or not password:
        return jsonify({'error': 'Username, email, and password are required'}), 400
    
    # Check if username or email already exists
    if get_user_by_username(username):
        return jsonify({'error': 'Username already exists'}), 409
    
    if get_user_by_email(email):
        return jsonify({'error': 'Email already exists'}), 409
    
    # Create user
    user = create_user(username, email, password, display_name)
    if not user:
        return jsonify({'error': 'Failed to create user'}), 500
    
    # Create tokens
    token = create_token(user['id'])
    refresh_token = create_token(user['id'], expires_in=TOKEN_EXPIRATION * 7)
    
    # Store refresh token
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        (user['id'], refresh_token, datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION * 7))
    )
    db.commit()
    
    return jsonify({
        'token': token,
        'refreshToken': refresh_token,
        'user': user
    }), 200

@app.route('/auth/token', methods=['POST'])
def refresh_token():
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Refresh token is required'}), 400
    
    # Verify the refresh token
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM refresh_tokens WHERE token = ?', (token,))
    token_record = cursor.fetchone()
    
    if not token_record:
        return jsonify({'error': 'Invalid refresh token'}), 401
    
    # Check if token is expired
    expires_at = datetime.strptime(token_record['expires_at'], '%Y-%m-%d %H:%M:%S.%f')
    if expires_at < datetime.utcnow():
        # Delete expired token
        cursor.execute('DELETE FROM refresh_tokens WHERE id = ?', (token_record['id'],))
        db.commit()
        return jsonify({'error': 'Refresh token expired'}), 401
    
    # Get user
    user = get_user_by_id(token_record['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Create new tokens
    new_token = create_token(user['id'])
    new_refresh_token = create_token(user['id'], expires_in=TOKEN_EXPIRATION * 7)
    
    # Delete old refresh token and store new one
    cursor.execute('DELETE FROM refresh_tokens WHERE id = ?', (token_record['id'],))
    cursor.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        (user['id'], new_refresh_token, datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION * 7))
    )
    db.commit()
    
    return jsonify({
        'token': new_token,
        'refreshToken': new_refresh_token,
        'user': user
    }), 200

@app.route('/auth/logout', methods=['POST'])
def logout():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'success': True}), 200
    
    try:
        token = auth_header.split(' ')[1]
        payload = verify_token(token)
        
        if payload:
            # Delete refresh tokens for user
            db = get_db()
            cursor = db.cursor()
            cursor.execute('DELETE FROM refresh_tokens WHERE user_id = ?', (payload['id'],))
            db.commit()
    except:
        pass
    
    return jsonify({'success': True}), 200

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'auth'}), 200

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Start server
    app.run(host='0.0.0.0', port=PORT)
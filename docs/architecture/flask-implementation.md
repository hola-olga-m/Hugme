# Flask Implementation Guide for HugMood

## Overview

This guide outlines how to implement HugMood using Flask as the primary backend framework, avoiding WebSockets in favor of RESTful APIs and GraphQL. This approach focuses on standard HTTP communication patterns while still enabling responsive, real-time-like experiences through efficient polling and client-side caching strategies.

## Technology Stack

### Backend Framework

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Flask** | Web framework | Lightweight, flexible Python framework with excellent extensibility |
| **Flask-RESTful** | REST API framework | Structured resource-based API development |
| **Ariadne** | GraphQL for Python | Schema-first GraphQL library for Flask integration |
| **SQLAlchemy** | ORM | Powerful Python ORM with excellent Flask integration via Flask-SQLAlchemy |
| **Alembic** | Database migrations | Version-controlled database schema changes |
| **Marshmallow** | Object serialization | Schema-based serialization/deserialization for APIs |
| **Flask-JWT-Extended** | Authentication | JWT token handling for secure authentication |

### Client-Side Technologies

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Apollo Client** | GraphQL client | State management, caching, and optimistic updates |
| **React Query** | REST data fetching | Request caching, background updates, and polling |
| **IndexedDB** | Client-side storage | Robust offline data storage |
| **Workbox** | Service worker | Offline support and efficient caching strategies |

## Application Architecture

The Flask-based architecture for HugMood consists of the following components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Applications                          │
│   (React Web App, React Native Mobile, Progressive Web App)          │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────┐
│                         API Gateway (Flask)                          │
│                                                                      │
│  ┌─────────────────┐   ┌────────────────────┐   ┌─────────────────┐ │
│  │   REST API      │   │   GraphQL API      │   │   Auth Service   │ │
│  │  (Flask-RESTful)│   │    (Ariadne)       │   │  (JWT)           │ │
│  └─────────────────┘   └────────────────────┘   └─────────────────┘ │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────┐
│                           Domain Services                            │
│                                                                      │
│  ┌─────────────────┐   ┌────────────────────┐   ┌─────────────────┐ │
│  │  User Service   │   │   Mood Service     │   │   Hug Service    │ │
│  └─────────────────┘   └────────────────────┘   └─────────────────┘ │
│                                                                      │
│  ┌─────────────────┐   ┌────────────────────┐   ┌─────────────────┐ │
│  │ Social Service  │   │  Analytics Service │   │ Collection Svc   │ │
│  └─────────────────┘   └────────────────────┘   └─────────────────┘ │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────┐
│                          Data Access Layer                           │
│                                                                      │
│  ┌─────────────────┐   ┌────────────────────┐   ┌─────────────────┐ │
│  │    Models       │   │     Repositories   │   │     Caching      │ │
│  │  (SQLAlchemy)   │   │                    │   │     (Redis)      │ │
│  └─────────────────┘   └────────────────────┘   └─────────────────┘ │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────┐
│                            Data Storage                              │
│                                                                      │
│  ┌─────────────────┐   ┌────────────────────┐   ┌─────────────────┐ │
│  │   PostgreSQL    │   │       Redis        │   │  Object Storage │ │
│  │   Database      │   │                    │   │     (S3)        │ │
│  └─────────────────┘   └────────────────────┘   └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Flask Application Structure

The Flask application follows a modular, blueprint-based structure to support maintainability and scalability:

```
/hugmood
  /app
    /api
      /v1
        /auth
          __init__.py
          routes.py
          models.py
          schemas.py
        /users
          __init__.py
          routes.py
          models.py
          schemas.py
        /moods
          __init__.py
          routes.py
          models.py
          schemas.py
        /hugs
          __init__.py
          routes.py
          models.py
          schemas.py
      __init__.py
    /graphql
      __init__.py
      schema.py
      resolvers/
        auth.py
        users.py
        moods.py
        hugs.py
      types/
        user.py
        mood.py
        hug.py
    /models
      __init__.py
      user.py
      mood.py
      hug.py
      collection.py
    /services
      __init__.py
      auth_service.py
      user_service.py
      mood_service.py
      hug_service.py
      analytics_service.py
    /utils
      __init__.py
      validators.py
      helpers.py
      security.py
    __init__.py
    extensions.py
    config.py
  /migrations
  /tests
  .env
  .flaskenv
  app.py
  config.py
  requirements.txt
```

## Core Components Implementation

### Flask Application Factory

```python
# app/__init__.py
import os
from flask import Flask
from flask_cors import CORS

from app.extensions import db, migrate, jwt, cache, limiter, mail
from app.api.v1 import api_bp
from app.graphql import graphql_bp

def create_app(config=None):
    app = Flask(__name__)

    # Load configuration
    app.config.from_object('app.config.Config')
    if config:
        app.config.from_mapping(config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)
    mail.init_app(app)

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    app.register_blueprint(graphql_bp, url_prefix='/graphql')

    # Shell context
    @app.shell_context_processor
    def make_shell_context():
        return {'db': db, 'app': app}

    return app
```

### Extensions Configuration

```python
# app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_mail import Mail

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cache = Cache()
limiter = Limiter(key_func=get_remote_address)
mail = Mail()
```

### Database Models

```python
# app/models/user.py
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(100))
    profile_image = db.Column(db.String(255))
    bio = db.Column(db.Text)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_active = db.Column(db.DateTime)
    is_anonymous = db.Column(db.Boolean, default=False, nullable=False)
    status = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    moods = db.relationship('Mood', back_populates='user', lazy='dynamic')
    sent_hugs = db.relationship('Hug', foreign_keys='Hug.sender_id', back_populates='sender', lazy='dynamic')
    received_hugs = db.relationship('Hug', foreign_keys='Hug.recipient_id', back_populates='recipient', lazy='dynamic')
    privacy_settings = db.relationship('PrivacySettings', uselist=False, back_populates='user', cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.privacy_settings is None:
            self.privacy_settings = PrivacySettings(user=self)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': str(self.id),
            'username': self.username,
            'display_name': self.display_name,
            'profile_image': self.profile_image,
            'bio': self.bio,
            'joined_at': self.joined_at.isoformat() if self.joined_at else None,
            'last_active': self.last_active.isoformat() if self.last_active else None,
            'is_anonymous': self.is_anonymous,
            'status': self.status
        }
```

### REST API Routes

```python
# app/api/v1/moods/routes.py
from flask import request, jsonify, current_app
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy import desc

from app.extensions import db, cache, limiter
from app.models.mood import Mood
from app.services.mood_service import MoodService
from app.api.v1.moods.schemas import MoodSchema, MoodQuerySchema

mood_service = MoodService()
mood_schema = MoodSchema()
moods_schema = MoodSchema(many=True)
mood_query_schema = MoodQuerySchema()

class MoodResource(Resource):
    @jwt_required()
    def get(self, mood_id):
        mood = Mood.query.get_or_404(mood_id)
        current_user_id = get_jwt_identity()
        
        # Check permissions
        if str(mood.user_id) != current_user_id and not mood.is_public:
            return {"message": "You don't have permission to view this mood"}, 403
            
        return mood_schema.dump(mood), 200
        
    @jwt_required()
    def put(self, mood_id):
        mood = Mood.query.get_or_404(mood_id)
        current_user_id = get_jwt_identity()
        
        # Check permissions
        if str(mood.user_id) != current_user_id:
            return {"message": "You don't have permission to edit this mood"}, 403
            
        try:
            data = mood_schema.load(request.json)
            for key, value in data.items():
                setattr(mood, key, value)
                
            db.session.commit()
            return mood_schema.dump(mood), 200
        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400
            
    @jwt_required()
    def delete(self, mood_id):
        mood = Mood.query.get_or_404(mood_id)
        current_user_id = get_jwt_identity()
        
        # Check permissions
        if str(mood.user_id) != current_user_id:
            return {"message": "You don't have permission to delete this mood"}, 403
            
        db.session.delete(mood)
        db.session.commit()
        return {"message": "Mood deleted successfully"}, 200

class MoodsResource(Resource):
    @jwt_required()
    @cache.cached(timeout=60, query_string=True)
    @limiter.limit("60/minute")
    def get(self):
        try:
            query_params = mood_query_schema.load(request.args)
        except ValidationError as err:
            return {"message": "Invalid query parameters", "errors": err.messages}, 400
            
        current_user_id = get_jwt_identity()
        user_id = query_params.get('user_id', current_user_id)
        
        # Check permissions for viewing other users' moods
        if user_id != current_user_id:
            # Check if we have permission to view this user's moods
            # This would involve checking privacy settings or friend status
            pass
        
        # Build query
        query = Mood.query.filter_by(user_id=user_id)
        
        # Apply filters
        if 'start_date' in query_params:
            query = query.filter(Mood.created_at >= query_params['start_date'])
        if 'end_date' in query_params:
            query = query.filter(Mood.created_at <= query_params['end_date'])
        if 'mood_type' in query_params:
            query = query.filter(Mood.mood == query_params['mood_type'])
            
        # Add pagination
        page = query_params.get('page', 1)
        per_page = min(query_params.get('per_page', 20), 100)  # Limit max per_page
        paginated_moods = query.order_by(desc(Mood.created_at)).paginate(page=page, per_page=per_page)
        
        result = {
            'items': moods_schema.dump(paginated_moods.items),
            'total': paginated_moods.total,
            'pages': paginated_moods.pages,
            'page': page,
            'per_page': per_page
        }
        
        return result, 200
        
    @jwt_required()
    @limiter.limit("20/minute")
    def post(self):
        current_user_id = get_jwt_identity()
        try:
            data = mood_schema.load(request.json)
            
            # Ensure user can only create moods for themselves
            if 'user_id' in data and str(data['user_id']) != current_user_id:
                return {"message": "You can only create moods for yourself"}, 403
                
            # Create mood entry
            new_mood = mood_service.create_mood(
                user_id=current_user_id,
                mood=data['mood'],
                intensity=data['intensity'],
                valence=data.get('valence'),
                arousal=data.get('arousal'),
                note=data.get('note'),
                is_public=data.get('is_public', False),
                tags=data.get('tags', [])
            )
            
            return mood_schema.dump(new_mood), 201
        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400

class MoodAnalyticsResource(Resource):
    @jwt_required()
    @cache.cached(timeout=300, query_string=True)  # Cache for 5 minutes
    def get(self):
        current_user_id = get_jwt_identity()
        time_range = request.args.get('time_range', 'month')
        
        analytics = mood_service.get_mood_analytics(current_user_id, time_range)
        return jsonify(analytics)
```

### GraphQL Schema and Resolvers

```python
# app/graphql/schema.py
from ariadne import load_schema_from_path, make_executable_schema
from ariadne.asgi import GraphQL
from ariadne.asgi.handlers import GraphQLHTTPHandler
from ariadne.constants import PLAYGROUND_HTML

from app.graphql.resolvers.auth import auth_resolvers
from app.graphql.resolvers.users import user_resolvers
from app.graphql.resolvers.moods import mood_resolvers
from app.graphql.resolvers.hugs import hug_resolvers

# Load schema from file
type_defs = load_schema_from_path("app/graphql/schema.graphql")

# Combine resolvers
resolvers = [
    auth_resolvers,
    user_resolvers,
    mood_resolvers,
    hug_resolvers
]

# Create executable schema
schema = make_executable_schema(type_defs, *resolvers)

# Create GraphQL application
graphql_app = GraphQL(
    schema=schema,
    debug=True,
    http_handler=GraphQLHTTPHandler(
        playground_html=PLAYGROUND_HTML
    )
)
```

```python
# app/graphql/resolvers/moods.py
from ariadne import QueryType, MutationType, ObjectType
from flask_jwt_extended import get_jwt_identity

from app.models.mood import Mood
from app.services.mood_service import MoodService

mood_service = MoodService()

# Define types
query = QueryType()
mutation = MutationType()
mood_obj = ObjectType("Mood")

@query.field("moodEntry")
def resolve_mood_entry(*_, id):
    current_user_id = get_jwt_identity()
    mood = Mood.query.get(id)
    
    if not mood:
        return None
        
    # Check permissions
    if str(mood.user_id) != current_user_id and not mood.is_public:
        return None
        
    return mood

@query.field("moodEntries")
def resolve_mood_entries(*_, userId=None, limit=10, offset=0):
    current_user_id = get_jwt_identity()
    user_id = userId or current_user_id
    
    # Check permissions for viewing other users' moods
    if user_id != current_user_id:
        # Check privacy settings
        pass
    
    query = Mood.query.filter_by(user_id=user_id).order_by(Mood.created_at.desc())
    moods = query.limit(limit).offset(offset).all()
    
    return moods

@query.field("moodAnalytics")
def resolve_mood_analytics(*_, userId=None, timeRange="month"):
    current_user_id = get_jwt_identity()
    user_id = userId or current_user_id
    
    # Check permissions for viewing other users' analytics
    if user_id != current_user_id:
        # Check privacy settings or friendship status
        pass
    
    analytics = mood_service.get_mood_analytics(user_id, timeRange)
    return analytics

@mutation.field("createMoodEntry")
def resolve_create_mood_entry(*_, input):
    current_user_id = get_jwt_identity()
    
    # Create mood entry
    new_mood = mood_service.create_mood(
        user_id=current_user_id,
        mood=input['mood'],
        intensity=input['intensity'],
        valence=input.get('valence'),
        arousal=input.get('arousal'),
        note=input.get('note'),
        is_public=input.get('isPublic', False),
        tags=input.get('tags', [])
    )
    
    return new_mood

@mutation.field("updateMoodEntry")
def resolve_update_mood_entry(*_, id, input):
    current_user_id = get_jwt_identity()
    mood = Mood.query.get(id)
    
    if not mood:
        return None
        
    # Check permissions
    if str(mood.user_id) != current_user_id:
        return None
    
    # Update fields
    updated_mood = mood_service.update_mood(mood, input)
    return updated_mood

@mutation.field("deleteMoodEntry")
def resolve_delete_mood_entry(*_, id):
    current_user_id = get_jwt_identity()
    mood = Mood.query.get(id)
    
    if not mood:
        return False
        
    # Check permissions
    if str(mood.user_id) != current_user_id:
        return False
    
    success = mood_service.delete_mood(mood)
    return success

# Resolver for mood relationships
@mood_obj.field("user")
def resolve_mood_user(mood, *_):
    return mood.user

# Compile resolvers
mood_resolvers = [query, mutation, mood_obj]
```

### Service Layer Implementation

```python
# app/services/mood_service.py
from datetime import datetime, timedelta
from collections import defaultdict
import statistics

from app.extensions import db
from app.models.mood import Mood, MoodTag
from app.models.user import User
from app.services.analytics_service import AnalyticsService

class MoodService:
    def __init__(self):
        self.analytics_service = AnalyticsService()

    def create_mood(self, user_id, mood, intensity, valence=None, arousal=None, 
                   note=None, is_public=False, tags=None):
        """Create a new mood entry"""
        # Calculate valence and arousal if not provided
        if valence is None or arousal is None:
            derived_values = self.calculate_mood_dimensions(mood)
            valence = valence or derived_values['valence']
            arousal = arousal or derived_values['arousal']
        
        # Create mood entry
        new_mood = Mood(
            user_id=user_id,
            mood=mood,
            intensity=intensity,
            valence=valence,
            arousal=arousal,
            note=note,
            is_public=is_public
        )
        
        db.session.add(new_mood)
        db.session.flush()  # Get ID without committing
        
        # Add tags if provided
        if tags:
            for tag_name in tags:
                tag = MoodTag(mood_id=new_mood.id, tag=tag_name)
                db.session.add(tag)
        
        db.session.commit()
        
        # Update streak
        self.update_mood_streak(user_id)
        
        return new_mood
    
    def update_mood(self, mood, data):
        """Update a mood entry"""
        # Update fields
        for key, value in data.items():
            # Convert camelCase to snake_case
            field_name = ''.join(['_' + c.lower() if c.isupper() else c for c in key]).lstrip('_')
            
            # Special handling for tags
            if field_name == 'tags':
                # Remove existing tags
                MoodTag.query.filter_by(mood_id=mood.id).delete()
                
                # Add new tags
                for tag_name in value:
                    tag = MoodTag(mood_id=mood.id, tag=tag_name)
                    db.session.add(tag)
            else:
                # Update other fields
                setattr(mood, field_name, value)
        
        db.session.commit()
        return mood
    
    def delete_mood(self, mood):
        """Delete a mood entry"""
        try:
            db.session.delete(mood)
            db.session.commit()
            return True
        except Exception:
            db.session.rollback()
            return False
    
    def get_user_moods(self, user_id, start_date=None, end_date=None, limit=30, offset=0):
        """Get mood entries for a user"""
        query = Mood.query.filter_by(user_id=user_id)
        
        if start_date:
            query = query.filter(Mood.created_at >= start_date)
        if end_date:
            query = query.filter(Mood.created_at <= end_date)
            
        return query.order_by(Mood.created_at.desc()).limit(limit).offset(offset).all()
    
    def get_mood_analytics(self, user_id, time_range='month'):
        """Get mood analytics for a user"""
        # Determine date range
        end_date = datetime.utcnow()
        if time_range == 'week':
            start_date = end_date - timedelta(days=7)
        elif time_range == 'month':
            start_date = end_date - timedelta(days=30)
        elif time_range == 'three_months':
            start_date = end_date - timedelta(days=90)
        elif time_range == 'six_months':
            start_date = end_date - timedelta(days=180)
        elif time_range == 'year':
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)  # Default to month
        
        # Get mood data
        moods = self.get_user_moods(user_id, start_date, end_date, limit=1000)
        
        if not moods:
            return self._empty_analytics_response(time_range)
        
        # Compile analytics
        mood_frequencies = self._calculate_mood_frequency(moods)
        mood_by_day = self._calculate_mood_by_day(moods)
        mood_by_hour = self._calculate_mood_by_hour(moods)
        
        # Calculate average mood
        mood_values = [m.valence for m in moods]
        average_mood = statistics.mean(mood_values) if mood_values else 0
        
        # Find dominant mood
        dominant_mood = max(mood_frequencies.items(), key=lambda x: x[1]['count'])[0]
        
        # Calculate variability
        mood_variability = statistics.stdev(mood_values) if len(mood_values) > 1 else 0
        
        # Calculate trend
        trend_direction = self._calculate_trend(moods)
        
        # Generate correlations if enough data
        correlations = []
        if len(moods) >= 10:
            correlations = self.analytics_service.calculate_correlations(user_id, moods)
        
        # Generate insights
        insights = self.analytics_service.generate_insights(
            user_id, 
            moods, 
            mood_frequencies, 
            mood_by_day, 
            mood_by_hour, 
            average_mood, 
            mood_variability, 
            trend_direction, 
            correlations
        )
        
        return {
            'userId': str(user_id),
            'timeRange': time_range,
            'moodFrequency': [{'mood': k, **v} for k, v in mood_frequencies.items()],
            'moodByDayOfWeek': mood_by_day,
            'moodByTimeOfDay': mood_by_hour,
            'averageMood': average_mood,
            'dominantMood': dominant_mood,
            'moodVariability': mood_variability,
            'moodTrend': trend_direction,
            'correlations': correlations,
            'insights': insights
        }
    
    def update_mood_streak(self, user_id):
        """Update the user's mood tracking streak"""
        # This would connect to a streak service
        pass
    
    def calculate_mood_dimensions(self, mood_name):
        """Map mood names to valence and arousal dimensions"""
        # Simplified mapping - in production this would be more sophisticated
        mood_dimensions = {
            'happy': {'valence': 0.8, 'arousal': 0.6},
            'excited': {'valence': 0.9, 'arousal': 0.9},
            'content': {'valence': 0.7, 'arousal': 0.3},
            'calm': {'valence': 0.6, 'arousal': 0.2},
            'neutral': {'valence': 0.5, 'arousal': 0.5},
            'bored': {'valence': 0.3, 'arousal': 0.2},
            'sad': {'valence': 0.2, 'arousal': 0.3},
            'anxious': {'valence': 0.3, 'arousal': 0.8},
            'angry': {'valence': 0.2, 'arousal': 0.9},
            'frustrated': {'valence': 0.3, 'arousal': 0.7}
        }
        
        return mood_dimensions.get(mood_name.lower(), {'valence': 0.5, 'arousal': 0.5})
    
    def _calculate_mood_frequency(self, moods):
        """Calculate frequency of each mood"""
        frequencies = defaultdict(lambda: {'count': 0, 'percentage': 0})
        total = len(moods)
        
        for mood in moods:
            frequencies[mood.mood]['count'] += 1
        
        # Calculate percentages
        for mood_name, data in frequencies.items():
            data['percentage'] = data['count'] / total if total > 0 else 0
        
        return dict(frequencies)
    
    def _calculate_mood_by_day(self, moods):
        """Calculate mood patterns by day of week"""
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        day_data = []
        
        # Group moods by day
        day_groups = defaultdict(list)
        for mood in moods:
            day_name = days[mood.created_at.weekday()]
            day_groups[day_name].append(mood.valence)
        
        # Calculate averages
        for day in days:
            values = day_groups.get(day, [])
            day_data.append({
                'day': day,
                'averageMood': statistics.mean(values) if values else 0,
                'entries': len(values)
            })
        
        return day_data
    
    def _calculate_mood_by_hour(self, moods):
        """Calculate mood patterns by hour of day"""
        hour_data = []
        
        # Group moods by hour
        hour_groups = defaultdict(list)
        for mood in moods:
            hour = mood.created_at.hour
            hour_groups[hour].append(mood.valence)
        
        # Calculate averages
        for hour in range(24):
            values = hour_groups.get(hour, [])
            hour_data.append({
                'hour': hour,
                'averageMood': statistics.mean(values) if values else 0,
                'entries': len(values)
            })
        
        return hour_data
    
    def _calculate_trend(self, moods):
        """Calculate mood trend direction"""
        if len(moods) < 3:
            return 'STABLE'
        
        # Sort moods by date
        sorted_moods = sorted(moods, key=lambda m: m.created_at)
        
        # Divide into three equal parts
        chunk_size = len(sorted_moods) // 3
        if chunk_size == 0:
            return 'STABLE'
        
        early = sorted_moods[:chunk_size]
        late = sorted_moods[-chunk_size:]
        
        # Calculate averages
        early_avg = statistics.mean([m.valence for m in early])
        late_avg = statistics.mean([m.valence for m in late])
        
        # Determine trend
        difference = late_avg - early_avg
        if difference > 0.1:
            return 'IMPROVING'
        elif difference < -0.1:
            return 'DECLINING'
        else:
            return 'STABLE'
    
    def _empty_analytics_response(self, time_range):
        """Return an empty analytics response when no data is available"""
        return {
            'timeRange': time_range,
            'moodFrequency': [],
            'moodByDayOfWeek': [],
            'moodByTimeOfDay': [],
            'averageMood': 0,
            'dominantMood': None,
            'moodVariability': 0,
            'moodTrend': 'STABLE',
            'correlations': [],
            'insights': []
        }
```

## Real-time Features Without WebSockets

While WebSockets provide the most seamless real-time experience, we can implement "near real-time" features using efficient HTTP-based approaches:

### 1. Polling with Optimizations

Intelligent polling can provide a good user experience while minimizing server load:

```javascript
// Client-side polling with React Query
import { useQuery } from 'react-query';

// Fetch notifications with optimized polling
const useNotifications = () => {
  const { data, error, isLoading } = useQuery(
    'notifications',
    async () => {
      const res = await fetch('/api/v1/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
    {
      refetchInterval: (data) => {
        // Adaptive polling intervals
        if (data?.hasUnread) return 10000;  // 10 seconds when there are unread items
        if (data?.recentActivity) return 30000;  // 30 seconds when recent activity
        return 60000;  // 1 minute otherwise
      },
      refetchOnWindowFocus: true,
      staleTime: 5000,
    }
  );

  return { notifications: data, error, isLoading };
};
```

Server-side implementation:

```python
# app/api/v1/notifications/routes.py
from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.notification import Notification
from app.extensions import cache

class NotificationsResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        
        # Get timestamp of last check from query parameter
        last_check = request.args.get('since', None)
        
        query = Notification.query.filter_by(user_id=current_user_id)
        
        # Only get notifications newer than last check
        if last_check:
            query = query.filter(Notification.created_at > last_check)
            
        # Get unread count for polling optimization
        unread_count = query.filter_by(is_read=False).count()
        
        # Get recent activities for polling optimization
        has_recent_activity = Notification.query.filter(
            Notification.created_at > (datetime.utcnow() - timedelta(minutes=10))
        ).first() is not None
        
        # Get notifications with pagination
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 50)
        paginated = query.order_by(Notification.created_at.desc()).paginate(
            page=page, per_page=per_page
        )
        
        return {
            'notifications': [n.to_dict() for n in paginated.items],
            'total': paginated.total,
            'pages': paginated.pages,
            'hasUnread': unread_count > 0,
            'unreadCount': unread_count,
            'recentActivity': has_recent_activity,
            'timestamp': datetime.utcnow().isoformat()
        }, 200
```

### 2. Long Polling for More Responsive Updates

Long polling keeps the connection open until new data is available:

```python
# app/api/v1/events/routes.py
from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
import time
from datetime import datetime

from app.models.event import Event
from app.extensions import db

class EventsResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        last_event_id = request.args.get('last_id', None)
        timeout = min(int(request.args.get('timeout', 30)), 60)  # Max 60 seconds
        
        # Check immediately for new events
        events = self._get_new_events(current_user_id, last_event_id)
        
        # If no events and client wants long polling
        start_time = time.time()
        while not events and request.args.get('long_poll') == 'true':
            # Check if we've hit timeout
            if time.time() - start_time > timeout:
                break
                
            # Sleep for a short interval
            time.sleep(1)
            
            # Check for new events
            events = self._get_new_events(current_user_id, last_event_id)
        
        # Get the highest event ID for next poll
        latest_id = max([e.id for e in events]) if events else last_event_id
        
        return {
            'events': [e.to_dict() for e in events],
            'lastId': latest_id,
            'timestamp': datetime.utcnow().isoformat()
        }, 200
    
    def _get_new_events(self, user_id, last_id):
        query = Event.query.filter_by(user_id=user_id)
        
        if last_id:
            query = query.filter(Event.id > last_id)
            
        return query.order_by(Event.id.asc()).limit(50).all()
```

### 3. Server-Sent Events (SSE)

For true push notifications without WebSockets, Server-Sent Events provide a lightweight alternative:

```python
# app/api/v1/sse/routes.py
from flask import Blueprint, Response, stream_with_context
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import time
from datetime import datetime, timedelta

from app.models.notification import Notification
from app.models.event import Event

sse_bp = Blueprint('sse', __name__)

@sse_bp.route('/stream')
@jwt_required()
def stream():
    def event_stream():
        user_id = get_jwt_identity()
        last_check = datetime.utcnow()
        
        while True:
            # Check for new notifications
            notifications = Notification.query.filter(
                Notification.user_id == user_id,
                Notification.created_at > last_check
            ).all()
            
            # Check for new events
            events = Event.query.filter(
                Event.user_id == user_id,
                Event.created_at > last_check
            ).all()
            
            # Send notifications
            for notification in notifications:
                data = json.dumps({
                    'id': str(notification.id),
                    'type': notification.type,
                    'title': notification.title,
                    'body': notification.body,
                    'timestamp': notification.created_at.isoformat()
                })
                yield f"event: notification\ndata: {data}\n\n"
            
            # Send events
            for event in events:
                data = json.dumps({
                    'id': str(event.id),
                    'type': event.type,
                    'data': event.data,
                    'timestamp': event.created_at.isoformat()
                })
                yield f"event: {event.type}\ndata: {data}\n\n"
            
            # Send heartbeat every 30 seconds
            yield f"event: heartbeat\ndata: {datetime.utcnow().isoformat()}\n\n"
            
            # Update last check time
            last_check = datetime.utcnow()
            
            # Sleep to avoid CPU overload
            time.sleep(5)  # Check every 5 seconds
    
    return Response(
        stream_with_context(event_stream()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    )
```

Client-side SSE implementation:

```javascript
// Client-side SSE implementation
const connectToEventStream = () => {
  const eventSource = new EventSource('/api/v1/sse/stream', {
    withCredentials: true
  });
  
  // Listen for notifications
  eventSource.addEventListener('notification', (event) => {
    const notification = JSON.parse(event.data);
    
    // Display notification to user
    showNotification(notification);
    
    // Update notification list if visible
    updateNotificationsList(notification);
  });
  
  // Listen for mood updates
  eventSource.addEventListener('mood_update', (event) => {
    const moodUpdate = JSON.parse(event.data);
    
    // Update UI with the new mood data
    updateMoodFeed(moodUpdate);
  });
  
  // Listen for hug events
  eventSource.addEventListener('hug_received', (event) => {
    const hugData = JSON.parse(event.data);
    
    // Show interactive hug notification
    showHugAnimation(hugData);
  });
  
  // Handle connection errors
  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
    
    // Reconnect after delay
    setTimeout(() => {
      connectToEventStream();
    }, 5000);
  };
  
  return eventSource;
};
```

## Client-Side Implementation

### 1. Optimistic Updates for Responsive UI

To provide a real-time feel, implement optimistic updates:

```javascript
// Example with React Query
import { useMutation, useQueryClient } from 'react-query';

const useSendHug = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (hugData) => {
      const response = await fetch('/api/v1/hugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hugData),
      });
      
      if (!response.ok) throw new Error('Failed to send hug');
      return response.json();
    },
    {
      // Update UI immediately before server responds
      onMutate: async (newHug) => {
        // Cancel any outgoing refetches to avoid overwriting optimistic update
        await queryClient.cancelQueries('sentHugs');
        
        // Get current data
        const previousHugs = queryClient.getQueryData('sentHugs');
        
        // Create optimistic hug
        const optimisticHug = {
          id: `temp-${Date.now()}`,
          sender: { id: newHug.senderId },
          recipient: { id: newHug.recipientId },
          type: newHug.hugType,
          message: newHug.message,
          sentAt: new Date().toISOString(),
          status: 'sending',
          ...newHug
        };
        
        // Update query data optimistically
        queryClient.setQueryData('sentHugs', old => {
          return {
            ...old,
            items: [optimisticHug, ...(old?.items || [])]
          };
        });
        
        return { previousHugs };
      },
      
      // If mutation fails, roll back to previous state
      onError: (err, newHug, context) => {
        queryClient.setQueryData('sentHugs', context.previousHugs);
      },
      
      // Always refetch after error or success to synchronize with server
      onSettled: () => {
        queryClient.invalidateQueries('sentHugs');
      },
    }
  );
};
```

### 2. Offline Support with Service Worker

Implement offline support for a seamless experience:

```javascript
// service-worker.js
const CACHE_NAME = 'hugmood-cache-v1';
const OFFLINE_QUEUE_DB = 'hugmood-offline-queue';
const OFFLINE_DATA_DB = 'hugmood-offline-data';

// Cache core assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/static/css/main.css',
        '/static/js/bundle.js',
        '/static/images/logo.png',
        '/static/images/offline.svg'
      ]);
    })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
  // Skip for API requests - we'll handle them separately
  if (event.request.url.includes('/api/') || event.request.url.includes('/graphql')) {
    if (event.request.method === 'GET') {
      // Network-first strategy for API GET requests
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            // Cache a copy of the response
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            
            return response;
          })
          .catch(() => {
            // If network fails, try the cache
            return caches.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If no cached response, return offline JSON
              return new Response(
                JSON.stringify({ 
                  error: 'Network error', 
                  offline: true 
                }),
                { 
                  headers: { 'Content-Type': 'application/json' },
                  status: 503
                }
              );
            });
          })
      );
    } else {
      // For non-GET API requests, try to queue if offline
      event.respondWith(
        fetch(event.request).catch((error) => {
          // Add to offline queue
          if (!navigator.onLine) {
            event.waitUntil(
              addToOfflineQueue(event.request.clone())
            );
          }
          
          // Return offline response
          return new Response(
            JSON.stringify({ 
              error: 'Network error', 
              offline: true,
              queued: !navigator.onLine
            }),
            { 
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          );
        })
      );
    }
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          // Cache the fetched response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          
          return response;
        }).catch(() => {
          // For navigation, return the offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          // Otherwise just fail
          return new Response('Offline and not cached', { status: 404 });
        });
      })
    );
  }
});

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-queue') {
    event.waitUntil(processOfflineQueue());
  }
});

// Process the offline queue
async function processOfflineQueue() {
  const db = await openOfflineQueueDB();
  const tx = db.transaction('requests', 'readwrite');
  const store = tx.objectStore('requests');
  
  // Get all queued requests
  const requests = await store.getAll();
  
  for (const item of requests) {
    try {
      // Recreate the request
      const request = new Request(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
        mode: 'cors'
      });
      
      // Try to send it
      const response = await fetch(request);
      
      if (response.ok) {
        // If successful, remove from queue
        await store.delete(item.id);
      }
    } catch (error) {
      console.error('Background sync failed for item:', item.id, error);
    }
  }
}

// Add a request to the offline queue
async function addToOfflineQueue(request) {
  const db = await openOfflineQueueDB();
  const tx = db.transaction('requests', 'readwrite');
  const store = tx.objectStore('requests');
  
  // Create storeable request
  const requestData = {
    id: Date.now().toString(),
    url: request.url,
    method: request.method,
    headers: Array.from(request.headers.entries()),
    body: await request.text(),
    timestamp: Date.now()
  };
  
  // Save to queue
  await store.add(requestData);
  
  // Register for sync when back online
  if ('sync' in self.registration) {
    await self.registration.sync.register('sync-offline-queue');
  }
}

// Open the offline queue database
function openOfflineQueueDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_QUEUE_DB, 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('requests', { keyPath: 'id' });
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
```

### 3. Client State Management with Context and Apollo/React Query

```javascript
// src/context/MoodContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';

// Create context
const MoodContext = createContext();

// Initial state
const initialState = {
  currentMood: null,
  moodHistory: [],
  streak: {
    current: 0,
    longest: 0
  },
  isLoading: false,
  error: null
};

// Reducer
function moodReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_MOOD':
      return { ...state, currentMood: action.payload };
    case 'SET_MOOD_HISTORY':
      return { ...state, moodHistory: action.payload };
    case 'ADD_MOOD_ENTRY':
      return { 
        ...state, 
        currentMood: action.payload,
        moodHistory: [action.payload, ...state.moodHistory]
      };
    case 'UPDATE_STREAK':
      return { ...state, streak: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Provider component
export const MoodProvider = ({ children }) => {
  const [state, dispatch] = useReducer(moodReducer, initialState);
  
  // Fetch mood history
  const { data: moodHistoryData, refetch: refetchMoodHistory } = useQuery(
    'moodHistory',
    async () => {
      const res = await fetch('/api/v1/moods?limit=50');
      if (!res.ok) throw new Error('Failed to fetch mood history');
      return res.json();
    },
    {
      onSuccess: (data) => {
        dispatch({ type: 'SET_MOOD_HISTORY', payload: data.items || [] });
        
        // Set current mood to most recent
        if (data.items && data.items.length > 0) {
          dispatch({ type: 'SET_CURRENT_MOOD', payload: data.items[0] });
        }
      },
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  );
  
  // Fetch streak data
  const { data: streakData } = useQuery(
    'streak',
    async () => {
      const res = await fetch('/api/v1/moods/streak');
      if (!res.ok) throw new Error('Failed to fetch streak');
      return res.json();
    },
    {
      onSuccess: (data) => {
        dispatch({ type: 'UPDATE_STREAK', payload: data });
      }
    }
  );
  
  // Create mood entry mutation
  const createMoodMutation = useMutation(
    async (moodData) => {
      const res = await fetch('/api/v1/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moodData),
      });
      
      if (!res.ok) throw new Error('Failed to create mood entry');
      return res.json();
    },
    {
      onMutate: async (newMood) => {
        // Optimistic update
        const optimisticMood = {
          id: `temp-${Date.now()}`,
          mood: newMood.mood,
          intensity: newMood.intensity,
          note: newMood.note,
          isPublic: newMood.isPublic,
          createdAt: new Date().toISOString(),
          user: {
            id: 'current-user'
          }
        };
        
        dispatch({ type: 'ADD_MOOD_ENTRY', payload: optimisticMood });
        
        return { optimisticMood };
      },
      onSuccess: (data) => {
        // Update with actual data from server
        dispatch({ type: 'SET_CURRENT_MOOD', payload: data });
        refetchMoodHistory();
      },
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        // Refetch to correct any optimistic updates
        refetchMoodHistory();
      }
    }
  );
  
  // Function to record a new mood
  const recordMood = (moodData) => {
    createMoodMutation.mutate(moodData);
  };
  
  // Create poll interval for real-time updates (simulating WebSocket)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      refetchMoodHistory();
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(pollInterval);
  }, [refetchMoodHistory]);
  
  // Expose the context value
  const value = {
    currentMood: state.currentMood,
    moodHistory: state.moodHistory,
    streak: state.streak,
    isLoading: state.isLoading || createMoodMutation.isLoading,
    error: state.error,
    recordMood,
    refetchMoodHistory
  };
  
  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};

// Custom hook for using the context
export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
```

## Deployment and Scaling

### Deployment Configuration

Flask applications can be deployed in various ways. Here's a configuration for using Gunicorn with Nginx:

```
# gunicorn_config.py
import multiprocessing

# Gunicorn config
bind = "0.0.0.0:5000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "gevent"  # Use gevent for better concurrency
timeout = 30
keepalive = 2

# For handling SSE connections
worker_connections = 1000

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
```

```nginx
# nginx.conf

server {
    listen 80;
    server_name hugmood.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name hugmood.com;

    ssl_certificate /etc/letsencrypt/live/hugmood.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hugmood.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";

    # Static files
    location /static/ {
        alias /path/to/hugmood/app/static/;
        expires 1d;
    }

    # API and main application
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Special configuration for SSE endpoints
    location /api/v1/sse/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # SSE specific settings
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 3600s; # Long timeout for SSE connections
    }
}
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn gevent

# Copy application code
COPY . .

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Expose port
EXPOSE 5000

# Run gunicorn
CMD ["gunicorn", "--config", "gunicorn_config.py", "app:create_app()"]
```

### Scaling Strategy

For scaling a Flask application without WebSockets:

1. **Horizontal Scaling**: Deploy multiple instances behind a load balancer
2. **Stateless Design**: Ensure the application is stateless for seamless scaling
3. **External Session Storage**: Use Redis or a database for session management
4. **Connection Pooling**: Implement database connection pooling
5. **Caching Layer**: Use Redis for caching frequently accessed data
6. **CDN**: Serve static assets through a CDN

## Conclusion

While WebSockets provide the most seamless real-time experience, this Flask-based implementation offers a robust alternative using standard HTTP patterns. By combining efficient polling, long polling, server-sent events, and client-side optimizations, the application can provide a responsive, real-time-like experience without the complexity of WebSocket management.

The architecture's clean separation of concerns, comprehensive test coverage, and scalable design patterns ensure that the HugMood application remains maintainable and extensible as features are added over time.

This approach is particularly suitable when:
- Deploying in environments where WebSockets are restricted or poorly supported
- Working with hosting providers that specialize in Flask/Python applications
- Prioritizing HTTP-based infrastructure and tools
- Focusing on REST and GraphQL as primary API paradigms
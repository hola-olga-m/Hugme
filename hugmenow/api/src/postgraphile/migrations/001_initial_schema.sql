-- Initial schema migration

-- Add smart comments to avoid naming conflicts
COMMENT ON SCHEMA public IS E'@graphql({"inflect": "camel"})';

-- Create UUID extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatarUrl VARCHAR(255),
  isAnonymous BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Moods table
CREATE TABLE IF NOT EXISTS "moods" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score INTEGER NOT NULL,
  note TEXT,
  isPublic BOOLEAN DEFAULT FALSE,
  userId UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Hugs table
CREATE TABLE IF NOT EXISTS "hugs" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  message TEXT,
  senderId UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  recipientId UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Hug requests table
CREATE TABLE IF NOT EXISTS "hug_requests" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT,
  requesterId UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  recipientId UUID REFERENCES "users"("id") ON DELETE CASCADE,
  isCommunityRequest BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  createdAt TIMESTAMP DEFAULT NOW(),
  respondedAt TIMESTAMP
);
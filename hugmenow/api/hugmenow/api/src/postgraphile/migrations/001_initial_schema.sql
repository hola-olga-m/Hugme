-- Initial schema migration

-- Add smart comments to avoid naming conflicts
COMMENT ON SCHEMA public IS E'@graphql({"inflect": "camel"})';

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  id UUID PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moods table
CREATE TABLE IF NOT EXISTS "moods" (
  id UUID PRIMARY KEY,
  score INTEGER NOT NULL,
  note TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hugs table
CREATE TABLE IF NOT EXISTS "hugs" (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  message TEXT,
  sender_id UUID NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hug requests table
CREATE TABLE IF NOT EXISTS "hug_requests" (
  id UUID PRIMARY KEY,
  message TEXT,
  requester_id UUID NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES "users"(id) ON DELETE CASCADE,
  is_community_request BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_moods_user_id ON "moods"(user_id);
CREATE INDEX IF NOT EXISTS idx_hugs_sender_id ON "hugs"(sender_id);
CREATE INDEX IF NOT EXISTS idx_hugs_recipient_id ON "hugs"(recipient_id);
CREATE INDEX IF NOT EXISTS idx_hug_requests_requester_id ON "hug_requests"(requester_id);
CREATE INDEX IF NOT EXISTS idx_hug_requests_recipient_id ON "hug_requests"(recipient_id);
CREATE INDEX IF NOT EXISTS idx_hug_requests_status ON "hug_requests"(status);
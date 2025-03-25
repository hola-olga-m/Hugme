-- This migration script creates the database schema for Postgraphile
-- It creates the same tables that were previously managed by TypeORM

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  avatar_url TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create mood table
CREATE TABLE IF NOT EXISTS moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score INTEGER NOT NULL,
  note TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create hugs table
CREATE TABLE IF NOT EXISTS hugs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  message TEXT,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create hug_requests table
CREATE TABLE IF NOT EXISTS hug_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT,
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_community_request BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS moods_user_id_idx ON moods(user_id);
CREATE INDEX IF NOT EXISTS hugs_sender_id_idx ON hugs(sender_id);
CREATE INDEX IF NOT EXISTS hugs_recipient_id_idx ON hugs(recipient_id);
CREATE INDEX IF NOT EXISTS hug_requests_requester_id_idx ON hug_requests(requester_id);
CREATE INDEX IF NOT EXISTS hug_requests_recipient_id_idx ON hug_requests(recipient_id);

-- Add comments to tables and columns for better Postgraphile documentation
COMMENT ON TABLE users IS 'A user of the application';
COMMENT ON COLUMN users.id IS 'The primary unique identifier for the user';
COMMENT ON COLUMN users.username IS 'The username used to login';
COMMENT ON COLUMN users.email IS 'The email address of the user';
COMMENT ON COLUMN users.name IS 'The display name of the user';
COMMENT ON COLUMN users.is_anonymous IS 'Whether this user is anonymous';

COMMENT ON TABLE moods IS 'A mood entry recorded by a user';
COMMENT ON COLUMN moods.score IS 'The mood score from 1-10';
COMMENT ON COLUMN moods.is_public IS 'Whether this mood entry is publicly visible';

COMMENT ON TABLE hugs IS 'A virtual hug sent from one user to another';
COMMENT ON COLUMN hugs.type IS 'The type of hug (QUICK, WARM, SUPPORTIVE, etc)';
COMMENT ON COLUMN hugs.is_read IS 'Whether the recipient has read the hug';

COMMENT ON TABLE hug_requests IS 'A request for a hug from another user or the community';
COMMENT ON COLUMN hug_requests.is_community_request IS 'Whether this is a request to the community rather than a specific user';
COMMENT ON COLUMN hug_requests.status IS 'The status of the request (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED)';
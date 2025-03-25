-- Add indexes for better query performance

-- Add indexes for moods table
CREATE INDEX IF NOT EXISTS idx_moods_userId ON "moods"("userId");

-- Add indexes for hugs table
CREATE INDEX IF NOT EXISTS idx_hugs_senderId ON "hugs"("senderId");
CREATE INDEX IF NOT EXISTS idx_hugs_recipientId ON "hugs"("recipientId");

-- Add indexes for hug_requests table
CREATE INDEX IF NOT EXISTS idx_hug_requests_requesterId ON "hug_requests"("requesterId");
CREATE INDEX IF NOT EXISTS idx_hug_requests_recipientId ON "hug_requests"("recipientId");
CREATE INDEX IF NOT EXISTS idx_hug_requests_status ON "hug_requests"("status");
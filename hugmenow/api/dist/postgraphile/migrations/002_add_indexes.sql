-- Add indexes for better query performance

-- Add indexes for moods table
CREATE INDEX IF NOT EXISTS idx_moods_user_id ON "moods"("user_id");

-- Add indexes for hugs table
CREATE INDEX IF NOT EXISTS idx_hugs_sender_id ON "hugs"("sender_id");
CREATE INDEX IF NOT EXISTS idx_hugs_recipient_id ON "hugs"("recipient_id");

-- Add indexes for hug_requests table
CREATE INDEX IF NOT EXISTS idx_hug_requests_requester_id ON "hug_requests"("requester_id");
CREATE INDEX IF NOT EXISTS idx_hug_requests_recipient_id ON "hug_requests"("recipient_id");
CREATE INDEX IF NOT EXISTS idx_hug_requests_status ON "hug_requests"("status");
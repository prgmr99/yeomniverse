-- Add auth_user_id to subscribers for Supabase Auth linking
ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_subscribers_auth_user ON subscribers(auth_user_id);

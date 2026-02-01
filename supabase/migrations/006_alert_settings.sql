-- Add alert preference columns to subscribers table
-- These columns control notification settings for each user

ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS news_alerts_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS telegram_notifications BOOLEAN DEFAULT false;

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_subscribers_news_alerts ON subscribers(news_alerts_enabled);

-- Comment
COMMENT ON COLUMN subscribers.news_alerts_enabled IS 'Master toggle for news alerts (default: true)';
COMMENT ON COLUMN subscribers.email_notifications IS 'Enable email notifications (default: true)';
COMMENT ON COLUMN subscribers.telegram_notifications IS 'Enable telegram notifications (default: false, Pro only)';

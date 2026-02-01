-- Stock News Alerts table
-- Tracks sent notifications to prevent duplicate alerts

CREATE TABLE IF NOT EXISTS stock_news_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE SET NULL,
  news_title TEXT NOT NULL,
  news_url TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'telegram')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate alerts for the same news to the same user
  UNIQUE(user_id, news_url)
);

-- Index for efficient querying by user
CREATE INDEX IF NOT EXISTS idx_stock_news_alerts_user_id ON stock_news_alerts(user_id);

-- Index for efficient querying by sent time (for cleanup)
CREATE INDEX IF NOT EXISTS idx_stock_news_alerts_sent_at ON stock_news_alerts(sent_at);

-- Comment
COMMENT ON TABLE stock_news_alerts IS 'Tracks news alerts sent to users to prevent duplicate notifications';

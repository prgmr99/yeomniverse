-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  max_watchlist INTEGER NOT NULL,
  features JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed plans data
INSERT INTO plans (name, display_name, price_monthly, max_watchlist, features) VALUES
('free', 'Free', 0, 0, '{"daily_briefing": true, "technical_analysis": false, "deep_analysis": false}'),
('basic', 'Basic', 700, 3, '{"daily_briefing": true, "technical_analysis": false, "deep_analysis": false, "stock_analysis": true}'),
('pro', 'Pro', 2000, 10, '{"daily_briefing": true, "technical_analysis": true, "deep_analysis": true, "stock_analysis": true, "price_alerts": true}')
ON CONFLICT (name) DO NOTHING;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  ls_subscription_id TEXT UNIQUE,
  ls_customer_id TEXT,
  ls_variant_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  grace_period_start TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_ls_id ON subscriptions(ls_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

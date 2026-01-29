-- Watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  market TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  alert_enabled BOOLEAN DEFAULT FALSE,
  alert_price_above DECIMAL(15,2),
  alert_price_below DECIMAL(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_symbol ON watchlists(symbol);
CREATE INDEX IF NOT EXISTS idx_watchlists_active ON watchlists(user_id, is_active);

-- Stock analyses table
CREATE TABLE IF NOT EXISTS stock_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  analysis_date DATE NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  change_percent DECIMAL(8,4),
  volume BIGINT,
  rsi DECIMAL(5,2),
  macd DECIMAL(10,4),
  macd_signal DECIMAL(10,4),
  sma_5 DECIMAL(15,2),
  sma_20 DECIMAL(15,2),
  sma_60 DECIMAL(15,2),
  bollinger_upper DECIMAL(15,2),
  bollinger_lower DECIMAL(15,2),
  ai_signal TEXT,
  ai_strength INTEGER,
  ai_summary TEXT,
  ai_analysis TEXT,
  ai_key_points JSONB,
  related_news JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(symbol, analysis_date)
);

CREATE INDEX IF NOT EXISTS idx_stock_analyses_symbol_date ON stock_analyses(symbol, analysis_date DESC);

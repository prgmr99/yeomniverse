-- Telegram bot subscribers tracking
-- Stores users who sent /start to the bot for subscriber counting and future per-user delivery

CREATE TABLE IF NOT EXISTS telegram_subscribers (
  id SERIAL PRIMARY KEY,
  chat_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_subscribers_chat_id ON telegram_subscribers(chat_id);

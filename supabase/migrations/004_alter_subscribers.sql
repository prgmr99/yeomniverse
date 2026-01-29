-- Add plan_id to subscribers
ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES plans(id);

-- Set default free plan for existing users (run this manually or in a separate step)
-- UPDATE subscribers SET plan_id = (SELECT id FROM plans WHERE name = 'free') WHERE plan_id IS NULL;

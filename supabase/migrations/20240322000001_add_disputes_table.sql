-- Create dispute categories table
CREATE TABLE IF NOT EXISTS dispute_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  severity_level INTEGER NOT NULL CHECK (severity_level BETWEEN 1 AND 5),
  auto_escalation_days INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default categories
INSERT INTO dispute_categories (name, description, severity_level, auto_escalation_days) VALUES
('Item Damage', 'Dispute regarding damage to items during transport', 4, 2),
('Delivery Issues', 'Problems with item pickup or delivery', 3, 3),
('Payment Disputes', 'Issues related to payment or pricing', 3, 3),
('Communication Problems', 'Lack of response or communication issues', 2, 4),
('Policy Violations', 'Violations of platform policies or terms', 5, 1),
('Other', 'Other types of disputes', 2, 3);

-- Create disputes table
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES dispute_categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'open' 
    CHECK (status IN ('open', 'investigating', 'escalated', 'resolved', 'closed')),
  resolution TEXT,
  resolution_type TEXT CHECK (resolution_type IN ('refund', 'compensation', 'warning', 'ban', 'no_action')),
  assigned_to UUID REFERENCES auth.users(id),
  escalation_level INTEGER NOT NULL DEFAULT 1 CHECK (escalation_level BETWEEN 1 AND 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create dispute messages table for communication
CREATE TABLE IF NOT EXISTS dispute_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachment_urls TEXT[],
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_disputes_reporter_id ON disputes(reporter_id);
CREATE INDEX IF NOT EXISTS idx_disputes_reported_id ON disputes(reported_id);
CREATE INDEX IF NOT EXISTS idx_disputes_trip_id ON disputes(trip_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_category_id ON disputes(category_id);
CREATE INDEX IF NOT EXISTS idx_disputes_assigned_to ON disputes(assigned_to);
CREATE INDEX IF NOT EXISTS idx_disputes_last_activity ON disputes(last_activity_at);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_id ON dispute_messages(dispute_id);

-- Create trigger for updated_at and last_activity_at
CREATE OR REPLACE FUNCTION update_dispute_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dispute_timestamps
  BEFORE UPDATE ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_dispute_timestamps();

-- Create trigger for auto-escalation
CREATE OR REPLACE FUNCTION check_dispute_escalation()
RETURNS TRIGGER AS $$
DECLARE
  v_category_days INTEGER;
BEGIN
  -- Get auto-escalation days for the category
  SELECT auto_escalation_days INTO v_category_days
  FROM dispute_categories
  WHERE id = NEW.category_id;

  -- Check if dispute needs escalation
  IF NEW.status = 'open' AND 
     NEW.last_activity_at < NOW() - (v_category_days || ' days')::interval THEN
    NEW.status := 'escalated';
    NEW.escalation_level := LEAST(NEW.escalation_level + 1, 3);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_dispute_escalation
  BEFORE UPDATE ON disputes
  FOR EACH ROW
  EXECUTE FUNCTION check_dispute_escalation();

-- Enable RLS
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own disputes"
  ON disputes FOR SELECT
  USING (auth.uid() IN (reporter_id, reported_id));

CREATE POLICY "Users can create disputes"
  ON disputes FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view messages in their disputes"
  ON dispute_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM disputes d
      WHERE d.id = dispute_id
      AND (d.reporter_id = auth.uid() OR d.reported_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their disputes"
  ON dispute_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM disputes d
      WHERE d.id = dispute_id
      AND (d.reporter_id = auth.uid() OR d.reported_id = auth.uid())
    )
  );

-- Moderator policies
CREATE POLICY "Moderators can view all disputes"
  ON disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'moderator'
    )
  );

CREATE POLICY "Moderators can update disputes"
  ON disputes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'moderator'
    )
  );

CREATE POLICY "Moderators can view all messages"
  ON dispute_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'moderator'
    )
  );

-- Create view for dispute statistics and monitoring
CREATE VIEW dispute_statistics AS
SELECT 
  d.category_id,
  dc.name as category_name,
  COUNT(*) as total_disputes,
  COUNT(CASE WHEN d.status = 'open' THEN 1 END) as open_disputes,
  COUNT(CASE WHEN d.status = 'escalated' THEN 1 END) as escalated_disputes,
  COUNT(CASE WHEN d.status = 'resolved' THEN 1 END) as resolved_disputes,
  AVG(EXTRACT(EPOCH FROM (d.resolved_at - d.created_at))/86400)::numeric(10,2) as avg_resolution_days,
  COUNT(CASE WHEN d.escalation_level > 1 THEN 1 END) as escalated_count
FROM disputes d
JOIN dispute_categories dc ON d.category_id = dc.id
GROUP BY d.category_id, dc.name; 
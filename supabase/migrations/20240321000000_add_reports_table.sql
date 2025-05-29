-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'message', 'trip')),
  reason TEXT NOT NULL,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_target_id ON reports(target_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Only moderators can update reports
CREATE POLICY "Moderators can update reports"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'moderator'
    )
  );

-- Create view for moderators
CREATE VIEW moderator_reports AS
SELECT 
  r.*,
  reporter.email as reporter_email,
  CASE 
    WHEN r.target_type = 'user' THEN user_target.email
    WHEN r.target_type = 'message' THEN message_target.content
    WHEN r.target_type = 'trip' THEN trip_target.title
  END as target_details
FROM reports r
LEFT JOIN auth.users reporter ON reporter.id = r.reporter_id
LEFT JOIN auth.users user_target ON r.target_type = 'user' AND user_target.id = r.target_id
LEFT JOIN messages message_target ON r.target_type = 'message' AND message_target.id = r.target_id::uuid
LEFT JOIN trips trip_target ON r.target_type = 'trip' AND trip_target.id = r.target_id::uuid;

-- Grant access to moderators
CREATE POLICY "Moderators can view all reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'moderator'
    )
  );

GRANT SELECT ON moderator_reports TO authenticated; 
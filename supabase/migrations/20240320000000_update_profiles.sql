-- Update profiles table with new required fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_type text NOT NULL DEFAULT 'renter' CHECK (user_type IN ('renter', 'sharer')),
ADD COLUMN IF NOT EXISTS verification_status jsonb NOT NULL DEFAULT '{"email": false, "phone": false, "address": false, "social": false}'::jsonb,
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{"facebook": null, "twitter": null, "linkedin": null, "instagram": null}'::jsonb,
ADD COLUMN IF NOT EXISTS profile_picture_required boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS profile_completed boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS plaid_token text;

-- Create a function to update profile_completed status
CREATE OR REPLACE FUNCTION update_profile_completed()
RETURNS trigger AS $$
BEGIN
  NEW.profile_completed := 
    NEW.full_name IS NOT NULL AND
    NEW.phone IS NOT NULL AND
    NEW.address IS NOT NULL AND
    NEW.avatar_url IS NOT NULL AND
    (NEW.verification_status->>'email')::boolean AND
    (NEW.verification_status->>'phone')::boolean AND
    (NEW.verification_status->>'address')::boolean;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update profile_completed
CREATE TRIGGER check_profile_completed
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completed(); 
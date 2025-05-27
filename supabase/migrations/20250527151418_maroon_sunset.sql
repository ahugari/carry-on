/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text)
      - `phone` (text)
      - `address` (text)
      - `rating` (numeric)
      - `total_reviews` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `trips`
      - `id` (uuid, primary key)
      - `sharer_id` (uuid) - References profiles
      - `departure_city` (text)
      - `arrival_city` (text)
      - `departure_date` (timestamp)
      - `arrival_date` (timestamp)
      - `airline` (text)
      - `flight_number` (text)
      - `space_length` (numeric)
      - `space_width` (numeric)
      - `space_height` (numeric)
      - `space_unit` (text)
      - `weight_limit` (numeric)
      - `weight_unit` (text)
      - `item_count` (integer)
      - `price` (numeric)
      - `currency` (text)
      - `accepted_categories` (text[])
      - `restrictions` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `items`
      - `id` (uuid, primary key)
      - `renter_id` (uuid) - References profiles
      - `name` (text)
      - `description` (text)
      - `pickup_city` (text)
      - `delivery_city` (text)
      - `length` (numeric)
      - `width` (numeric)
      - `height` (numeric)
      - `unit` (text)
      - `weight` (numeric)
      - `weight_unit` (text)
      - `category` (text)
      - `value` (numeric)
      - `currency` (text)
      - `photos` (text[])
      - `desired_date` (timestamp)
      - `special_instructions` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid) - References profiles
      - `receiver_id` (uuid) - References profiles
      - `trip_id` (uuid) - References trips
      - `item_id` (uuid) - References items
      - `content` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `reviewer_id` (uuid) - References profiles
      - `reviewed_id` (uuid) - References profiles
      - `trip_id` (uuid) - References trips
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  address text,
  rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sharer_id uuid REFERENCES profiles ON DELETE CASCADE,
  departure_city text NOT NULL,
  arrival_city text NOT NULL,
  departure_date timestamptz NOT NULL,
  arrival_date timestamptz NOT NULL,
  airline text,
  flight_number text,
  space_length numeric NOT NULL,
  space_width numeric NOT NULL,
  space_height numeric NOT NULL,
  space_unit text NOT NULL,
  weight_limit numeric NOT NULL,
  weight_unit text NOT NULL,
  item_count integer NOT NULL,
  price numeric NOT NULL,
  currency text NOT NULL,
  accepted_categories text[],
  restrictions text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  renter_id uuid REFERENCES profiles ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  pickup_city text NOT NULL,
  delivery_city text NOT NULL,
  length numeric NOT NULL,
  width numeric NOT NULL,
  height numeric NOT NULL,
  unit text NOT NULL,
  weight numeric NOT NULL,
  weight_unit text NOT NULL,
  category text NOT NULL,
  value numeric NOT NULL,
  currency text NOT NULL,
  photos text[] NOT NULL,
  desired_date timestamptz,
  special_instructions text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles ON DELETE CASCADE,
  receiver_id uuid REFERENCES profiles ON DELETE CASCADE,
  trip_id uuid REFERENCES trips ON DELETE CASCADE,
  item_id uuid REFERENCES items ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid REFERENCES profiles ON DELETE CASCADE,
  reviewed_id uuid REFERENCES profiles ON DELETE CASCADE,
  trip_id uuid REFERENCES trips ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trips policies
CREATE POLICY "Trips are viewable by everyone"
  ON trips FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = sharer_id);

CREATE POLICY "Users can update own trips"
  ON trips FOR UPDATE
  USING (auth.uid() = sharer_id);

-- Items policies
CREATE POLICY "Items are viewable by everyone"
  ON items FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own items"
  ON items FOR INSERT
  WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update own items"
  ON items FOR UPDATE
  USING (auth.uid() = renter_id);

-- Messages policies
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can insert messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their sent messages"
  ON messages FOR UPDATE
  USING (auth.uid() IN (sender_id, receiver_id));

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert reviews for completed trips"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Create function to update profile rating
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE reviewed_id = NEW.reviewed_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE reviewed_id = NEW.reviewed_id
    ),
    updated_at = now()
  WHERE id = NEW.reviewed_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update profile rating when a review is added
CREATE TRIGGER update_profile_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_profile_rating();
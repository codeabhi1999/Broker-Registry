-- =========================================================
-- SUPABASE MIGRATION: ADD MISSING ADMIN PANEL FIELDS & TABLES
-- Copy and paste this script into Supabase SQL Editor and click Run.
-- =========================================================

-- 1. Missing fields for 'brokers' table
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS license_status TEXT DEFAULT 'Regulated';
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS trading_env TEXT DEFAULT 'AAA';
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS field_survey TEXT DEFAULT '';
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS user_rating NUMERIC(3, 1) DEFAULT 4.5;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS sub_scores JSONB DEFAULT '{"license": 8.0, "business": 8.0, "risk": 8.0, "software": 8.0}';
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]';

-- 2. Missing 'scam_alerts' table (Used by Admin Panel "Issue Scam Alert")
CREATE TABLE IF NOT EXISTS scam_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker TEXT NOT NULL,
  country TEXT DEFAULT 'Unknown',
  type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'High',
  description TEXT NOT NULL,
  date TEXT DEFAULT CURRENT_DATE::TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Missing 'field_surveys' table (Used by Admin Panel "Submit Field Survey")
CREATE TABLE IF NOT EXISTS field_surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker TEXT NOT NULL,
  country TEXT NOT NULL,
  address TEXT NOT NULL,
  score NUMERIC(3, 1) DEFAULT 8.0,
  status TEXT NOT NULL DEFAULT 'Verified',
  findings TEXT NOT NULL,
  date TEXT DEFAULT CURRENT_DATE::TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Disable RLS so all frontend & backend queries work seamlessly
ALTER TABLE brokers DISABLE ROW LEVEL SECURITY;
ALTER TABLE exposures DISABLE ROW LEVEL SECURITY;
ALTER TABLE news DISABLE ROW LEVEL SECURITY;
ALTER TABLE scam_alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE field_surveys DISABLE ROW LEVEL SECURITY;

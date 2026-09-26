-- SANAD SUPABASE SCHEMA

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  preferred_language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. CLAIMS
CREATE TYPE claim_status AS ENUM ('DRAFT', 'AI_ANALYZED', 'USER_CONFIRMED', 'CREDENTIAL_ISSUED');

CREATE TABLE IF NOT EXISTS public.claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_statement text NOT NULL,
  structured_data jsonb NOT NULL,
  status claim_status DEFAULT 'DRAFT',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. SERVICES (Knowledge Base)
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text,
  requirements jsonb,
  official_url text,
  created_at timestamptz DEFAULT now()
);

-- 4. CREDENTIALS
CREATE TYPE credential_status AS ENUM ('VALID', 'REVOKED');

CREATE TABLE IF NOT EXISTS public.credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id uuid REFERENCES public.claims(id),
  user_id uuid REFERENCES public.profiles(id),
  blockchain_hash text UNIQUE,
  blockchain_address text,
  status credential_status DEFAULT 'VALID',
  issued_at timestamptz DEFAULT now()
);

-- 5. APPLICATIONS
CREATE TYPE application_status AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'COMPLETED');

CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  service_id uuid REFERENCES public.services(id),
  claim_id uuid REFERENCES public.claims(id),
  status application_status DEFAULT 'DRAFT',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policies for Authenticated Users (users can only see their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own claims" ON public.claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own claims" ON public.claims FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own claims" ON public.claims FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Services are public" ON public.services FOR SELECT USING (true);

CREATE POLICY "Users can view own credentials" ON public.credentials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);

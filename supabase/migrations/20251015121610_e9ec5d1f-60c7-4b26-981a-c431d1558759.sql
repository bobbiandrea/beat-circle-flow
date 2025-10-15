-- Create enum for subscription tiers
CREATE TYPE public.subscription_tier AS ENUM ('free', 'premium');

-- Create enum for notification types
CREATE TYPE public.notification_type AS ENUM ('update', 'new_artist', 'new_music', 'link');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  wallet_address TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  listening_streak INTEGER DEFAULT 0,
  total_listening_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mint_passes table for NFT access
CREATE TABLE public.mint_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  token_id TEXT UNIQUE NOT NULL,
  contract_address TEXT NOT NULL,
  tier subscription_tier DEFAULT 'premium',
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create artists table with spotlight feature
CREATE TABLE public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  platform TEXT, -- 'spotify', 'boomplay', 'catalogue', 'sound.xyz', etc.
  platform_id TEXT,
  is_spotlighted BOOLEAN DEFAULT false,
  spotlight_start TIMESTAMP WITH TIME ZONE,
  spotlight_end TIMESTAMP WITH TIME ZONE,
  total_listeners INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link_url TEXT,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create listening_sessions table for tracking streaks
CREATE TABLE public.listening_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  song_title TEXT NOT NULL,
  artist_name TEXT,
  platform TEXT,
  duration_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mint_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Mint passes policies
CREATE POLICY "Users can view own mint passes"
  ON public.mint_passes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mint passes"
  ON public.mint_passes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Artists policies (public read)
CREATE POLICY "Anyone can view artists"
  ON public.artists FOR SELECT
  USING (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Listening sessions policies
CREATE POLICY "Users can view own sessions"
  ON public.listening_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.listening_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically spotlight trending artists
CREATE OR REPLACE FUNCTION public.auto_spotlight_artists()
RETURNS void AS $$
BEGIN
  -- Clear existing spotlights that have expired
  UPDATE public.artists
  SET is_spotlighted = false
  WHERE is_spotlighted = true
    AND spotlight_end < now();
  
  -- Spotlight top 3 artists with most listeners who aren't already spotlighted
  UPDATE public.artists
  SET 
    is_spotlighted = true,
    spotlight_start = now(),
    spotlight_end = now() + INTERVAL '7 days'
  WHERE id IN (
    SELECT id FROM public.artists
    WHERE is_spotlighted = false
    ORDER BY total_listeners DESC
    LIMIT 3
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
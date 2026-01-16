-- ==========================================
-- SHADOWCORE Database Schema
-- Version: 1.0.0
-- Last Updated: 2026-01-16
-- ==========================================

-- ==========================================
-- CORE TABLES
-- ==========================================

-- Users extension (links to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  preferred_model TEXT DEFAULT 'claude-opus-4.5',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SYNTHESIO TABLES (Product Architect)
-- ==========================================

-- Creator profiles from Instagram scraping
CREATE TABLE public.creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  instagram_handle TEXT,
  youtube_url TEXT,
  name TEXT,
  bio TEXT,
  profile_picture_url TEXT,
  follower_count INTEGER,
  following_count INTEGER,
  post_count INTEGER,
  engagement_rate DECIMAL(5,2),
  profile_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator DNA extraction results
CREATE TABLE public.creator_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE UNIQUE,
  niche TEXT,
  audience_pain_points JSONB,
  creator_archetype TEXT CHECK (creator_archetype IN ('authority', 'lifestyle', 'educator', 'personality')),
  tone_of_voice TEXT,
  content_frequency TEXT,
  current_monetization DECIMAL(10,2),
  potential_income DECIMAL(10,2),
  desperation_score INTEGER CHECK (desperation_score >= 1 AND desperation_score <= 10),
  recommended_product_type TEXT,
  raw_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monetization gameplans
CREATE TABLE public.gameplans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  uvz_data JSONB,
  revenue_projections JSONB,
  product_recommendation JSONB,
  curriculum JSONB,
  pitch_deck_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Niche database (200+ niches)
CREATE TABLE public.niche_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_name TEXT UNIQUE NOT NULL,
  archetype_ideal TEXT,
  product_type_recommended TEXT,
  avg_price_point DECIMAL(10,2),
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  saturation_score INTEGER CHECK (saturation_score >= 0 AND saturation_score <= 100),
  monetization_difficulty INTEGER CHECK (monetization_difficulty >= 1 AND monetization_difficulty <= 10),
  profitability_score INTEGER CHECK (profitability_score >= 1 AND profitability_score <= 10),
  growth_trajectory TEXT CHECK (growth_trajectory IN ('rising', 'stable', 'declining')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- GHOSTWRITE TABLES (Copywriting OS)
-- ==========================================

-- Campaign DNA (voice/brand settings)
CREATE TABLE public.campaign_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  author_bio TEXT,
  brand_voice JSONB,
  icp JSONB,
  buying_psychology JSONB,
  offer_details JSONB,
  voice_model JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated content
CREATE TABLE public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_dna_id UUID REFERENCES public.campaign_dna(id) ON DELETE SET NULL,
  agent_type TEXT NOT NULL,
  input_context JSONB,
  output_content TEXT,
  model_used TEXT,
  tokens_used INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story templates (14-day sequence)
CREATE TABLE public.story_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_number INTEGER CHECK (phase_number >= 1 AND phase_number <= 3),
  day_number INTEGER CHECK (day_number >= 1 AND day_number <= 14),
  psychological_trigger TEXT,
  copy_template TEXT,
  image_direction TEXT,
  expected_engagement_rate DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- FLOWY TABLES (CRM)
-- ==========================================

-- CRM Contacts
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  instagram_handle TEXT,
  name TEXT,
  profile_url TEXT,
  profile_picture_url TEXT,
  follower_count INTEGER,
  engagement_rate DECIMAL(5,2),
  niche TEXT,
  status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'reached_out', 'in_conversation', 'deal_signed', 'active_client', 'churned')),
  reached_out_at TIMESTAMPTZ,
  last_contacted_at TIMESTAMPTZ,
  notes TEXT,
  tags TEXT[],
  creator_id UUID REFERENCES public.creators(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, instagram_handle)
);

-- Interaction log
CREATE TABLE public.interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('dm_sent', 'dm_received', 'call', 'note', 'gameplan_created', 'gameplan_sent', 'status_change')),
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follow-up reminders
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  due_at TIMESTAMPTZ NOT NULL,
  message TEXT,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- RLS POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gameplans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Creators: Users can only access their own creators
CREATE POLICY "Users can CRUD own creators" ON public.creators FOR ALL USING (auth.uid() = user_id);

-- Creator DNA: Access through creator ownership
CREATE POLICY "Users can CRUD own creator_dna" ON public.creator_dna FOR ALL
  USING (EXISTS (SELECT 1 FROM public.creators WHERE creators.id = creator_dna.creator_id AND creators.user_id = auth.uid()));

-- Gameplans: Users can only access their own
CREATE POLICY "Users can CRUD own gameplans" ON public.gameplans FOR ALL USING (auth.uid() = user_id);

-- Campaign DNA: Users can only access their own
CREATE POLICY "Users can CRUD own campaign_dna" ON public.campaign_dna FOR ALL USING (auth.uid() = user_id);

-- Generations: Users can only access their own
CREATE POLICY "Users can CRUD own generations" ON public.generations FOR ALL USING (auth.uid() = user_id);

-- Contacts: Users can only access their own
CREATE POLICY "Users can CRUD own contacts" ON public.contacts FOR ALL USING (auth.uid() = user_id);

-- Interactions: Users can only access their own
CREATE POLICY "Users can CRUD own interactions" ON public.interactions FOR ALL USING (auth.uid() = user_id);

-- Reminders: Users can only access their own
CREATE POLICY "Users can CRUD own reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id);

-- Niche database: Public read access
ALTER TABLE public.niche_database ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Niche database is publicly readable" ON public.niche_database FOR SELECT TO authenticated USING (true);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_creators_user_id ON public.creators(user_id);
CREATE INDEX idx_creators_instagram ON public.creators(instagram_handle);
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_contacts_status ON public.contacts(status);
CREATE INDEX idx_contacts_instagram ON public.contacts(instagram_handle);
CREATE INDEX idx_interactions_contact_id ON public.interactions(contact_id);
CREATE INDEX idx_reminders_due_at ON public.reminders(due_at) WHERE completed = false;
CREATE INDEX idx_generations_user_id ON public.generations(user_id);
CREATE INDEX idx_generations_agent_type ON public.generations(agent_type);

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at
  BEFORE UPDATE ON public.creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_dna_updated_at
  BEFORE UPDATE ON public.creator_dna
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gameplans_updated_at
  BEFORE UPDATE ON public.gameplans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_dna_updated_at
  BEFORE UPDATE ON public.campaign_dna
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

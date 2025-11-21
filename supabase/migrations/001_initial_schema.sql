-- SkillSync Database Schema
-- Initial migration for all core tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  job_title TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Tool Integrations table
CREATE TABLE public.ai_tool_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL, -- 'claude_code', 'github_copilot', 'cursor'
  encrypted_api_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_name)
);

-- AI Usage Metrics table
CREATE TABLE public.ai_usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  date DATE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_requests INTEGER DEFAULT 0,
  metadata JSONB, -- Additional tool-specific data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_name, date)
);

-- Challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL, -- 'algorithms', 'frontend', 'backend', 'fullstack', 'database'
  points INTEGER DEFAULT 0,
  time_limit_minutes INTEGER,
  requirements JSONB NOT NULL, -- Detailed requirements
  starter_code TEXT,
  test_cases JSONB, -- Test cases for evaluation
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  github_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'evaluating', 'completed', 'failed')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  evaluated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,

  -- Scores
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  functionality_score INTEGER,
  code_quality_score INTEGER,
  performance_score INTEGER,

  -- Test Results
  tests_passed INTEGER DEFAULT 0,
  tests_failed INTEGER DEFAULT 0,
  test_results JSONB,

  -- AI Feedback
  ai_feedback JSONB, -- { strengths: [], improvements: [], bestPractices: [], security: [] }
  detailed_analysis TEXT,

  -- Metadata
  evaluation_time_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- Emoji or icon identifier
  image_url TEXT, -- Generated badge image
  category TEXT NOT NULL, -- 'challenge', 'usage', 'streak', 'special'
  criteria JSONB NOT NULL, -- Requirements to earn the badge
  points INTEGER DEFAULT 0,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Badges table (earned badges)
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  certificate_url TEXT, -- Generated certificate PDF
  shared_on_linkedin BOOLEAN DEFAULT false,
  UNIQUE(user_id, badge_id)
);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_range TEXT,
  job_type TEXT NOT NULL, -- 'full-time', 'part-time', 'contract', 'remote'
  required_skills TEXT[],
  preferred_skills TEXT[],
  ai_skill_level TEXT, -- 'beginner', 'intermediate', 'advanced'
  is_active BOOLEAN DEFAULT true,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'interview', 'accepted', 'rejected')),
  cover_letter TEXT,
  resume_url TEXT,
  ai_skill_match_score INTEGER, -- 0-100 matching score
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Teams table (for company/team features)
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_ai_tool_integrations_user_id ON public.ai_tool_integrations(user_id);
CREATE INDEX idx_ai_usage_metrics_user_id ON public.ai_usage_metrics(user_id);
CREATE INDEX idx_ai_usage_metrics_date ON public.ai_usage_metrics(date);
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_challenge_id ON public.submissions(challenge_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_evaluations_user_id ON public.evaluations(user_id);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Users: Users can read their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- AI Tool Integrations: Users can manage their own integrations
CREATE POLICY "Users can view own integrations" ON public.ai_tool_integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own integrations" ON public.ai_tool_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integrations" ON public.ai_tool_integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own integrations" ON public.ai_tool_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- AI Usage Metrics: Users can view their own metrics
CREATE POLICY "Users can view own metrics" ON public.ai_usage_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Submissions: Users can manage their own submissions
CREATE POLICY "Users can view own submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Evaluations: Users can view their own evaluations
CREATE POLICY "Users can view own evaluations" ON public.evaluations
  FOR SELECT USING (auth.uid() = user_id);

-- User Badges: Users can view their own badges
CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Job Applications: Users can manage their own applications
CREATE POLICY "Users can view own applications" ON public.job_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" ON public.job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Team Members: Members can view their team
CREATE POLICY "Team members can view team" ON public.team_members
  FOR SELECT USING (auth.uid() = user_id);

-- Public read access for challenges, badges, and jobs
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenges are viewable by everyone" ON public.challenges
  FOR SELECT USING (is_published = true);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are viewable by everyone" ON public.badges
  FOR SELECT USING (is_active = true);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active jobs are viewable by everyone" ON public.jobs
  FOR SELECT USING (is_active = true);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teams are viewable by everyone" ON public.teams
  FOR SELECT USING (is_active = true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_tool_integrations_updated_at BEFORE UPDATE ON public.ai_tool_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON public.evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

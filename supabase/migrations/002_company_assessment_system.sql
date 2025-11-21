-- Migration: Company Assessment System
-- Description: Adds company/recruiter functionality for custom assessment creation
-- Date: 2025-11-21

-- Add user role and company information to users table
ALTER TABLE users
ADD COLUMN user_role VARCHAR(20) DEFAULT 'candidate' CHECK (user_role IN ('candidate', 'company', 'admin')),
ADD COLUMN company_name VARCHAR(255),
ADD COLUMN company_website VARCHAR(500),
ADD COLUMN company_verified BOOLEAN DEFAULT false,
ADD COLUMN company_verification_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN company_verification_document_url VARCHAR(1000);

-- Create index for faster role-based queries
CREATE INDEX idx_users_role ON users(user_role);
CREATE INDEX idx_users_company_verified ON users(company_verified) WHERE user_role = 'company';

-- Extend challenges table for custom company assessments
ALTER TABLE challenges
ADD COLUMN created_by_user_id UUID REFERENCES users(id),
ADD COLUMN is_custom BOOLEAN DEFAULT false,
ADD COLUMN is_public BOOLEAN DEFAULT true,
ADD COLUMN company_only BOOLEAN DEFAULT false,
ADD COLUMN assessment_type VARCHAR(30) DEFAULT 'coding' CHECK (assessment_type IN ('coding', 'prompt_engineering')),
ADD COLUMN evaluation_criteria JSONB,
ADD COLUMN estimated_time_minutes INTEGER,
ADD COLUMN max_attempts INTEGER DEFAULT 3,
ADD COLUMN passing_score INTEGER DEFAULT 70,
ADD COLUMN tags TEXT[];

-- Create index for custom challenge queries
CREATE INDEX idx_challenges_custom ON challenges(is_custom, is_public);
CREATE INDEX idx_challenges_creator ON challenges(created_by_user_id) WHERE is_custom = true;
CREATE INDEX idx_challenges_type ON challenges(assessment_type);
CREATE INDEX idx_challenges_tags ON challenges USING gin(tags);

-- Update challenges table comments
COMMENT ON COLUMN challenges.created_by_user_id IS 'User ID of the company/recruiter who created this custom assessment';
COMMENT ON COLUMN challenges.is_custom IS 'True if this is a custom assessment created by a company';
COMMENT ON COLUMN challenges.is_public IS 'True if this assessment is visible to all users';
COMMENT ON COLUMN challenges.company_only IS 'True if only company employees can take this assessment';
COMMENT ON COLUMN challenges.assessment_type IS 'Type of assessment: coding or prompt_engineering';
COMMENT ON COLUMN challenges.evaluation_criteria IS 'Custom evaluation criteria defined by the company';
COMMENT ON COLUMN challenges.estimated_time_minutes IS 'Estimated time to complete the assessment';
COMMENT ON COLUMN challenges.max_attempts IS 'Maximum number of attempts allowed per user';
COMMENT ON COLUMN challenges.passing_score IS 'Minimum score required to pass (0-100)';
COMMENT ON COLUMN challenges.tags IS 'Tags for categorization and search';

-- Create table for detailed evaluation feedback
CREATE TABLE detailed_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  challenge_id UUID REFERENCES challenges(id),

  -- Unified prompt quality scores (based on Claude, OpenAI, Gemini best practices)
  clarity_score INTEGER CHECK (clarity_score >= 0 AND clarity_score <= 100),
  specificity_score INTEGER CHECK (specificity_score >= 0 AND specificity_score <= 100),
  structure_score INTEGER CHECK (structure_score >= 0 AND structure_score <= 100),
  examples_score INTEGER CHECK (examples_score >= 0 AND examples_score <= 100),

  -- Weighted overall score
  overall_quality_score INTEGER CHECK (overall_quality_score >= 0 AND overall_quality_score <= 100),

  -- Detailed feedback per dimension
  clarity_feedback JSONB,
  specificity_feedback JSONB,
  structure_feedback JSONB,
  examples_feedback JSONB,

  -- Overall assessment
  overall_assessment TEXT,
  top_recommendations TEXT[],

  -- Metadata
  evaluated_by VARCHAR(50) DEFAULT 'gemini', -- AI model used for evaluation
  evaluation_version VARCHAR(20) DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(submission_id)
);

-- Create indexes for detailed_feedback
CREATE INDEX idx_detailed_feedback_evaluation ON detailed_feedback(evaluation_id);
CREATE INDEX idx_detailed_feedback_submission ON detailed_feedback(submission_id);
CREATE INDEX idx_detailed_feedback_user ON detailed_feedback(user_id);
CREATE INDEX idx_detailed_feedback_challenge ON detailed_feedback(challenge_id);
CREATE INDEX idx_detailed_feedback_score ON detailed_feedback(overall_quality_score);

-- Add comments
COMMENT ON TABLE detailed_feedback IS 'Detailed AI-powered feedback on prompt quality using unified evaluation criteria';
COMMENT ON COLUMN detailed_feedback.clarity_score IS 'Score for clarity dimension (0-100), 30% weight';
COMMENT ON COLUMN detailed_feedback.specificity_score IS 'Score for specificity dimension (0-100), 30% weight';
COMMENT ON COLUMN detailed_feedback.structure_score IS 'Score for structure dimension (0-100), 25% weight';
COMMENT ON COLUMN detailed_feedback.examples_score IS 'Score for examples dimension (0-100), 15% weight';
COMMENT ON COLUMN detailed_feedback.overall_quality_score IS 'Weighted average of all dimension scores';

-- Create table for company API usage and billing
CREATE TABLE company_api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id),
  evaluation_id UUID REFERENCES evaluations(id),

  -- API details
  api_provider VARCHAR(50) DEFAULT 'gemini',
  model_used VARCHAR(100),
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 4),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Billing status
  billing_status VARCHAR(20) DEFAULT 'pending' CHECK (billing_status IN ('pending', 'billed', 'failed')),
  billed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for API usage tracking
CREATE INDEX idx_api_usage_user ON company_api_usage(user_id);
CREATE INDEX idx_api_usage_challenge ON company_api_usage(challenge_id);
CREATE INDEX idx_api_usage_date ON company_api_usage(created_at);
CREATE INDEX idx_api_usage_billing ON company_api_usage(billing_status, user_id);

-- Add comments
COMMENT ON TABLE company_api_usage IS 'Tracks API usage and costs for company-created assessments';
COMMENT ON COLUMN company_api_usage.cost_usd IS 'Estimated cost in USD based on tokens used';

-- Create table for company assessment applications
CREATE TABLE assessment_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id),

  -- Application status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'reviewed')),

  -- Scores
  score INTEGER CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN,

  -- Company review
  reviewed_by UUID REFERENCES users(id),
  review_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(challenge_id, user_id)
);

-- Create indexes for assessment applications
CREATE INDEX idx_assessment_apps_challenge ON assessment_applications(challenge_id);
CREATE INDEX idx_assessment_apps_user ON assessment_applications(user_id);
CREATE INDEX idx_assessment_apps_status ON assessment_applications(status);
CREATE INDEX idx_assessment_apps_reviewed ON assessment_applications(reviewed_by);

-- Add comments
COMMENT ON TABLE assessment_applications IS 'Tracks user applications/attempts for company assessments';

-- Create view for company dashboard statistics
CREATE VIEW company_assessment_stats AS
SELECT
  c.id AS challenge_id,
  c.title,
  c.created_by_user_id AS company_user_id,
  c.assessment_type,
  COUNT(DISTINCT aa.user_id) AS total_applicants,
  COUNT(DISTINCT CASE WHEN aa.status = 'completed' THEN aa.user_id END) AS completed_count,
  COUNT(DISTINCT CASE WHEN aa.passed = true THEN aa.user_id END) AS passed_count,
  AVG(aa.score) AS average_score,
  SUM(cau.cost_usd) AS total_api_cost,
  c.created_at,
  c.updated_at
FROM challenges c
LEFT JOIN assessment_applications aa ON c.id = aa.challenge_id
LEFT JOIN company_api_usage cau ON c.id = cau.challenge_id
WHERE c.is_custom = true
GROUP BY c.id, c.title, c.created_by_user_id, c.assessment_type, c.created_at, c.updated_at;

-- Add comments
COMMENT ON VIEW company_assessment_stats IS 'Aggregated statistics for company-created assessments';

-- Row Level Security (RLS) Policies

-- Enable RLS on new tables
ALTER TABLE detailed_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_applications ENABLE ROW LEVEL SECURITY;

-- Detailed feedback policies
CREATE POLICY "Users can view their own detailed feedback"
  ON detailed_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Companies can view feedback for their challenges"
  ON detailed_feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = detailed_feedback.challenge_id
      AND challenges.created_by_user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert detailed feedback"
  ON detailed_feedback FOR INSERT
  WITH CHECK (true);

-- Company API usage policies
CREATE POLICY "Companies can view their own API usage"
  ON company_api_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert API usage"
  ON company_api_usage FOR INSERT
  WITH CHECK (true);

-- Assessment applications policies
CREATE POLICY "Users can view their own applications"
  ON assessment_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Companies can view applications for their challenges"
  ON assessment_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = assessment_applications.challenge_id
      AND challenges.created_by_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own applications"
  ON assessment_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON assessment_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Companies can update applications for their challenges"
  ON assessment_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = assessment_applications.challenge_id
      AND challenges.created_by_user_id = auth.uid()
    )
  );

-- Update challenges RLS policies for company features
DROP POLICY IF EXISTS "Users can view published challenges" ON challenges;
CREATE POLICY "Users can view published challenges"
  ON challenges FOR SELECT
  USING (
    (is_public = true AND company_only = false)
    OR (created_by_user_id = auth.uid())
    OR (
      company_only = true
      AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.company_name = (
          SELECT company_name FROM users WHERE id = challenges.created_by_user_id
        )
      )
    )
  );

CREATE POLICY "Companies can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (
    auth.uid() = created_by_user_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'company'
    )
  );

CREATE POLICY "Companies can update their own challenges"
  ON challenges FOR UPDATE
  USING (auth.uid() = created_by_user_id);

CREATE POLICY "Companies can delete their own challenges"
  ON challenges FOR DELETE
  USING (auth.uid() = created_by_user_id);

-- Grant permissions
GRANT SELECT ON company_assessment_stats TO authenticated;
GRANT ALL ON detailed_feedback TO authenticated;
GRANT ALL ON company_api_usage TO authenticated;
GRANT ALL ON assessment_applications TO authenticated;

-- Add trigger for updated_at on detailed_feedback
CREATE TRIGGER update_detailed_feedback_updated_at
  BEFORE UPDATE ON detailed_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

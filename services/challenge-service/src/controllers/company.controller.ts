/**
 * Company Assessment Controller
 *
 * Handles CRUD operations for company-created custom assessments
 */

import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

/**
 * Create a new custom assessment
 * POST /api/company/assessments
 */
export async function createAssessment(req: Request, res: Response) {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      assessment_type,
      problem_statement,
      starter_code,
      test_cases,
      evaluation_criteria,
      estimated_time_minutes,
      max_attempts,
      passing_score,
      is_public,
      company_only,
      tags,
    } = req.body;

    // Get user ID from auth (in production, extract from JWT)
    const user_id = req.headers['x-user-id'] as string;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify user is a company
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_role, company_verified')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return res.status(403).json({ error: 'User not found' });
    }

    if (user.user_role !== 'company') {
      return res.status(403).json({
        error: 'Only company accounts can create custom assessments',
      });
    }

    if (!user.company_verified) {
      return res.status(403).json({
        error: 'Company must be verified before creating assessments',
      });
    }

    // Validate required fields
    if (!title || !description || !assessment_type) {
      return res.status(400).json({
        error: 'Missing required fields: title, description, assessment_type',
      });
    }

    // Validate assessment_type
    if (!['coding', 'prompt_engineering'].includes(assessment_type)) {
      return res.status(400).json({
        error: 'assessment_type must be either "coding" or "prompt_engineering"',
      });
    }

    // Create assessment
    const { data: challenge, error: createError } = await supabase
      .from('challenges')
      .insert({
        title,
        description,
        difficulty: difficulty || 'medium',
        category: category || 'general',
        assessment_type,
        problem_statement,
        starter_code,
        test_cases,
        evaluation_criteria,
        estimated_time_minutes: estimated_time_minutes || 60,
        max_attempts: max_attempts || 3,
        passing_score: passing_score || 70,
        is_public: is_public !== false, // default true
        company_only: company_only === true, // default false
        is_custom: true,
        created_by_user_id: user_id,
        tags: tags || [],
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating assessment:', createError);
      return res.status(500).json({ error: 'Failed to create assessment' });
    }

    res.status(201).json({
      message: 'Assessment created successfully',
      assessment: challenge,
    });
  } catch (error) {
    console.error('Error in createAssessment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all assessments created by the company
 * GET /api/company/assessments
 */
export async function getCompanyAssessments(req: Request, res: Response) {
  try {
    const user_id = req.headers['x-user-id'] as string;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('created_by_user_id', user_id)
      .eq('is_custom', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching company assessments:', error);
      return res.status(500).json({ error: 'Failed to fetch assessments' });
    }

    res.json({ assessments: challenges || [] });
  } catch (error) {
    console.error('Error in getCompanyAssessments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get a specific assessment by ID
 * GET /api/company/assessments/:id
 */
export async function getAssessmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user_id = req.headers['x-user-id'] as string;

    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: challenge, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .eq('created_by_user_id', user_id)
      .single();

    if (error || !challenge) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.json({ assessment: challenge });
  } catch (error) {
    console.error('Error in getAssessmentById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update an assessment
 * PUT /api/company/assessments/:id
 */
export async function updateAssessment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user_id = req.headers['x-user-id'] as string;

    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      title,
      description,
      difficulty,
      category,
      problem_statement,
      starter_code,
      test_cases,
      evaluation_criteria,
      estimated_time_minutes,
      max_attempts,
      passing_score,
      is_public,
      company_only,
      tags,
    } = req.body;

    // Build update object (only include provided fields)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (category !== undefined) updateData.category = category;
    if (problem_statement !== undefined) updateData.problem_statement = problem_statement;
    if (starter_code !== undefined) updateData.starter_code = starter_code;
    if (test_cases !== undefined) updateData.test_cases = test_cases;
    if (evaluation_criteria !== undefined) updateData.evaluation_criteria = evaluation_criteria;
    if (estimated_time_minutes !== undefined) updateData.estimated_time_minutes = estimated_time_minutes;
    if (max_attempts !== undefined) updateData.max_attempts = max_attempts;
    if (passing_score !== undefined) updateData.passing_score = passing_score;
    if (is_public !== undefined) updateData.is_public = is_public;
    if (company_only !== undefined) updateData.company_only = company_only;
    if (tags !== undefined) updateData.tags = tags;

    const { data: challenge, error } = await supabase
      .from('challenges')
      .update(updateData)
      .eq('id', id)
      .eq('created_by_user_id', user_id)
      .select()
      .single();

    if (error || !challenge) {
      console.error('Error updating assessment:', error);
      return res.status(404).json({ error: 'Assessment not found or update failed' });
    }

    res.json({
      message: 'Assessment updated successfully',
      assessment: challenge,
    });
  } catch (error) {
    console.error('Error in updateAssessment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete an assessment
 * DELETE /api/company/assessments/:id
 */
export async function deleteAssessment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user_id = req.headers['x-user-id'] as string;

    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id)
      .eq('created_by_user_id', user_id);

    if (error) {
      console.error('Error deleting assessment:', error);
      return res.status(500).json({ error: 'Failed to delete assessment' });
    }

    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAssessment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get applications for a specific assessment
 * GET /api/company/assessments/:id/applications
 */
export async function getAssessmentApplications(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user_id = req.headers['x-user-id'] as string;

    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the challenge belongs to this company
    const { data: challenge } = await supabase
      .from('challenges')
      .select('id')
      .eq('id', id)
      .eq('created_by_user_id', user_id)
      .single();

    if (!challenge) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Get applications with user details
    const { data: applications, error } = await supabase
      .from('assessment_applications')
      .select(`
        *,
        users:user_id (
          id,
          email,
          full_name,
          github_username
        ),
        submissions:submission_id (
          id,
          code,
          language,
          submitted_at
        )
      `)
      .eq('challenge_id', id)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }

    res.json({ applications: applications || [] });
  } catch (error) {
    console.error('Error in getAssessmentApplications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Review an application
 * POST /api/company/assessments/:id/applications/:applicationId/review
 */
export async function reviewApplication(req: Request, res: Response) {
  try {
    const { id, applicationId } = req.params;
    const { review_notes } = req.body;
    const user_id = req.headers['x-user-id'] as string;

    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the challenge belongs to this company
    const { data: challenge } = await supabase
      .from('challenges')
      .select('id')
      .eq('id', id)
      .eq('created_by_user_id', user_id)
      .single();

    if (!challenge) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Update application with review
    const { data: application, error } = await supabase
      .from('assessment_applications')
      .update({
        status: 'reviewed',
        reviewed_by: user_id,
        review_notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .eq('challenge_id', id)
      .select()
      .single();

    if (error || !application) {
      console.error('Error reviewing application:', error);
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      message: 'Application reviewed successfully',
      application,
    });
  } catch (error) {
    console.error('Error in reviewApplication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get company assessment statistics
 * GET /api/company/stats
 */
export async function getCompanyStats(req: Request, res: Response) {
  try {
    const user_id = req.headers['x-user-id'] as string;

    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get stats from the view
    const { data: stats, error } = await supabase
      .from('company_assessment_stats')
      .select('*')
      .eq('company_user_id', user_id);

    if (error) {
      console.error('Error fetching company stats:', error);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    // Calculate totals
    const totals = (stats || []).reduce(
      (acc, stat) => ({
        total_assessments: acc.total_assessments + 1,
        total_applicants: acc.total_applicants + (stat.total_applicants || 0),
        total_completed: acc.total_completed + (stat.completed_count || 0),
        total_passed: acc.total_passed + (stat.passed_count || 0),
        total_api_cost: acc.total_api_cost + (parseFloat(stat.total_api_cost) || 0),
      }),
      {
        total_assessments: 0,
        total_applicants: 0,
        total_completed: 0,
        total_passed: 0,
        total_api_cost: 0,
      }
    );

    res.json({
      totals,
      assessments: stats || [],
    });
  } catch (error) {
    console.error('Error in getCompanyStats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

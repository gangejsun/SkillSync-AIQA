/**
 * Detailed Evaluation Controller
 *
 * Handles detailed AI-powered evaluations with prompt quality scoring
 * using Google Gemini API and unified evaluation criteria
 */

import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import {
  evaluatePromptWithGemini,
  evaluateCodeWithGemini,
  estimateAPICost,
} from '../lib/gemini';

/**
 * Enqueue detailed evaluation with Gemini
 * POST /api/evaluate/detailed/enqueue
 */
export async function enqueueDetailedEvaluation(req: Request, res: Response) {
  try {
    const { submission_id } = req.body;

    if (!submission_id) {
      return res.status(400).json({ error: 'submission_id is required' });
    }

    // Get submission details
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select(`
        *,
        challenges (
          id,
          title,
          description,
          difficulty,
          category,
          assessment_type,
          created_by_user_id
        )
      `)
      .eq('id', submission_id)
      .single();

    if (submissionError || !submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const challenge = submission.challenges as any;

    // Check if assessment_type is defined
    const assessmentType = challenge.assessment_type || 'coding';

    let evaluationResult: any;
    let tokensUsed = 0;

    try {
      if (assessmentType === 'prompt_engineering') {
        // Evaluate prompt quality
        evaluationResult = await evaluatePromptWithGemini(
          submission.code, // In prompt engineering, code field contains the prompt
          {
            title: challenge.title,
            description: challenge.description,
            assessment_type: 'prompt_engineering',
          }
        );

        tokensUsed = evaluationResult.metadata.tokensUsed;

        // Store detailed feedback
        const { error: feedbackError } = await supabase
          .from('detailed_feedback')
          .insert({
            submission_id: submission.id,
            user_id: submission.user_id,
            challenge_id: challenge.id,
            clarity_score: evaluationResult.scores.clarity,
            specificity_score: evaluationResult.scores.specificity,
            structure_score: evaluationResult.scores.structure,
            examples_score: evaluationResult.scores.examples,
            overall_quality_score: evaluationResult.scores.overall,
            clarity_feedback: evaluationResult.feedback.clarity,
            specificity_feedback: evaluationResult.feedback.specificity,
            structure_feedback: evaluationResult.feedback.structure,
            examples_feedback: evaluationResult.feedback.examples,
            overall_assessment: evaluationResult.overallAssessment,
            top_recommendations: evaluationResult.topRecommendations,
            evaluated_by: 'gemini',
            evaluation_version: 'v1.0',
          });

        if (feedbackError) {
          console.error('Error storing detailed feedback:', feedbackError);
        }

        // Create or update evaluation record
        const { data: evaluation, error: evalError } = await supabase
          .from('evaluations')
          .insert({
            submission_id: submission.id,
            user_id: submission.user_id,
            challenge_id: challenge.id,
            status: 'completed',
            score: evaluationResult.scores.overall,
            feedback: evaluationResult.overallAssessment,
            strengths: evaluationResult.topRecommendations.slice(0, 3),
            improvements: evaluationResult.topRecommendations.slice(3, 6),
            completed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (evalError) {
          console.error('Error creating evaluation:', evalError);
          return res.status(500).json({ error: 'Failed to create evaluation' });
        }

        // Update detailed_feedback with evaluation_id
        await supabase
          .from('detailed_feedback')
          .update({ evaluation_id: evaluation.id })
          .eq('submission_id', submission.id);

        // Track API usage if this is a company assessment
        if (challenge.created_by_user_id) {
          const cost = estimateAPICost(tokensUsed);
          await supabase.from('company_api_usage').insert({
            user_id: challenge.created_by_user_id,
            challenge_id: challenge.id,
            evaluation_id: evaluation.id,
            api_provider: 'gemini',
            model_used: 'gemini-1.5-pro-latest',
            tokens_used: tokensUsed,
            cost_usd: cost,
            billing_status: 'pending',
          });
        }

        res.json({
          message: 'Evaluation completed',
          evaluation_id: evaluation.id,
          scores: evaluationResult.scores,
          tokensUsed,
        });
      } else {
        // Evaluate coding submission
        evaluationResult = await evaluateCodeWithGemini(submission.code, {
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty,
          category: challenge.category,
        });

        tokensUsed = evaluationResult.tokensUsed;

        // Create evaluation record
        const { data: evaluation, error: evalError } = await supabase
          .from('evaluations')
          .insert({
            submission_id: submission.id,
            user_id: submission.user_id,
            challenge_id: challenge.id,
            status: 'completed',
            score: evaluationResult.score,
            feedback: evaluationResult.feedback,
            strengths: evaluationResult.strengths,
            improvements: evaluationResult.improvements,
            completed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (evalError) {
          console.error('Error creating evaluation:', evalError);
          return res.status(500).json({ error: 'Failed to create evaluation' });
        }

        // Track API usage if this is a company assessment
        if (challenge.created_by_user_id) {
          const cost = estimateAPICost(tokensUsed);
          await supabase.from('company_api_usage').insert({
            user_id: challenge.created_by_user_id,
            challenge_id: challenge.id,
            evaluation_id: evaluation.id,
            api_provider: 'gemini',
            model_used: 'gemini-1.5-pro-latest',
            tokens_used: tokensUsed,
            cost_usd: cost,
            billing_status: 'pending',
          });
        }

        res.json({
          message: 'Evaluation completed',
          evaluation_id: evaluation.id,
          score: evaluationResult.score,
          tokensUsed,
        });
      }
    } catch (error) {
      console.error('Error during AI evaluation:', error);

      // Create failed evaluation record
      await supabase.from('evaluations').insert({
        submission_id: submission.id,
        user_id: submission.user_id,
        challenge_id: challenge.id,
        status: 'failed',
        feedback: 'Evaluation failed due to an error',
      });

      return res.status(500).json({ error: 'Evaluation failed' });
    }
  } catch (error) {
    console.error('Error in enqueueDetailedEvaluation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get detailed feedback for a submission
 * GET /api/evaluate/detailed/submission/:submission_id
 */
export async function getDetailedFeedback(req: Request, res: Response) {
  try {
    const { submission_id } = req.params;

    const { data: feedback, error } = await supabase
      .from('detailed_feedback')
      .select(`
        *,
        evaluations (
          id,
          score,
          feedback,
          status,
          completed_at
        ),
        challenges (
          id,
          title,
          assessment_type
        )
      `)
      .eq('submission_id', submission_id)
      .single();

    if (error || !feedback) {
      return res.status(404).json({ error: 'Detailed feedback not found' });
    }

    res.json({ feedback });
  } catch (error) {
    console.error('Error in getDetailedFeedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all detailed feedback for a user
 * GET /api/evaluate/detailed/user/:user_id
 */
export async function getUserDetailedFeedback(req: Request, res: Response) {
  try {
    const { user_id } = req.params;

    const { data: feedbackList, error } = await supabase
      .from('detailed_feedback')
      .select(`
        *,
        challenges (
          id,
          title,
          difficulty,
          assessment_type
        ),
        evaluations (
          id,
          score,
          completed_at
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user detailed feedback:', error);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }

    res.json({ feedback: feedbackList || [] });
  } catch (error) {
    console.error('Error in getUserDetailedFeedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get API usage statistics for a company
 * GET /api/evaluate/detailed/api-usage/:user_id
 */
export async function getAPIUsageStats(req: Request, res: Response) {
  try {
    const { user_id } = req.params;
    const { start_date, end_date } = req.query;

    let query = supabase
      .from('company_api_usage')
      .select('*')
      .eq('user_id', user_id);

    if (start_date) {
      query = query.gte('created_at', start_date);
    }
    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    const { data: usage, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      console.error('Error fetching API usage:', error);
      return res.status(500).json({ error: 'Failed to fetch API usage' });
    }

    // Calculate totals
    const totals = (usage || []).reduce(
      (acc, item) => ({
        total_requests: acc.total_requests + 1,
        total_tokens: acc.total_tokens + (item.tokens_used || 0),
        total_cost: acc.total_cost + (parseFloat(item.cost_usd) || 0),
      }),
      {
        total_requests: 0,
        total_tokens: 0,
        total_cost: 0,
      }
    );

    res.json({
      totals,
      usage: usage || [],
    });
  } catch (error) {
    console.error('Error in getAPIUsageStats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

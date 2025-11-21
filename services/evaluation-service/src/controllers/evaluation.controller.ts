import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { evaluateCodeWithClaude } from '../lib/claude';

/**
 * Enqueue a submission for evaluation
 * This endpoint triggers the evaluation process
 */
export const enqueueEvaluation = async (req: Request, res: Response) => {
  try {
    const { submission_id } = req.body;

    if (!submission_id) {
      return res.status(400).json({
        error: 'submission_id is required',
      });
    }

    // Get submission details
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select('*, challenges(*)')
      .eq('id', submission_id)
      .single();

    if (submissionError || !submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Update submission status to evaluating
    await supabase
      .from('submissions')
      .update({ status: 'evaluating' })
      .eq('id', submission_id);

    // In a real application, this would be done in a background job queue
    // For now, we'll process it synchronously (not recommended for production)

    // TODO: Fetch code from GitHub URL
    // For now, use placeholder code
    const placeholderCode = `// Code would be fetched from: ${submission.github_url}`;

    // Evaluate with Claude
    const evaluation = await evaluateCodeWithClaude(
      placeholderCode,
      submission.challenges
    );

    // Store evaluation results
    const { data: evaluationRecord, error: evalError } = await supabase
      .from('evaluations')
      .insert({
        submission_id: submission.id,
        user_id: submission.user_id,
        challenge_id: submission.challenge_id,
        overall_score: evaluation.overall_score,
        functionality_score: evaluation.functionality_score,
        code_quality_score: evaluation.code_quality_score,
        performance_score: evaluation.performance_score,
        tests_passed: evaluation.tests_passed,
        tests_failed: evaluation.tests_failed,
        test_results: evaluation.test_results,
        ai_feedback: evaluation.ai_feedback,
        detailed_analysis: evaluation.detailed_analysis,
      })
      .select()
      .single();

    if (evalError) {
      console.error('Error storing evaluation:', evalError);
      await supabase
        .from('submissions')
        .update({ status: 'failed' })
        .eq('id', submission_id);

      return res.status(500).json({ error: 'Failed to store evaluation' });
    }

    // Update submission status to completed
    await supabase
      .from('submissions')
      .update({
        status: 'completed',
        evaluated_at: new Date().toISOString(),
      })
      .eq('id', submission_id);

    res.status(201).json({
      success: true,
      message: 'Evaluation completed',
      evaluation: evaluationRecord,
    });
  } catch (error) {
    console.error('Error in enqueueEvaluation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get evaluation results by ID
 */
export const getEvaluation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('evaluations')
      .select('*, submissions(*, challenges(*))')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Evaluation not found' });
      }
      console.error('Error fetching evaluation:', error);
      return res.status(500).json({ error: 'Failed to fetch evaluation' });
    }

    res.json({
      success: true,
      evaluation: data,
    });
  } catch (error) {
    console.error('Error in getEvaluation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get evaluation by submission ID
 */
export const getEvaluationBySubmission = async (req: Request, res: Response) => {
  try {
    const { submission_id } = req.params;

    const { data, error } = await supabase
      .from('evaluations')
      .select('*, submissions(*, challenges(*))')
      .eq('submission_id', submission_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Evaluation not found' });
      }
      console.error('Error fetching evaluation:', error);
      return res.status(500).json({ error: 'Failed to fetch evaluation' });
    }

    res.json({
      success: true,
      evaluation: data,
    });
  } catch (error) {
    console.error('Error in getEvaluationBySubmission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get user's evaluation history
 */
export const getUserEvaluations = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const { data, error } = await supabase
      .from('evaluations')
      .select('*, submissions(*, challenges(*))')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching evaluations:', error);
      return res.status(500).json({ error: 'Failed to fetch evaluations' });
    }

    res.json({
      success: true,
      count: data?.length || 0,
      evaluations: data || [],
    });
  } catch (error) {
    console.error('Error in getUserEvaluations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

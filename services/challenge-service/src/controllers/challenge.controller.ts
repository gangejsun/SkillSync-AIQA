import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

/**
 * Get all challenges with optional filtering
 */
export const getChallenges = async (req: Request, res: Response) => {
  try {
    const { difficulty, category, tags } = req.query;

    let query = supabase
      .from('challenges')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (tags && typeof tags === 'string') {
      const tagArray = tags.split(',');
      query = query.contains('tags', tagArray);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching challenges:', error);
      return res.status(500).json({ error: 'Failed to fetch challenges' });
    }

    res.json({
      success: true,
      count: data?.length || 0,
      challenges: data || [],
    });
  } catch (error) {
    console.error('Error in getChallenges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get a single challenge by ID
 */
export const getChallengeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      console.error('Error fetching challenge:', error);
      return res.status(500).json({ error: 'Failed to fetch challenge' });
    }

    res.json({
      success: true,
      challenge: data,
    });
  } catch (error) {
    console.error('Error in getChallengeById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Submit a challenge solution
 */
export const submitChallenge = async (req: Request, res: Response) => {
  try {
    const { challenge_id, github_url, user_id } = req.body;

    // Validation
    if (!challenge_id || !github_url || !user_id) {
      return res.status(400).json({
        error: 'Missing required fields: challenge_id, github_url, user_id',
      });
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/.+\/.+/;
    if (!githubUrlPattern.test(github_url)) {
      return res.status(400).json({
        error: 'Invalid GitHub URL format',
      });
    }

    // Check if challenge exists
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('id')
      .eq('id', challenge_id)
      .single();

    if (challengeError || !challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        challenge_id,
        user_id,
        github_url,
        status: 'pending',
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error creating submission:', submissionError);
      return res.status(500).json({ error: 'Failed to create submission' });
    }

    // TODO: Trigger evaluation service
    // This would be done via a queue or direct API call to evaluation service

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      submission,
    });
  } catch (error) {
    console.error('Error in submitChallenge:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get user's submissions for a challenge
 */
export const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const { challenge_id, user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    let query = supabase
      .from('submissions')
      .select('*, evaluations(*)')
      .eq('user_id', user_id)
      .order('submitted_at', { ascending: false });

    if (challenge_id) {
      query = query.eq('challenge_id', challenge_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
      return res.status(500).json({ error: 'Failed to fetch submissions' });
    }

    res.json({
      success: true,
      count: data?.length || 0,
      submissions: data || [],
    });
  } catch (error) {
    console.error('Error in getUserSubmissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get challenge statistics
 */
export const getChallengeStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get total submissions
    const { count: totalSubmissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', id);

    if (submissionsError) {
      console.error('Error fetching submission count:', submissionsError);
    }

    // Get completed evaluations
    const { count: completedEvaluations, error: evaluationsError } = await supabase
      .from('evaluations')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', id);

    if (evaluationsError) {
      console.error('Error fetching evaluation count:', evaluationsError);
    }

    // Get average score
    const { data: avgData, error: avgError } = await supabase
      .from('evaluations')
      .select('overall_score')
      .eq('challenge_id', id);

    let averageScore = 0;
    if (!avgError && avgData && avgData.length > 0) {
      const sum = avgData.reduce((acc, curr) => acc + (curr.overall_score || 0), 0);
      averageScore = Math.round(sum / avgData.length);
    }

    res.json({
      success: true,
      stats: {
        total_submissions: totalSubmissions || 0,
        completed_evaluations: completedEvaluations || 0,
        average_score: averageScore,
      },
    });
  } catch (error) {
    console.error('Error in getChallengeStats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

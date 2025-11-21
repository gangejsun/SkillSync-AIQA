/**
 * Detailed Evaluation Routes
 *
 * Routes for AI-powered detailed evaluations with prompt quality scoring
 */

import { Router } from 'express';
import {
  enqueueDetailedEvaluation,
  getDetailedFeedback,
  getUserDetailedFeedback,
  getAPIUsageStats,
} from '../controllers/detailed-evaluation.controller';

const router = Router();

// Evaluation endpoints
router.post('/enqueue', enqueueDetailedEvaluation);
router.get('/submission/:submission_id', getDetailedFeedback);
router.get('/user/:user_id', getUserDetailedFeedback);

// API usage tracking
router.get('/api-usage/:user_id', getAPIUsageStats);

export default router;

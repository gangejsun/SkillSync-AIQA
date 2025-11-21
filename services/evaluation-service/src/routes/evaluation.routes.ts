import { Router } from 'express';
import {
  enqueueEvaluation,
  getEvaluation,
  getEvaluationBySubmission,
  getUserEvaluations,
} from '../controllers/evaluation.controller';

const router = Router();

// Evaluation routes
router.post('/evaluate/enqueue', enqueueEvaluation);
router.get('/evaluate/:id', getEvaluation);
router.get('/evaluate/submission/:submission_id', getEvaluationBySubmission);
router.get('/evaluations', getUserEvaluations);

export default router;

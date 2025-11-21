/**
 * Company Assessment Routes
 *
 * Routes for company-created custom assessments
 */

import { Router } from 'express';
import {
  createAssessment,
  getCompanyAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAssessmentApplications,
  reviewApplication,
  getCompanyStats,
} from '../controllers/company.controller';

const router = Router();

// Assessment CRUD
router.post('/assessments', createAssessment);
router.get('/assessments', getCompanyAssessments);
router.get('/assessments/:id', getAssessmentById);
router.put('/assessments/:id', updateAssessment);
router.delete('/assessments/:id', deleteAssessment);

// Applications management
router.get('/assessments/:id/applications', getAssessmentApplications);
router.post('/assessments/:id/applications/:applicationId/review', reviewApplication);

// Statistics
router.get('/stats', getCompanyStats);

export default router;

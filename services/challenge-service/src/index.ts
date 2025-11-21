import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import challengeRoutes from './routes/challenge.routes';
import companyRoutes from './routes/company.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    service: 'challenge-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Challenge Service',
    description: 'Manage coding challenges and submissions',
    port: PORT,
    endpoints: [
      'GET /health - Health check',
      'GET /api/challenges - List challenges',
      'GET /api/challenges/:id - Challenge details',
      'GET /api/challenges/:id/stats - Challenge statistics',
      'POST /api/challenges/submit - Submit solution',
      'GET /api/submissions - Get user submissions',
      'POST /api/company/assessments - Create custom assessment',
      'GET /api/company/assessments - Get company assessments',
      'GET /api/company/assessments/:id - Get assessment details',
      'PUT /api/company/assessments/:id - Update assessment',
      'DELETE /api/company/assessments/:id - Delete assessment',
      'GET /api/company/assessments/:id/applications - Get applications',
      'POST /api/company/assessments/:id/applications/:applicationId/review - Review application',
      'GET /api/company/stats - Get company statistics'
    ]
  });
});

// API Routes
app.use('/api', challengeRoutes);
app.use('/api/company', companyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Challenge Service running on port ${PORT}`);
});

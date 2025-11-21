import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import evaluationRoutes from './routes/evaluation.routes';
import detailedEvaluationRoutes from './routes/detailed-evaluation.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    service: 'evaluation-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Evaluation Service',
    description: 'AI-powered evaluation of submissions',
    port: PORT,
    endpoints: [
      'GET /health - Health check',
      'POST /api/evaluate/enqueue - Add to evaluation queue',
      'GET /api/evaluate/:id - Get evaluation results',
      'GET /api/evaluate/submission/:submission_id - Get evaluation by submission',
      'GET /api/evaluations - Get user evaluations',
      'POST /api/evaluate/detailed/enqueue - Detailed evaluation with Gemini',
      'GET /api/evaluate/detailed/submission/:submission_id - Get detailed feedback',
      'GET /api/evaluate/detailed/user/:user_id - Get user detailed feedback',
      'GET /api/evaluate/detailed/api-usage/:user_id - Get API usage stats'
    ]
  });
});

// API Routes
app.use('/api', evaluationRoutes);
app.use('/api/evaluate/detailed', detailedEvaluationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Evaluation Service running on port ${PORT}`);
});

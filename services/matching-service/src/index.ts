import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    service: 'matching-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Matching Service',
    description: 'Match candidates with job opportunities',
    port: PORT,
    endpoints: [
      'GET /health - Health check',
      'GET /api/jobs - List job postings',
      'GET /api/jobs/recommendations - Get recommendations',
      'POST /api/jobs/:id/apply - Apply to job'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Matching Service running on port ${PORT}`);
});

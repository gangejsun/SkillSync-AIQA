import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    service: 'report-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Report Service',
    description: 'Generate analytics and reports',
    port: PORT,
    endpoints: [
      'GET /health - Health check',
      'GET /api/reports/team/:teamId - Team analytics',
      'GET /api/reports/export - Export data'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Report Service running on port ${PORT}`);
});

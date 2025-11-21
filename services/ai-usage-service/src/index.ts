import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    service: 'ai-usage-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'AI Usage Service',
    description: 'Track and analyze AI tool usage',
    port: PORT,
    endpoints: [
      'GET /health - Health check',
      'POST /api/ai-usage/connect - Connect AI tool',
      'GET /api/ai-usage/dashboard - Get usage dashboard',
      'POST /api/ai-usage/sync - Sync usage data'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Usage Service running on port ${PORT}`);
});

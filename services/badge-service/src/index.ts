import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    service: 'badge-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Badge Service',
    description: 'Generate and manage skill badges',
    port: PORT,
    endpoints: [
      'GET /health - Health check',
      'POST /api/badges/generate - Generate badge',
      'GET /api/badges/:userId - Get user badges'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Badge Service running on port ${PORT}`);
});

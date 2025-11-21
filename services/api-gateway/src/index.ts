import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs
const SERVICES = {
  AI_USAGE: process.env.AI_USAGE_SERVICE_URL || 'http://localhost:3001',
  CHALLENGE: process.env.CHALLENGE_SERVICE_URL || 'http://localhost:3002',
  EVALUATION: process.env.EVALUATION_SERVICE_URL || 'http://localhost:3003',
  BADGE: process.env.BADGE_SERVICE_URL || 'http://localhost:3004',
  MATCHING: process.env.MATCHING_SERVICE_URL || 'http://localhost:3005',
  REPORT: process.env.REPORT_SERVICE_URL || 'http://localhost:3006',
};

// Health check for API Gateway
app.get('/health', async (req: Request, res: Response) => {
  const serviceHealthChecks = await Promise.allSettled([
    axios.get(`${SERVICES.AI_USAGE}/health`),
    axios.get(`${SERVICES.CHALLENGE}/health`),
    axios.get(`${SERVICES.EVALUATION}/health`),
    axios.get(`${SERVICES.BADGE}/health`),
    axios.get(`${SERVICES.MATCHING}/health`),
    axios.get(`${SERVICES.REPORT}/health`),
  ]);

  const servicesStatus = {
    'ai-usage-service': serviceHealthChecks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
    'challenge-service': serviceHealthChecks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
    'evaluation-service': serviceHealthChecks[2].status === 'fulfilled' ? 'healthy' : 'unhealthy',
    'badge-service': serviceHealthChecks[3].status === 'fulfilled' ? 'healthy' : 'unhealthy',
    'matching-service': serviceHealthChecks[4].status === 'fulfilled' ? 'healthy' : 'unhealthy',
    'report-service': serviceHealthChecks[5].status === 'fulfilled' ? 'healthy' : 'unhealthy',
  };

  const allHealthy = Object.values(servicesStatus).every(status => status === 'healthy');

  res.status(allHealthy ? 200 : 503).json({
    gateway: 'API Gateway',
    status: allHealthy ? 'healthy' : 'degraded',
    port: PORT,
    services: servicesStatus,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'SkillSync API Gateway',
    version: '1.0.0',
    port: PORT,
    routes: {
      '/api/ai-usage/*': 'AI Usage Service (3001)',
      '/api/challenges/*': 'Challenge Service (3002)',
      '/api/evaluate/*': 'Evaluation Service (3003)',
      '/api/badges/*': 'Badge Service (3004)',
      '/api/jobs/*': 'Matching Service (3005)',
      '/api/reports/*': 'Report Service (3006)',
    },
    health: '/health - Check all services'
  });
});

// Proxy routes to microservices
app.use(
  '/api/ai-usage',
  createProxyMiddleware({
    target: SERVICES.AI_USAGE,
    changeOrigin: true,
    pathRewrite: {
      '^/api/ai-usage': '/api/ai-usage',
    },
  })
);

app.use(
  '/api/challenges',
  createProxyMiddleware({
    target: SERVICES.CHALLENGE,
    changeOrigin: true,
    pathRewrite: {
      '^/api/challenges': '/api/challenges',
    },
  })
);

app.use(
  '/api/evaluate',
  createProxyMiddleware({
    target: SERVICES.EVALUATION,
    changeOrigin: true,
    pathRewrite: {
      '^/api/evaluate': '/api/evaluate',
    },
  })
);

app.use(
  '/api/badges',
  createProxyMiddleware({
    target: SERVICES.BADGE,
    changeOrigin: true,
    pathRewrite: {
      '^/api/badges': '/api/badges',
    },
  })
);

app.use(
  '/api/jobs',
  createProxyMiddleware({
    target: SERVICES.MATCHING,
    changeOrigin: true,
    pathRewrite: {
      '^/api/jobs': '/api/jobs',
    },
  })
);

app.use(
  '/api/reports',
  createProxyMiddleware({
    target: SERVICES.REPORT,
    changeOrigin: true,
    pathRewrite: {
      '^/api/reports': '/api/reports',
    },
  })
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Routing requests to ${Object.keys(SERVICES).length} microservices`);
});

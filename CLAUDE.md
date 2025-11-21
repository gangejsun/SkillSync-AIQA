# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkillSync is an AI skills assessment platform with a microservices architecture connecting frontend (Next.js 14) to 6 backend services through an API Gateway. The platform helps users track AI tool usage, take coding challenges, earn badges, and get matched with job opportunities based on AI proficiency.

## Architecture

**Microservices Architecture (Port Assignments)**
- Frontend: Next.js 14 (Port 3000)
- API Gateway: Express (Port 4000)
- AI Usage Service: Express/TypeScript (Port 3001)
- Challenge Service: Express/TypeScript (Port 3002)
- Evaluation Service: Express/TypeScript (Port 3003)
- Badge Service: Express/TypeScript (Port 3004)
- Matching Service: Express/TypeScript (Port 3005)
- Report Service: Express/TypeScript (Port 3006)

## Common Development Commands

### Frontend
```bash
# Development
cd frontend && npm run dev

# Build and lint
cd frontend && npm run build
cd frontend && npm run lint

# Production
cd frontend && npm run start
```

### Backend Services (All services follow same pattern)
```bash
# Development (example: AI Usage Service)
cd services/ai-usage-service && npm run dev

# Build
cd services/ai-usage-service && npm run build

# Start production
cd services/ai-usage-service && npm run start

# API Gateway
cd services/api-gateway && npm run dev
```

### Start All Services
```bash
# Manual approach - run in separate terminals:
# Terminal 1: cd frontend && npm run dev
# Terminal 2: cd services/api-gateway && npm run dev
# Terminal 3-8: cd services/[service-name] && npm run dev
```

## Tech Stack

### Frontend
- Framework: Next.js 14 (App Router)
- UI Components: Shadcn UI + Radix UI
- Styling: Tailwind CSS
- State Management: Zustand
- Charts: Recharts
- HTTP Client: Axios
- Authentication: Supabase Auth

### Backend
- Runtime: Node.js 18+
- Framework: Express with TypeScript
- Database: Supabase (PostgreSQL)
- File Storage: AWS S3 (planned)

### External APIs (Future Integration)
- Anthropic Claude API (evaluation)
- GitHub API (Copilot metrics)
- LinkedIn API (badge sharing)

## Service Responsibilities

**AI Usage Service (3001)**: Tracks AI tool usage, syncs metrics, generates dashboards
**Challenge Service (3002)**: Manages coding challenges, handles submissions
**Evaluation Service (3003)**: AI-powered code review and scoring using Claude API
**Badge Service (3004)**: Generates badges, certificates, and share images
**Matching Service (3005)**: Job matching algorithm and recommendations
**Report Service (3006)**: Team analytics and report generation
**API Gateway (4000)**: Request routing and health checks

## Project Structure

```
AIQA/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities & API clients
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # Global styles
│   └── package.json
├── services/              # Backend microservices
│   ├── [service-name]/    # Each service has same structure:
│   │   ├── src/          # TypeScript source
│   │   ├── dist/         # Compiled JavaScript
│   │   └── package.json
│   └── api-gateway/
├── skills/                # Skills and utilities
└── dev/active/           # Development documentation
```

## Development Guidelines

1. **TypeScript**: All services use TypeScript with strict mode
2. **Port Management**: Each service has a fixed port (3001-3006, 4000 for gateway)
3. **API Pattern**: RESTful APIs with `/api/[service-name]/` prefix
4. **Environment Variables**: Copy `.env.example` to `.env` or `.env.local` before starting
5. **Database**: Supabase for all data persistence needs
6. **Authentication**: Supabase Auth handles all authentication

## Current Development Status

**Sprint 1: Foundation (Current)**
- Next.js project setup complete
- 6 microservices structure created
- API Gateway configured
- Pending: Supabase schema deployment, mock data creation

## Key API Endpoints

### AI Usage Service
- `POST /api/ai-usage/connect` - Connect AI tool
- `GET /api/ai-usage/dashboard` - Get dashboard data
- `POST /api/ai-usage/sync` - Sync usage data

### Challenge Service
- `GET /api/challenges` - List challenges
- `GET /api/challenges/:id` - Challenge details
- `POST /api/challenges/submit` - Submit solution

### Evaluation Service
- `POST /api/evaluate/enqueue` - Add to evaluation queue
- `GET /api/evaluate/:id` - Get evaluation results

### Badge Service
- `POST /api/badges/generate` - Generate badge
- `GET /api/badges/:userId` - Get user badges

### Matching Service
- `GET /api/jobs` - List jobs
- `GET /api/jobs/recommendations` - Get recommendations
- `POST /api/jobs/:id/apply` - Apply to job

### Report Service
- `GET /api/reports/team/:teamId` - Team analytics
- `GET /api/reports/export` - Export data

## Design System

- Primary Color: Indigo (#6366F1, #4F46E5)
- Secondary Color: Purple (#8B5CF6)
- Accent Color: Green (#10B981)
- Font: Pretendard (Korean + Latin)
- Code Font: Fira Code
# Getting Started with SkillSync

This guide will help you set up and run the SkillSync platform locally.

## ✅ What's Been Set Up

The following infrastructure is ready:

### Frontend (Next.js 14)
- ✅ Project structure created
- ✅ Tailwind CSS configured with custom design system
- ✅ TypeScript configured (strict mode)
- ✅ App Router with route groups: (auth), (dashboard), (public)
- ✅ Component directories: ui, charts, cards, layouts
- ✅ Utility libraries: API clients, mock data loaders

### Backend (6 Microservices + API Gateway)
- ✅ AI Usage Service (Port 3001) - Track AI tool usage
- ✅ Challenge Service (Port 3002) - Manage challenges
- ✅ Evaluation Service (Port 3003) - AI-powered grading
- ✅ Badge Service (Port 3004) - Generate badges
- ✅ Matching Service (Port 3005) - Job matching
- ✅ Report Service (Port 3006) - Analytics
- ✅ API Gateway (Port 4000) - Request routing

Each service has:
- Express server setup
- TypeScript configuration
- Health check endpoint
- Environment variable templates

### Documentation
- ✅ Sprint 1 dev docs (plan, context, tasks)
- ✅ AI Usage Service dev docs (example)
- ✅ Root README with architecture overview
- ✅ Frontend README with setup instructions

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**API Gateway:**
```bash
cd services/api-gateway
npm install
```

**Each Microservice:** (repeat 6 times)
```bash
cd services/ai-usage-service && npm install
cd services/challenge-service && npm install
cd services/evaluation-service && npm install
cd services/badge-service && npm install
cd services/matching-service && npm install
cd services/report-service && npm install
```

### Step 2: Start Services

Open **8 separate terminal windows** (or use tmux/screen):

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - API Gateway:**
```bash
cd services/api-gateway
npm run dev
# Runs on http://localhost:4000
```

**Terminal 3 - AI Usage Service:**
```bash
cd services/ai-usage-service
npm run dev
# Runs on http://localhost:3001
```

**Terminal 4 - Challenge Service:**
```bash
cd services/challenge-service
npm run dev
# Runs on http://localhost:3002
```

**Terminal 5 - Evaluation Service:**
```bash
cd services/evaluation-service
npm run dev
# Runs on http://localhost:3003
```

**Terminal 6 - Badge Service:**
```bash
cd services/badge-service
npm run dev
# Runs on http://localhost:3004
```

**Terminal 7 - Matching Service:**
```bash
cd services/matching-service
npm run dev
# Runs on http://localhost:3005
```

**Terminal 8 - Report Service:**
```bash
cd services/report-service
npm run dev
# Runs on http://localhost:3006
```

### Step 3: Verify Everything is Running

**Check Frontend:**
```bash
curl http://localhost:3000
# Should see: "SkillSync"
```

**Check API Gateway:**
```bash
curl http://localhost:4000/health
# Should see: JSON with all service statuses
```

**Check Individual Services:**
```bash
curl http://localhost:3001/health  # AI Usage
curl http://localhost:3002/health  # Challenge
curl http://localhost:3003/health  # Evaluation
curl http://localhost:3004/health  # Badge
curl http://localhost:3005/health  # Matching
curl http://localhost:3006/health  # Report
```

If all return healthy status - **you're ready to develop!** 🎉

## 📋 Next Steps (Sprint 1 Remaining Tasks)

### 1. Create Mock Data Files
Create mock data files for each service:

**Priority:**
- [ ] `services/ai-usage-service/src/mock/ai_usage_data.txt`
- [ ] `services/challenge-service/src/mock/challenges_data.txt`
- [ ] `services/evaluation-service/src/mock/evaluation_results.txt`

**Reference:** See PRD sections for exact mock data format

### 2. Set Up Supabase
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Run database schema from [ai-skill-service-plan-prd.md](./ai-skill-service-plan-prd.md) section "데이터 모델"
- [ ] Get connection strings
- [ ] Update `.env` files with Supabase credentials

### 3. Complete Dev Docs
Create remaining dev docs for services:
- [ ] Challenge Service (plan.md, context.md, tasks.md)
- [ ] Evaluation Service (plan.md, context.md, tasks.md)
- [ ] Badge Service (plan.md, context.md, tasks.md)
- [ ] Matching Service (plan.md, context.md, tasks.md)
- [ ] Report Service (plan.md, context.md, tasks.md)

**Follow pattern:** See `dev/active/ai-usage-service/` as example

### 4. Implement Basic API Endpoints
For each service, implement:
- [ ] GET endpoint to return mock data
- [ ] Mock data loading logic
- [ ] Basic routes and controllers

### 5. Test End-to-End
- [ ] Frontend calls API Gateway
- [ ] API Gateway routes to services
- [ ] Services return mock data
- [ ] Data displays in frontend

## 🛠 Development Scripts (To Be Created)

**Recommended:** Create a script to start all services at once:

**`package.json` (root):**
```json
{
  "scripts": {
    "dev:all": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix services/api-gateway\" \"npm run dev --prefix services/ai-usage-service\" \"npm run dev --prefix services/challenge-service\" \"npm run dev --prefix services/evaluation-service\" \"npm run dev --prefix services/badge-service\" \"npm run dev --prefix services/matching-service\" \"npm run dev --prefix services/report-service\"",
    "install:all": "npm install --prefix frontend && npm install --prefix services/api-gateway && ..."
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Then simply run:
```bash
npm run dev:all
```

## 📝 Environment Variables

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000
```

**All Services (`.env`):**
```env
PORT=300X  # Specific to each service
NODE_ENV=development
USE_MOCK_DATA=true
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
```

**Copy from examples:**
```bash
cp frontend/.env.example frontend/.env.local
cp services/api-gateway/.env.example services/api-gateway/.env
# Repeat for all services
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # or 3001, 3002, etc.

# Kill process
kill -9 <PID>
```

### TypeScript Errors
```bash
# Clean TypeScript cache
cd service-name
rm -rf dist
npm run build
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure API Gateway has CORS enabled
- Check `services/api-gateway/src/index.ts` has `app.use(cors())`

## 📚 Additional Resources

- **PRD:** [ai-skill-service-plan-prd.md](./ai-skill-service-plan-prd.md)
- **Dev Docs:** [dev/active/sprint-1-foundation/](./dev/active/sprint-1-foundation/)
- **AI Usage Service Example:** [dev/active/ai-usage-service/](./dev/active/ai-usage-service/)

## 🎯 Current Sprint Status

**Sprint 1: Foundation**
- ✅ Project structure (100%)
- ✅ Frontend setup (100%)
- ✅ Backend services setup (100%)
- ⏳ Mock data creation (0%)
- ⏳ Supabase setup (0%)
- ⏳ Dev docs completion (16% - 1/6 services)

**Next Sprint:** Sprint 2 - AI Usage Dashboard UI

## 💡 Tips

1. **Use nodemon:** All services use nodemon for hot reloading
2. **Check health endpoints:** Always verify services are healthy before frontend work
3. **Mock data first:** Sprint 1 focuses on mock data, not real APIs
4. **Follow Dev Docs Pattern:** Update context.md frequently!
5. **TypeScript strict mode:** Fix all TypeScript errors before moving forward

---

**Need Help?** Check the Sprint 1 dev docs or AI Usage Service example for detailed implementation guidance.

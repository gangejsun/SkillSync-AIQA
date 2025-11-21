# SkillSync Frontend

Next.js 14 frontend application for SkillSync platform.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React
- **Auth:** Supabase Auth

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:4000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                        # Next.js 14 App Router
│   ├── (auth)/                # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/           # Protected dashboard pages
│   │   ├── ai-usage/          # AI Usage Analytics
│   │   ├── challenges/        # Challenge System
│   │   ├── profile/           # User Profile
│   │   └── jobs/              # Job Matching
│   └── (public)/              # Public pages
├── components/                # React components
│   ├── ui/                    # Shadcn UI components
│   ├── charts/                # Chart components
│   ├── cards/                 # Skill cards, badges
│   └── layouts/               # Layout components
├── lib/                       # Utilities & helpers
│   ├── api/                   # API client functions
│   ├── mock/                  # Mock data loaders
│   └── utils/                 # Helper functions
├── hooks/                     # Custom React hooks
└── styles/                    # Global styles
    └── globals.css            # Tailwind + custom CSS
```

## Design System

### Colors

```css
/* Primary - Indigo */
--primary-500: #6366F1;
--primary-600: #4F46E5;

/* Secondary - Purple */
--secondary-500: #8B5CF6;

/* Accent - Green */
--accent-500: #10B981;

/* Grays */
--gray-50: #F9FAFB;
--gray-900: #111827;
```

### Typography

- Font Family: Pretendard (Korean + Latin)
- Code Font: Fira Code
- Scale: 12px (xs) to 36px (4xl)

### Component Patterns

**Buttons:**
```tsx
// Primary
className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg"

// Secondary
className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border"
```

**Cards:**
```tsx
// Standard
className="bg-white rounded-2xl p-6 shadow-sm border"

// Gradient (for completed skills)
className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6"
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Adding Shadcn UI Components

To add new Shadcn components:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

## API Integration

API client functions are located in `lib/api/`:

```typescript
// Example: AI Usage API
import { fetchUsageDashboard } from '@/lib/api/ai-usage'

const data = await fetchUsageDashboard()
```

All API calls go through the API Gateway at `http://localhost:4000`.

## Development Mode

Currently using **mock data** for all features. Toggle with:

```env
USE_MOCK_DATA=true
```

Real API integration will be added in Sprint 2+.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Supabase](https://supabase.com/docs)

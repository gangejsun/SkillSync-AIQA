# Feature 5: AIQ Personality Assessment - Implementation Plan

## ⚠️ CRITICAL FEATURE - 0% IMPLEMENTED

This is a **core PRD feature that is completely missing** from the codebase. The challenge pages are NOT the AIQ personality assessment.

**PRD Reference:** Section "Feature 5: AIQ Personality Assessment" (Lines 1709-1866)

---

## Feature Overview

AIQ Personality Assessment is a 20-question survey that evaluates a user's AI collaboration style across 8 capability dimensions:

1. **U** - Usage & Productivity
2. **P** - Performance & Quality
3. **C** - AI Contribution
4. **R** - Prompting & Communication (Retrieval)
5. **E** - Ethical & Responsible
6. **S** - Strategic & Creative
7. **Co** - Collaboration & Adaptability
8. **F** - AI Fundamentals

Based on the results, users receive:
- **Capability scores** (0-100) for each dimension
- **AIQ Type** (e.g., "Speed Executor", "Precision Analyst", "Creative Innovator")
- **Radar chart** visualization
- **Confidence level**
- **PDF report**

---

## What Exists

**Nothing. Feature is 0% implemented.**

---

## What Needs to Be Built

### Database Schema
1. Create `aiq_assessments` table (missing from schema)
2. Store answers, scores, type, confidence

### Frontend Pages
1. `/app/(dashboard)/aiq-assessment/page.tsx` - Survey UI
2. `/app/(dashboard)/aiq-assessment/results/page.tsx` - Results page

### Backend Service
1. API endpoints for submitting answers
2. Calculation algorithm
3. Type determination logic
4. PDF report generation

---

## Implementation Steps

### Step 1: Create Database Migration

**File:** `supabase/migrations/004_aiq_assessment.sql`

```sql
-- AIQ Assessments Table
CREATE TABLE aiq_assessments (
  aiq_assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Raw answers (1-4 for each of 20 questions)
  answers JSONB NOT NULL,

  -- 8 Capability Scores (0-100)
  usage_productivity_score INTEGER CHECK (usage_productivity_score BETWEEN 0 AND 100),
  performance_quality_score INTEGER CHECK (performance_quality_score BETWEEN 0 AND 100),
  ai_contribution_score INTEGER CHECK (ai_contribution_score BETWEEN 0 AND 100),
  prompting_communication_score INTEGER CHECK (prompting_communication_score BETWEEN 0 AND 100),
  ethical_responsible_score INTEGER CHECK (ethical_responsible_score BETWEEN 0 AND 100),
  strategic_creative_score INTEGER CHECK (strategic_creative_score BETWEEN 0 AND 100),
  collaboration_adaptability_score INTEGER CHECK (collaboration_adaptability_score BETWEEN 0 AND 100),
  ai_fundamentals_score INTEGER CHECK (ai_fundamentals_score BETWEEN 0 AND 100),

  -- AIQ Type
  aiq_type VARCHAR(50),  -- 'speed_executor', 'precision_analyst', etc

  -- Metadata
  confidence_level FLOAT CHECK (confidence_level BETWEEN 0 AND 1),
  completed_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_user_assessment_date UNIQUE (user_id, DATE(completed_at))
);

-- Index for user lookups
CREATE INDEX idx_aiq_assessments_user ON aiq_assessments(user_id);

-- RLS Policies
ALTER TABLE aiq_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON aiq_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments"
  ON aiq_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Step 2: Define Questions

**File:** `frontend/src/lib/aiqQuestions.ts`

```typescript
export interface AIQQuestion {
  id: number;
  dimension: string;  // Display name
  question: string;
  affects: ('U' | 'P' | 'C' | 'R' | 'E' | 'S' | 'Co' | 'F')[];
  weight: number;
  isReversed?: boolean;  // For questions where "disagree" = higher score
}

export const AIQ_QUESTIONS: AIQQuestion[] = [
  // Usage & Productivity (U)
  {
    id: 1,
    dimension: '속도 vs 완성도',
    question: '나는 AI를 사용할 때, 작업을 빨리 진행하는 것이 중요하다고 느끼는 편이다.',
    affects: ['U'],
    weight: 1.0
  },
  {
    id: 2,
    dimension: '속도 vs 완성도',
    question: '나는 AI를 사용할 때, 결과물의 완성도와 디테일을 충분히 맞추는 것이 중요하다고 느끼는 편이다.',
    affects: ['P'],
    weight: 1.0
  },

  // Performance & Quality (P)
  {
    id: 3,
    dimension: '정확성',
    question: '나는 AI가 생성한 코드를 그대로 사용하기보다, 꼼꼼히 검토하고 수정하는 편이다.',
    affects: ['P', 'E'],
    weight: 1.0
  },
  {
    id: 4,
    dimension: '테스트',
    question: '나는 AI가 생성한 코드에 대해 테스트 코드를 작성하거나, 직접 테스트를 수행한다.',
    affects: ['P', 'F'],
    weight: 1.0
  },

  // AI Contribution (C)
  {
    id: 5,
    dimension: 'AI 의존도',
    question: '나는 대부분의 코드를 AI가 생성하도록 하고, 나는 전체적인 구조만 설계한다.',
    affects: ['C'],
    weight: 1.0
  },
  {
    id: 6,
    dimension: 'AI 활용',
    question: '나는 복잡한 문제를 작은 단위로 나누어 AI에게 요청한다.',
    affects: ['S', 'R'],
    weight: 1.0
  },

  // Prompting & Communication (R)
  {
    id: 7,
    dimension: '프롬프팅',
    question: '나는 AI에게 명확하고 구체적인 지시를 제공하기 위해 시간을 들인다.',
    affects: ['R'],
    weight: 1.0
  },
  {
    id: 8,
    dimension: '반복 개선',
    question: '나는 AI의 첫 응답이 만족스럽지 않으면, 프롬프트를 수정해서 다시 요청한다.',
    affects: ['R', 'P'],
    weight: 1.0
  },

  // Ethical & Responsible (E)
  {
    id: 9,
    dimension: '윤리',
    question: '나는 AI가 생성한 코드가 보안 문제나 저작권 문제가 없는지 확인한다.',
    affects: ['E'],
    weight: 1.0
  },
  {
    id: 10,
    dimension: '책임',
    question: '나는 AI가 생성한 결과물에 대해 최종적으로 내가 책임진다고 생각한다.',
    affects: ['E'],
    weight: 1.0
  },

  // Strategic & Creative (S)
  {
    id: 11,
    dimension: '전략적 사용',
    question: '나는 AI를 반복적인 작업(보일러플레이트, CRUD)에 주로 사용한다.',
    affects: ['S', 'U'],
    weight: 1.0
  },
  {
    id: 12,
    dimension: '창의성',
    question: '나는 AI를 활용해 새로운 아이디어나 솔루션을 탐색한다.',
    affects: ['S'],
    weight: 1.0
  },

  // Collaboration & Adaptability (Co)
  {
    id: 13,
    dimension: '협업',
    question: '나는 팀원들과 AI 활용 노하우를 공유한다.',
    affects: ['Co'],
    weight: 1.0
  },
  {
    id: 14,
    dimension: '적응',
    question: '나는 새로운 AI 도구가 나오면 적극적으로 시도해본다.',
    affects: ['Co', 'F'],
    weight: 1.0
  },

  // AI Fundamentals (F)
  {
    id: 15,
    dimension: '기초 지식',
    question: '나는 AI의 작동 원리(LLM, 토큰, 컨텍스트 등)를 이해하고 있다.',
    affects: ['F'],
    weight: 1.0
  },
  {
    id: 16,
    dimension: '한계 인식',
    question: '나는 AI가 할 수 있는 것과 없는 것을 구분할 수 있다.',
    affects: ['F', 'E'],
    weight: 1.0
  },

  // Mixed dimensions
  {
    id: 17,
    dimension: '문제 해결',
    question: '나는 AI를 디버깅 도구로 활용해서 에러를 해결한다.',
    affects: ['U', 'R'],
    weight: 1.0
  },
  {
    id: 18,
    dimension: '학습',
    question: '나는 AI가 생성한 코드를 분석하면서 새로운 것을 배운다.',
    affects: ['F', 'P'],
    weight: 1.0
  },
  {
    id: 19,
    dimension: '효율성',
    question: '나는 AI 덕분에 이전보다 생산성이 2배 이상 향상되었다.',
    affects: ['U', 'C'],
    weight: 1.0
  },
  {
    id: 20,
    dimension: '미래',
    question: '나는 앞으로 AI 없이 코딩하는 것은 상상하기 어렵다.',
    affects: ['C', 'S'],
    weight: 1.0
  }
];

export const ANSWER_OPTIONS = [
  { value: 1, label: '① 전혀 그렇지 않음' },
  { value: 2, label: '② 그렇지 않음' },
  { value: 3, label: '③ 그러함' },
  { value: 4, label: '④ 매우 그러함' }
];
```

### Step 3: Implement Calculation Algorithm

**File:** `frontend/src/lib/aiqCalculation.ts`

```typescript
import { AIQ_QUESTIONS } from './aiqQuestions';

export interface AIQCapabilities {
  U: number;   // Usage & Productivity
  P: number;   // Performance & Quality
  C: number;   // AI Contribution
  R: number;   // Prompting & Communication
  E: number;   // Ethical & Responsible
  S: number;   // Strategic & Creative
  Co: number;  // Collaboration & Adaptability
  F: number;   // AI Fundamentals
}

export interface AIQResult {
  capabilities: AIQCapabilities;
  aiqType: string;
  confidenceLevel: number;
}

export function calculateCapabilities(answers: number[]): AIQCapabilities {
  const capabilities: AIQCapabilities = {
    U: 0,
    P: 0,
    C: 0,
    R: 0,
    E: 0,
    S: 0,
    Co: 0,
    F: 0
  };

  const counts: Record<string, number> = {
    U: 0, P: 0, C: 0, R: 0, E: 0, S: 0, Co: 0, F: 0
  };

  // Accumulate weighted scores
  AIQ_QUESTIONS.forEach((q, index) => {
    const answer = answers[index];
    const score = (answer / 4) * 100;  // Normalize to 0-100

    q.affects.forEach(capability => {
      capabilities[capability] += score * q.weight;
      counts[capability] += q.weight;
    });
  });

  // Average by count
  (Object.keys(capabilities) as (keyof AIQCapabilities)[]).forEach(key => {
    if (counts[key] > 0) {
      capabilities[key] = Math.round(capabilities[key] / counts[key]);
    }
  });

  return capabilities;
}

export function determineAIQType(capabilities: AIQCapabilities): string {
  const { U, P, C, S } = capabilities;

  // Type determination logic
  if (U > 75 && C > 70) {
    return 'speed_executor';  // 빠른 실행자
  } else if (P > 80 && E > 75) {
    return 'precision_analyst';  // 정밀 분석가
  } else if (S > 75 && C > 60) {
    return 'creative_innovator';  // 창의적 혁신가
  } else if (R > 80 && F > 70) {
    return 'master_prompter';  // 프롬프트 마스터
  } else if (P > 70 && E > 70) {
    return 'quality_guardian';  // 품질 수호자
  } else if (Co > 75 && U > 65) {
    return 'collaborative_builder';  // 협업형 빌더
  } else if (F > 80) {
    return 'ai_fundamentalist';  // AI 기본 전문가
  } else {
    return 'balanced_practitioner';  // 균형잡힌 실무자
  }
}

export function calculateConfidence(answers: number[]): number {
  // Measure consistency (lower variance = higher confidence)
  const mean = answers.reduce((sum, a) => sum + a, 0) / answers.length;
  const variance = answers.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / answers.length;
  const stdDev = Math.sqrt(variance);

  // Convert to confidence (0-1)
  // Low std dev = high confidence
  const maxStdDev = 1.5;  // Theoretical max for 1-4 scale
  const confidence = Math.max(0, Math.min(1, 1 - (stdDev / maxStdDev)));

  return Math.round(confidence * 100) / 100;  // Round to 2 decimals
}

export const AIQ_TYPE_NAMES = {
  speed_executor: {
    name: '빠른 실행자',
    description: 'AI를 활용해 빠르게 결과물을 만들어내는 스타일',
    emoji: '⚡'
  },
  precision_analyst: {
    name: '정밀 분석가',
    description: 'AI 출력을 꼼꼼히 검토하고 품질을 최우선시하는 스타일',
    emoji: '🔬'
  },
  creative_innovator: {
    name: '창의적 혁신가',
    description: 'AI를 활용해 새로운 아이디어와 솔루션을 탐색하는 스타일',
    emoji: '💡'
  },
  master_prompter: {
    name: '프롬프트 마스터',
    description: 'AI와의 소통에 능숙하고 효과적인 지시를 제공하는 스타일',
    emoji: '🎯'
  },
  quality_guardian: {
    name: '품질 수호자',
    description: '윤리와 품질 기준을 지키며 AI를 책임감 있게 사용하는 스타일',
    emoji: '🛡️'
  },
  collaborative_builder: {
    name: '협업형 빌더',
    description: '팀과 함께 AI 활용 노하우를 공유하고 발전시키는 스타일',
    emoji: '🤝'
  },
  ai_fundamentalist: {
    name: 'AI 기본 전문가',
    description: 'AI의 원리와 한계를 깊이 이해하고 활용하는 스타일',
    emoji: '🧠'
  },
  balanced_practitioner: {
    name: '균형잡힌 실무자',
    description: '다양한 측면에서 균형잡힌 AI 활용 능력을 가진 스타일',
    emoji: '⚖️'
  }
};
```

### Step 4: Create Survey Page

**File:** `frontend/src/app/(dashboard)/aiq-assessment/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AIQ_QUESTIONS, ANSWER_OPTIONS } from '@/lib/aiqQuestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

export default function AIQAssessmentPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(20).fill(0));

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < AIQ_QUESTIONS.length - 1) {
      // Move to next question
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    } else {
      // Submit assessment
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: number[]) => {
    try {
      const response = await fetch('/api/aiq/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers })
      });

      const result = await response.json();
      router.push(`/aiq-assessment/results/${result.assessment_id}`);
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  const question = AIQ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / AIQ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>AIQ Personality Assessment</CardTitle>
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} / {AIQ_QUESTIONS.length}
              </span>
            </div>
            <Progress value={progress} />
          </CardHeader>

          <CardContent>
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-2">{question.dimension}</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                {question.question}
              </h2>
            </div>

            <div className="space-y-3">
              {ANSWER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    answers[currentQuestion] === option.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300 bg-white'
                  }`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>

            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                정답은 없습니다. 평소 업무 습관을 솔직히 선택하세요.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              ⏱ Estimated: {Math.max(0, 15 - currentQuestion)} min remaining
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
```

### Step 5: Create Results Page

**File:** `frontend/src/app/(dashboard)/aiq-assessment/results/[id]/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

export default function AIQResultsPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const response = await fetch(`/api/aiq/${params.id}`);
    const data = await response.json();
    setResult(data);
  };

  if (!result) return <div>Loading...</div>;

  const radarData = [
    { capability: 'Usage', value: result.capabilities.U },
    { capability: 'Quality', value: result.capabilities.P },
    { capability: 'Contribution', value: result.capabilities.C },
    { capability: 'Prompting', value: result.capabilities.R },
    { capability: 'Ethical', value: result.capabilities.E },
    { capability: 'Strategic', value: result.capabilities.S },
    { capability: 'Collaboration', value: result.capabilities.Co },
    { capability: 'Fundamentals', value: result.capabilities.F }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">{result.aiqTypeEmoji}</div>
              <h1 className="text-3xl font-bold mb-2">{result.aiqTypeName}</h1>
              <p className="text-lg opacity-90">{result.aiqTypeDescription}</p>
              <div className="mt-4">
                <span className="text-sm opacity-75">Confidence Level: </span>
                <span className="font-semibold">{(result.confidenceLevel * 100).toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your AI Capability Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="capability" />
                <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Scores */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(result.capabilities).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{key}</span>
                    <span className="text-indigo-600 font-bold">{value}/100</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="mr-2 h-4 w-4" />
            Share on LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] All 20 questions display correctly
- [ ] Answer selection works
- [ ] Progress bar updates
- [ ] Previous button works
- [ ] Calculation algorithm is correct
- [ ] Radar chart displays properly
- [ ] AIQ type is determined correctly
- [ ] Confidence level makes sense
- [ ] PDF report generation works
- [ ] Results save to database

---

## Success Criteria

1. Users complete 20-question survey
2. Results calculate 8 capability scores
3. AIQ type is determined
4. Radar chart displays correctly
5. PDF report downloads
6. LinkedIn sharing works

---

## Estimated Timeline

- **Database Migration:** 0.5 days
- **Questions Definition:** 0.5 days
- **Calculation Logic:** 1 day
- **Survey UI:** 2 days
- **Results Page:** 2 days
- **PDF Generation:** 1 day
- **Testing:** 1 day

**Total:** 8 days (1.6 weeks)

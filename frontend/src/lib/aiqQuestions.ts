// AIQ Personality Assessment Questions
// Based on 8 capability dimensions: U, P, C, R, E, S, Co, F

export interface AIQQuestion {
  id: number;
  dimension: string; // Display category
  question: string; // The actual question
  affects: ('U' | 'P' | 'C' | 'R' | 'E' | 'S' | 'Co' | 'F')[]; // Which capabilities this affects
  weight: number; // Weight for calculation (1.0 = normal)
}

export const AIQ_QUESTIONS: AIQQuestion[] = [
  // Question 1: Usage & Productivity
  {
    id: 1,
    dimension: '속도 vs 완성도',
    question: '나는 AI를 사용할 때, 작업을 빨리 진행하는 것이 중요하다고 느끼는 편이다.',
    affects: ['U'],
    weight: 1.0
  },

  // Question 2: Performance & Quality
  {
    id: 2,
    dimension: '정확성',
    question: '나는 AI가 생성한 코드를 그대로 사용하기보다, 꼼꼼히 검토하고 수정하는 편이다.',
    affects: ['P', 'E'],
    weight: 1.0
  },

  // Question 3: AI Contribution
  {
    id: 3,
    dimension: 'AI 의존도',
    question: '나는 대부분의 코드를 AI가 생성하도록 하고, 나는 전체적인 구조만 설계한다.',
    affects: ['C'],
    weight: 1.0
  },

  // Question 4: Prompting & Communication
  {
    id: 4,
    dimension: '프롬프팅',
    question: '나는 AI에게 명확하고 구체적인 지시를 제공하기 위해 시간을 들인다.',
    affects: ['R'],
    weight: 1.0
  },

  // Question 5: Ethical & Responsible
  {
    id: 5,
    dimension: '윤리',
    question: '나는 AI가 생성한 코드가 보안 문제나 저작권 문제가 없는지 확인한다.',
    affects: ['E'],
    weight: 1.0
  },

  // Question 6: Strategic & Creative
  {
    id: 6,
    dimension: '전략적 사용',
    question: '나는 AI를 반복적인 작업(보일러플레이트, CRUD)에 주로 사용한다.',
    affects: ['S', 'U'],
    weight: 1.0
  },

  // Question 7: Collaboration & Adaptability
  {
    id: 7,
    dimension: '협업',
    question: '나는 팀원들과 AI 활용 노하우를 공유한다.',
    affects: ['Co'],
    weight: 1.0
  },

  // Question 8: AI Fundamentals
  {
    id: 8,
    dimension: '기초 지식',
    question: '나는 AI의 작동 원리(LLM, 토큰, 컨텍스트 등)를 이해하고 있다.',
    affects: ['F'],
    weight: 1.0
  },

  // Question 9: Mixed - Problem Solving
  {
    id: 9,
    dimension: '문제 해결',
    question: '나는 AI를 디버깅 도구로 활용해서 에러를 해결한다.',
    affects: ['U', 'R'],
    weight: 1.0
  },

  // Question 10: Mixed - Learning
  {
    id: 10,
    dimension: '학습',
    question: '나는 AI가 생성한 코드를 분석하면서 새로운 것을 배운다.',
    affects: ['F', 'P'],
    weight: 1.0
  }
];

export const ANSWER_OPTIONS = [
  { value: 1, label: '① 전혀 그렇지 않음' },
  { value: 2, label: '② 그렇지 않음' },
  { value: 3, label: '③ 그러함' },
  { value: 4, label: '④ 매우 그러함' }
] as const;

// Capability dimension descriptions
export const CAPABILITY_DESCRIPTIONS = {
  U: {
    name: 'Usage & Productivity',
    description: 'AI 도구를 얼마나 효율적으로 사용하는가',
    emoji: '⚡'
  },
  P: {
    name: 'Performance & Quality',
    description: '결과물의 품질과 정확성을 얼마나 중시하는가',
    emoji: '🎯'
  },
  C: {
    name: 'AI Contribution',
    description: 'AI가 작업에 기여하는 정도',
    emoji: '🤖'
  },
  R: {
    name: 'Prompting & Communication',
    description: 'AI와의 소통 능력',
    emoji: '💬'
  },
  E: {
    name: 'Ethical & Responsible',
    description: '윤리적이고 책임감 있는 AI 사용',
    emoji: '🛡️'
  },
  S: {
    name: 'Strategic & Creative',
    description: '전략적이고 창의적인 AI 활용',
    emoji: '💡'
  },
  Co: {
    name: 'Collaboration & Adaptability',
    description: '협업과 적응력',
    emoji: '🤝'
  },
  F: {
    name: 'AI Fundamentals',
    description: 'AI 기초 지식과 이해도',
    emoji: '🧠'
  }
} as const;

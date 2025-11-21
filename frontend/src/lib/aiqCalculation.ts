// AIQ Calculation Logic
// Calculates capability scores and determines AIQ personality type

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

export type AIQType =
  | 'speed_executor'
  | 'precision_analyst'
  | 'creative_innovator'
  | 'master_prompter'
  | 'quality_guardian'
  | 'collaborative_builder'
  | 'ai_fundamentalist'
  | 'balanced_practitioner';

export interface AIQResult {
  capabilities: AIQCapabilities;
  aiqType: AIQType;
  confidenceLevel: number;
  completedAt: string;
}

/**
 * Calculate capability scores from user answers
 * @param answers Array of 10 integers (1-4)
 * @returns AIQCapabilities with scores 0-100
 */
export function calculateCapabilities(answers: number[]): AIQCapabilities {
  // Initialize capabilities and counts
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

  const counts: Record<keyof AIQCapabilities, number> = {
    U: 0,
    P: 0,
    C: 0,
    R: 0,
    E: 0,
    S: 0,
    Co: 0,
    F: 0
  };

  // Accumulate weighted scores
  AIQ_QUESTIONS.forEach((question, index) => {
    const answer = answers[index];
    if (!answer || answer < 1 || answer > 4) return;

    // Normalize answer to 0-100 scale
    const score = ((answer - 1) / 3) * 100; // 1->0, 2->33, 3->67, 4->100

    question.affects.forEach(capability => {
      capabilities[capability] += score * question.weight;
      counts[capability] += question.weight;
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

/**
 * Determine AIQ personality type based on capability scores
 * @param capabilities Calculated capability scores
 * @returns AIQ type string
 */
export function determineAIQType(capabilities: AIQCapabilities): AIQType {
  const { U, P, C, R, E, S, Co, F } = capabilities;

  // Find dominant capabilities (top 2)
  const sorted = Object.entries(capabilities)
    .sort(([, a], [, b]) => b - a);

  const top1 = sorted[0][0];
  const top2 = sorted[1][0];
  const top1Score = sorted[0][1];
  const top2Score = sorted[1][1];

  // Type determination logic

  // Speed Executor: High U (Usage) + High C (Contribution)
  if (U > 70 && C > 65) {
    return 'speed_executor';
  }

  // Precision Analyst: High P (Performance) + High E (Ethical)
  if (P > 75 && E > 70) {
    return 'precision_analyst';
  }

  // Creative Innovator: High S (Strategic) + High C (Contribution)
  if (S > 70 && C > 60) {
    return 'creative_innovator';
  }

  // Master Prompter: High R (Prompting) + High F (Fundamentals)
  if (R > 75 && F > 65) {
    return 'master_prompter';
  }

  // Quality Guardian: High P + High E (both quality-focused)
  if (P > 70 && E > 70) {
    return 'quality_guardian';
  }

  // Collaborative Builder: High Co (Collaboration) + High U (Usage)
  if (Co > 70 && U > 60) {
    return 'collaborative_builder';
  }

  // AI Fundamentalist: High F (Fundamentals) is dominant
  if (F > 75) {
    return 'ai_fundamentalist';
  }

  // Balanced Practitioner: No clear dominant trait
  return 'balanced_practitioner';
}

/**
 * Calculate confidence level based on answer consistency
 * Lower variance = higher confidence
 * @param answers Array of user answers
 * @returns Confidence level 0-1
 */
export function calculateConfidence(answers: number[]): number {
  if (answers.length === 0) return 0;

  // Calculate mean
  const mean = answers.reduce((sum, a) => sum + a, 0) / answers.length;

  // Calculate variance
  const variance = answers.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / answers.length;
  const stdDev = Math.sqrt(variance);

  // Convert to confidence (0-1)
  // For a 1-4 scale, max std dev is ~1.5
  const maxStdDev = 1.5;
  const confidence = Math.max(0, Math.min(1, 1 - (stdDev / maxStdDev)));

  return Math.round(confidence * 100) / 100; // Round to 2 decimals
}

/**
 * Generate complete AIQ result
 * @param answers User answers
 * @returns Complete AIQ result object
 */
export function generateAIQResult(answers: number[]): AIQResult {
  const capabilities = calculateCapabilities(answers);
  const aiqType = determineAIQType(capabilities);
  const confidenceLevel = calculateConfidence(answers);

  return {
    capabilities,
    aiqType,
    confidenceLevel,
    completedAt: new Date().toISOString()
  };
}

/**
 * AIQ Type descriptions
 */
export const AIQ_TYPE_INFO: Record<AIQType, {
  name: string;
  nameKo: string;
  description: string;
  emoji: string;
  strengths: string[];
  recommendations: string[];
}> = {
  speed_executor: {
    name: 'Speed Executor',
    nameKo: '빠른 실행자',
    description: 'AI를 활용해 빠르게 결과물을 만들어내는 스타일',
    emoji: '⚡',
    strengths: [
      '빠른 프로토타이핑',
      '높은 생산성',
      'AI 도구를 자연스럽게 활용'
    ],
    recommendations: [
      '코드 리뷰 시간을 더 할애해보세요',
      '테스트 코드 작성 습관을 기르세요',
      '보안 취약점 체크를 추가하세요'
    ]
  },
  precision_analyst: {
    name: 'Precision Analyst',
    nameKo: '정밀 분석가',
    description: 'AI 출력을 꼼꼼히 검토하고 품질을 최우선시하는 스타일',
    emoji: '🔬',
    strengths: [
      '높은 코드 품질',
      '철저한 검증 프로세스',
      '안정적인 결과물'
    ],
    recommendations: [
      'AI 활용도를 높여 속도를 개선하세요',
      '완벽주의를 조금 내려놓아도 괜찮습니다',
      '반복 작업은 AI에 더 맡겨보세요'
    ]
  },
  creative_innovator: {
    name: 'Creative Innovator',
    nameKo: '창의적 혁신가',
    description: 'AI를 활용해 새로운 아이디어와 솔루션을 탐색하는 스타일',
    emoji: '💡',
    strengths: [
      '혁신적인 접근',
      '문제 해결 능력',
      '전략적 AI 활용'
    ],
    recommendations: [
      '아이디어를 실행으로 옮기는 속도를 높이세요',
      '기본기 강화에도 시간을 투자하세요',
      '팀과 아이디어를 더 공유하세요'
    ]
  },
  master_prompter: {
    name: 'Master Prompter',
    nameKo: '프롬프트 마스터',
    description: 'AI와의 소통에 능숙하고 효과적인 지시를 제공하는 스타일',
    emoji: '🎯',
    strengths: [
      '명확한 의사소통',
      '최적의 AI 응답 유도',
      '높은 AI 활용 효율'
    ],
    recommendations: [
      '다양한 AI 도구를 시도해보세요',
      '프롬프트 라이브러리를 구축하세요',
      '팀원들에게 노하우를 공유하세요'
    ]
  },
  quality_guardian: {
    name: 'Quality Guardian',
    nameKo: '품질 수호자',
    description: '윤리와 품질 기준을 지키며 AI를 책임감 있게 사용하는 스타일',
    emoji: '🛡️',
    strengths: [
      '보안 의식',
      '윤리적 판단력',
      '장기적 안정성'
    ],
    recommendations: [
      '자동화 도구를 활용해 효율을 높이세요',
      'AI를 더 신뢰하고 활용해보세요',
      '속도와 품질의 균형을 찾으세요'
    ]
  },
  collaborative_builder: {
    name: 'Collaborative Builder',
    nameKo: '협업형 빌더',
    description: '팀과 함께 AI 활용 노하우를 공유하고 발전시키는 스타일',
    emoji: '🤝',
    strengths: [
      '팀워크',
      '지식 공유',
      '빠른 적응력'
    ],
    recommendations: [
      '개인 역량 개발에도 시간을 투자하세요',
      '심화 학습으로 전문성을 높이세요',
      'AI 기초 이론을 더 공부해보세요'
    ]
  },
  ai_fundamentalist: {
    name: 'AI Fundamentalist',
    nameKo: 'AI 기본 전문가',
    description: 'AI의 원리와 한계를 깊이 이해하고 활용하는 스타일',
    emoji: '🧠',
    strengths: [
      '깊은 이해도',
      '효과적인 문제 해결',
      '최적화 능력'
    ],
    recommendations: [
      '실전 프로젝트 경험을 늘리세요',
      '이론을 실무에 적용하는 연습을 하세요',
      '다양한 도메인에 도전해보세요'
    ]
  },
  balanced_practitioner: {
    name: 'Balanced Practitioner',
    nameKo: '균형잡힌 실무자',
    description: '다양한 측면에서 균형잡힌 AI 활용 능력을 가진 스타일',
    emoji: '⚖️',
    strengths: [
      '전방위적 능력',
      '상황 대응력',
      '안정적인 퍼포먼스'
    ],
    recommendations: [
      '특정 강점을 더 발전시켜보세요',
      '관심 분야를 선택해 전문성을 높이세요',
      '차별화된 강점을 만들어보세요'
    ]
  }
};

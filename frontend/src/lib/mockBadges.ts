// Mock data for Badges & Skills

import type { SkillCardProps } from '@/components/cards/SkillCard';

export type SkillData = SkillCardProps['skill'];

export const mockSkills: SkillData[] = [
  // Completed Skills
  {
    id: 'skill-1',
    name: 'React State Management',
    category: 'Frontend Development',
    difficulty: 'accomplished',
    status: 'completed',
    grade: 'A',
    score: 88,
    completedAt: '2025-11-15T10:30:00Z',
    percentile: 15,
    scores: {
      functionality: 90,
      code_quality: 85,
      ai_usage: 92,
      ui_ux: 85
    }
  },
  {
    id: 'skill-2',
    name: 'TypeScript Advanced',
    category: 'Programming',
    difficulty: 'expert',
    status: 'completed',
    grade: 'S',
    score: 95,
    completedAt: '2025-11-10T14:20:00Z',
    percentile: 5,
    scores: {
      functionality: 98,
      code_quality: 92,
      ai_usage: 95,
      ui_ux: 95
    }
  },
  {
    id: 'skill-3',
    name: 'REST API Design',
    category: 'Backend Development',
    difficulty: 'developing',
    status: 'completed',
    grade: 'B',
    score: 78,
    completedAt: '2025-11-05T09:15:00Z',
    percentile: 30,
    scores: {
      functionality: 80,
      code_quality: 75,
      ai_usage: 82,
      ui_ux: 75
    }
  },

  // Locked/Available Skills
  {
    id: 'skill-4',
    name: 'Database Optimization',
    category: 'Backend Development',
    difficulty: 'expert',
    status: 'locked'
  },
  {
    id: 'skill-5',
    name: 'React Performance',
    category: 'Frontend Development',
    difficulty: 'accomplished',
    status: 'locked'
  },
  {
    id: 'skill-6',
    name: 'Testing with AI',
    category: 'Quality Assurance',
    difficulty: 'developing',
    status: 'locked'
  },
  {
    id: 'skill-7',
    name: 'CI/CD Pipeline',
    category: 'DevOps',
    difficulty: 'accomplished',
    status: 'locked'
  },
  {
    id: 'skill-8',
    name: 'UI/UX Basics',
    category: 'Design',
    difficulty: 'beginner',
    status: 'locked'
  },
  {
    id: 'skill-9',
    name: 'GraphQL Implementation',
    category: 'Backend Development',
    difficulty: 'expert',
    status: 'locked'
  }
];

// Stats calculation
export function getSkillStats() {
  const completed = mockSkills.filter(s => s.status === 'completed');
  const totalScore = completed.reduce((sum, s) => sum + (s.score || 0), 0);
  const avgScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;

  return {
    total: mockSkills.length,
    completed: completed.length,
    inProgress: mockSkills.filter(s => s.status === 'in_progress').length,
    locked: mockSkills.filter(s => s.status === 'locked').length,
    avgScore
  };
}

// Filter skills by category
export function getSkillsByCategory(category?: string) {
  if (!category || category === 'all') {
    return mockSkills;
  }
  return mockSkills.filter(s => s.category === category);
}

// Filter skills by difficulty
export function getSkillsByDifficulty(difficulty?: string) {
  if (!difficulty || difficulty === 'all') {
    return mockSkills;
  }
  return mockSkills.filter(s => s.difficulty === difficulty);
}

// Filter skills by status
export function getSkillsByStatus(status?: string) {
  if (!status || status === 'all') {
    return mockSkills;
  }
  return mockSkills.filter(s => s.status === status);
}

// Get unique categories
export function getCategories(): string[] {
  const categories = mockSkills.map(s => s.category);
  return Array.from(new Set(categories)).sort();
}

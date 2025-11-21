import { create } from 'zustand';

// Types
export interface Challenge {
  challenge_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'developing' | 'accomplished' | 'expert';
  category: string;
  estimated_time: number; // in minutes
  skills_tested: string[];
  requirements: string[];
  starter_code?: string;
  test_cases?: string;
  status?: 'locked' | 'in_progress' | 'completed';
  user_progress?: {
    started_at?: string;
    completed_at?: string;
    submission_count?: number;
    best_score?: number;
  };
}

export interface Submission {
  submission_id: string;
  challenge_id: string;
  user_id: string;
  code_file_url: string;
  github_repo_url?: string;
  submitted_at: string;
  status: 'pending' | 'evaluating' | 'completed' | 'failed';
  score?: number;
  grade?: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  evaluation_result?: {
    functionality: number;
    code_quality: number;
    ai_usage: number;
    ui_ux: number;
    feedback: string;
  };
}

export interface ChallengeFilters {
  category?: string;
  difficulty?: string;
  status?: string;
}

interface ChallengeState {
  // State
  challenges: Challenge[];
  selectedChallenge: Challenge | null;
  submissions: Submission[];
  filters: ChallengeFilters;
  isLoading: boolean;
  error: string | null;
  isMockMode: boolean;

  // Actions
  setMockMode: (enabled: boolean) => void;
  fetchChallenges: () => Promise<void>;
  fetchChallengeById: (challengeId: string) => Promise<void>;
  fetchSubmissions: (challengeId?: string) => Promise<void>;
  submitChallenge: (challengeId: string, codeFile: File, githubUrl?: string) => Promise<void>;
  setFilters: (filters: ChallengeFilters) => void;
  selectChallenge: (challenge: Challenge | null) => void;
  clearError: () => void;
}

// Mock data generator
const generateMockChallenges = (): Challenge[] => [
  {
    challenge_id: 'challenge-1',
    title: 'React Todo App with AI',
    description: 'Build a todo application using React and integrate AI features for smart task suggestions',
    difficulty: 'beginner',
    category: 'Frontend Development',
    estimated_time: 60,
    skills_tested: ['React', 'State Management', 'AI Integration', 'UI/UX'],
    requirements: [
      'Create a functional todo list with add/delete/complete features',
      'Integrate AI to suggest task priorities',
      'Responsive design',
      'Clean code with proper component structure',
    ],
    status: 'locked',
  },
  {
    challenge_id: 'challenge-2',
    title: 'REST API with Authentication',
    description: 'Create a secure REST API with user authentication and authorization',
    difficulty: 'developing',
    category: 'Backend Development',
    estimated_time: 120,
    skills_tested: ['Node.js', 'Express', 'Authentication', 'Database'],
    requirements: [
      'Implement JWT authentication',
      'Create CRUD endpoints for user resources',
      'Proper error handling',
      'API documentation',
    ],
    status: 'in_progress',
    user_progress: {
      started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      submission_count: 1,
    },
  },
  {
    challenge_id: 'challenge-3',
    title: 'Real-time Chat Application',
    description: 'Build a real-time chat application with WebSocket support',
    difficulty: 'accomplished',
    category: 'Full-Stack Development',
    estimated_time: 180,
    skills_tested: ['WebSocket', 'Real-time Communication', 'Frontend', 'Backend'],
    requirements: [
      'Real-time messaging with WebSocket',
      'User presence tracking',
      'Message history',
      'Typing indicators',
    ],
    status: 'completed',
    user_progress: {
      started_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      submission_count: 3,
      best_score: 88,
    },
  },
  {
    challenge_id: 'challenge-4',
    title: 'Machine Learning API Integration',
    description: 'Integrate machine learning models into a web application',
    difficulty: 'expert',
    category: 'AI & Machine Learning',
    estimated_time: 240,
    skills_tested: ['ML Integration', 'API Design', 'Data Processing', 'Performance'],
    requirements: [
      'Integrate pre-trained ML model',
      'Handle data preprocessing',
      'Implement caching for performance',
      'Error handling for edge cases',
    ],
    status: 'locked',
  },
  {
    challenge_id: 'challenge-5',
    title: 'E-commerce Product Search',
    description: 'Build an advanced product search with filters and AI-powered recommendations',
    difficulty: 'accomplished',
    category: 'Full-Stack Development',
    estimated_time: 150,
    skills_tested: ['Search Algorithms', 'Filtering', 'AI Recommendations', 'Performance'],
    requirements: [
      'Implement advanced search with filters',
      'AI-powered product recommendations',
      'Optimized for large datasets',
      'Beautiful UI with smooth interactions',
    ],
    status: 'locked',
  },
  {
    challenge_id: 'challenge-6',
    title: 'Data Visualization Dashboard',
    description: 'Create an interactive dashboard with multiple chart types',
    difficulty: 'developing',
    category: 'Frontend Development',
    estimated_time: 90,
    skills_tested: ['Data Visualization', 'Charts', 'Interactivity', 'Performance'],
    requirements: [
      'Multiple chart types (bar, line, pie)',
      'Interactive filtering',
      'Responsive design',
      'Real-time data updates',
    ],
    status: 'locked',
  },
];

const generateMockSubmissions = (): Submission[] => [
  {
    submission_id: 'sub-1',
    challenge_id: 'challenge-3',
    user_id: 'user-1',
    code_file_url: 'https://storage.example.com/submissions/sub-1.zip',
    github_repo_url: 'https://github.com/user/chat-app',
    submitted_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    score: 88,
    grade: 'A',
    evaluation_result: {
      functionality: 90,
      code_quality: 85,
      ai_usage: 92,
      ui_ux: 85,
      feedback: 'Excellent real-time implementation with clean architecture. Consider adding more error handling for edge cases.',
    },
  },
  {
    submission_id: 'sub-2',
    challenge_id: 'challenge-2',
    user_id: 'user-1',
    code_file_url: 'https://storage.example.com/submissions/sub-2.zip',
    submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'evaluating',
  },
];

// Create store
export const useChallengeStore = create<ChallengeState>((set, get) => ({
  // Initial state
  challenges: [],
  selectedChallenge: null,
  submissions: [],
  filters: {},
  isLoading: false,
  error: null,
  isMockMode: true, // Default to mock mode

  // Actions
  setMockMode: (enabled: boolean) => {
    set({ isMockMode: enabled });
    // Re-fetch data when mode changes
    get().fetchChallenges();
    get().fetchSubmissions();
  },

  fetchChallenges: async () => {
    set({ isLoading: true, error: null });
    try {
      if (get().isMockMode) {
        // Mock mode: Use local data
        await new Promise(resolve => setTimeout(resolve, 500));
        let challenges = generateMockChallenges();

        // Apply filters
        const { category, difficulty, status } = get().filters;
        if (category && category !== 'all') {
          challenges = challenges.filter(c => c.category === category);
        }
        if (difficulty && difficulty !== 'all') {
          challenges = challenges.filter(c => c.difficulty === difficulty);
        }
        if (status && status !== 'all') {
          challenges = challenges.filter(c => c.status === status);
        }

        set({ challenges, isLoading: false });
      } else {
        // Real mode: Fetch from API
        const queryParams = new URLSearchParams();
        const { category, difficulty, status } = get().filters;
        if (category) queryParams.append('category', category);
        if (difficulty) queryParams.append('difficulty', difficulty);
        if (status) queryParams.append('status', status);

        const response = await fetch(`/api/challenges?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch challenges');
        const data = await response.json();
        set({ challenges: data.challenges, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  fetchChallengeById: async (challengeId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (get().isMockMode) {
        // Mock mode: Find from local data
        await new Promise(resolve => setTimeout(resolve, 300));
        const challenges = generateMockChallenges();
        const challenge = challenges.find(c => c.challenge_id === challengeId);
        if (!challenge) throw new Error('Challenge not found');
        set({ selectedChallenge: challenge, isLoading: false });
      } else {
        // Real mode: Fetch from API
        const response = await fetch(`/api/challenges/${challengeId}`);
        if (!response.ok) throw new Error('Failed to fetch challenge');
        const data = await response.json();
        set({ selectedChallenge: data.challenge, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  fetchSubmissions: async (challengeId?: string) => {
    set({ isLoading: true, error: null });
    try {
      if (get().isMockMode) {
        // Mock mode: Use local data
        await new Promise(resolve => setTimeout(resolve, 400));
        let submissions = generateMockSubmissions();
        if (challengeId) {
          submissions = submissions.filter(s => s.challenge_id === challengeId);
        }
        set({ submissions, isLoading: false });
      } else {
        // Real mode: Fetch from API
        const url = challengeId
          ? `/api/challenges/${challengeId}/submissions`
          : '/api/submissions';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch submissions');
        const data = await response.json();
        set({ submissions: data.submissions, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  submitChallenge: async (challengeId: string, codeFile: File, githubUrl?: string) => {
    set({ isLoading: true, error: null });
    try {
      if (get().isMockMode) {
        // Mock mode: Simulate submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        const newSubmission: Submission = {
          submission_id: `sub-${Date.now()}`,
          challenge_id: challengeId,
          user_id: 'user-1',
          code_file_url: URL.createObjectURL(codeFile),
          github_repo_url: githubUrl,
          submitted_at: new Date().toISOString(),
          status: 'pending',
        };
        set(state => ({
          submissions: [...state.submissions, newSubmission],
          isLoading: false,
        }));

        // Simulate evaluation after 5 seconds (in real app this would be backend)
        setTimeout(() => {
          set(state => ({
            submissions: state.submissions.map(s =>
              s.submission_id === newSubmission.submission_id
                ? { ...s, status: 'evaluating' as const }
                : s
            ),
          }));
        }, 5000);
      } else {
        // Real mode: Upload to API
        const formData = new FormData();
        formData.append('code_file', codeFile);
        if (githubUrl) formData.append('github_repo_url', githubUrl);

        const response = await fetch(`/api/challenges/${challengeId}/submit`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to submit challenge');
        const data = await response.json();
        set(state => ({
          submissions: [...state.submissions, data.submission],
          isLoading: false,
        }));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  setFilters: (filters: ChallengeFilters) => {
    set({ filters });
    // Re-fetch challenges with new filters
    get().fetchChallenges();
  },

  selectChallenge: (challenge: Challenge | null) => {
    set({ selectedChallenge: challenge });
  },

  clearError: () => {
    set({ error: null });
  },
}));

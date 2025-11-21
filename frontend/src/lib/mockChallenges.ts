// Mock data for Challenge System

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type ChallengeCategory = 'development' | 'debugging' | 'optimization' | 'architecture' | 'testing'
export type ChallengeStatus = 'not_started' | 'in_progress' | 'submitted' | 'completed'

export interface Challenge {
  challenge_id: string
  title: string
  description: string
  difficulty: DifficultyLevel
  category: ChallengeCategory
  points: number
  time_limit_minutes: number
  requirements: string[]
  test_cases: number
  success_rate: number
  participants: number
  created_at: string
  tags: string[]
  status?: ChallengeStatus
}

export interface ChallengeSubmission {
  submission_id: string
  challenge_id: string
  user_id: string
  github_url: string
  submitted_at: string
  status: 'pending' | 'evaluating' | 'completed' | 'failed'
  score?: number
  feedback?: string
  evaluation_result?: EvaluationResult
}

export interface EvaluationResult {
  submission_id: string
  overall_score: number
  test_results: TestResult[]
  code_quality: CodeQualityMetrics
  performance: PerformanceMetrics
  ai_feedback: AIFeedback
  evaluated_at: string
}

export interface TestResult {
  test_id: string
  name: string
  status: 'passed' | 'failed' | 'skipped'
  score: number
  max_score: number
  execution_time_ms: number
  error_message?: string
}

export interface CodeQualityMetrics {
  score: number
  complexity: number
  maintainability: number
  security_issues: number
  code_smells: number
  duplications: number
  comments: {
    lines: number
    coverage_percentage: number
  }
}

export interface PerformanceMetrics {
  score: number
  avg_response_time_ms: number
  memory_usage_mb: number
  cpu_usage_percentage: number
  requests_per_second: number
}

export interface AIFeedback {
  strengths: string[]
  improvements: string[]
  best_practices: string[]
  security_notes: string[]
  overall_comment: string
}

export const mockChallenges: Challenge[] = [
  {
    challenge_id: '1',
    title: 'Build a REST API with Authentication',
    description: 'Create a RESTful API with JWT authentication, user registration, and protected routes. Implement CRUD operations for a todo list application.',
    difficulty: 'intermediate',
    category: 'development',
    points: 150,
    time_limit_minutes: 180,
    requirements: [
      'Implement JWT authentication',
      'Create user registration and login endpoints',
      'Build CRUD endpoints for todos',
      'Add input validation',
      'Write API documentation'
    ],
    test_cases: 15,
    success_rate: 68,
    participants: 234,
    created_at: '2025-01-15',
    tags: ['API', 'Authentication', 'Node.js', 'Express'],
    status: 'not_started'
  },
  {
    challenge_id: '2',
    title: 'Optimize Database Queries',
    description: 'Given a slow-performing database, identify bottlenecks and optimize queries to improve response time by at least 50%.',
    difficulty: 'advanced',
    category: 'optimization',
    points: 200,
    time_limit_minutes: 120,
    requirements: [
      'Identify slow queries using profiling tools',
      'Add appropriate indexes',
      'Optimize query structure',
      'Reduce N+1 queries',
      'Document performance improvements'
    ],
    test_cases: 10,
    success_rate: 45,
    participants: 156,
    created_at: '2025-01-10',
    tags: ['SQL', 'Performance', 'PostgreSQL', 'Optimization'],
    status: 'completed'
  },
  {
    challenge_id: '3',
    title: 'Debug Memory Leak in React App',
    description: 'A React application has a memory leak causing performance degradation. Find and fix all memory leaks.',
    difficulty: 'advanced',
    category: 'debugging',
    points: 180,
    time_limit_minutes: 90,
    requirements: [
      'Use Chrome DevTools to identify leaks',
      'Fix event listener cleanup',
      'Properly manage subscriptions',
      'Fix React ref issues',
      'Add cleanup in useEffect hooks'
    ],
    test_cases: 8,
    success_rate: 52,
    participants: 189,
    created_at: '2025-01-12',
    tags: ['React', 'Debugging', 'Performance', 'Memory'],
    status: 'in_progress'
  },
  {
    challenge_id: '4',
    title: 'Implement Binary Search Tree',
    description: 'Create a balanced binary search tree with insert, delete, search, and traversal operations.',
    difficulty: 'beginner',
    category: 'development',
    points: 100,
    time_limit_minutes: 60,
    requirements: [
      'Implement BST class',
      'Add insert method',
      'Add delete method',
      'Add search method',
      'Implement in-order traversal'
    ],
    test_cases: 12,
    success_rate: 82,
    participants: 456,
    created_at: '2025-01-18',
    tags: ['Data Structures', 'Algorithms', 'JavaScript'],
    status: 'not_started'
  },
  {
    challenge_id: '5',
    title: 'Design Microservices Architecture',
    description: 'Design a scalable microservices architecture for an e-commerce platform. Include API Gateway, service discovery, and inter-service communication.',
    difficulty: 'expert',
    category: 'architecture',
    points: 300,
    time_limit_minutes: 240,
    requirements: [
      'Design system architecture diagram',
      'Define service boundaries',
      'Plan API Gateway structure',
      'Design inter-service communication',
      'Address scalability and resilience'
    ],
    test_cases: 5,
    success_rate: 35,
    participants: 98,
    created_at: '2025-01-08',
    tags: ['Architecture', 'Microservices', 'System Design', 'Scalability'],
    status: 'not_started'
  },
  {
    challenge_id: '6',
    title: 'Write Unit Tests for Legacy Code',
    description: 'Add comprehensive unit tests to a legacy codebase without breaking existing functionality. Achieve 80% code coverage.',
    difficulty: 'intermediate',
    category: 'testing',
    points: 120,
    time_limit_minutes: 150,
    requirements: [
      'Analyze existing code',
      'Write unit tests using Jest',
      'Mock external dependencies',
      'Achieve 80% coverage',
      'Refactor for testability'
    ],
    test_cases: 20,
    success_rate: 71,
    participants: 312,
    created_at: '2025-01-14',
    tags: ['Testing', 'Jest', 'TDD', 'Legacy Code'],
    status: 'submitted'
  },
]

export const mockSubmissions: ChallengeSubmission[] = [
  {
    submission_id: 's1',
    challenge_id: '2',
    user_id: 'user1',
    github_url: 'https://github.com/user/db-optimization',
    submitted_at: '2025-01-20T10:30:00Z',
    status: 'completed',
    score: 95,
    feedback: 'Excellent optimization! Query performance improved by 75%. Great use of indexes and query restructuring.',
    evaluation_result: {
      submission_id: 's1',
      overall_score: 95,
      test_results: [
        { test_id: 't1', name: 'Query Performance Test', status: 'passed', score: 10, max_score: 10, execution_time_ms: 45 },
        { test_id: 't2', name: 'Index Optimization', status: 'passed', score: 10, max_score: 10, execution_time_ms: 32 },
        { test_id: 't3', name: 'N+1 Query Elimination', status: 'passed', score: 10, max_score: 10, execution_time_ms: 28 },
        { test_id: 't4', name: 'Query Structure Optimization', status: 'passed', score: 10, max_score: 10, execution_time_ms: 38 },
        { test_id: 't5', name: 'Connection Pool Management', status: 'passed', score: 9, max_score: 10, execution_time_ms: 52 },
        { test_id: 't6', name: 'Transaction Handling', status: 'passed', score: 10, max_score: 10, execution_time_ms: 41 },
        { test_id: 't7', name: 'Query Caching Strategy', status: 'passed', score: 9, max_score: 10, execution_time_ms: 47 },
        { test_id: 't8', name: 'Read Replica Usage', status: 'passed', score: 10, max_score: 10, execution_time_ms: 35 },
        { test_id: 't9', name: 'Batch Operations', status: 'passed', score: 9, max_score: 10, execution_time_ms: 55 },
        { test_id: 't10', name: 'Performance Benchmarks', status: 'passed', score: 8, max_score: 10, execution_time_ms: 120 },
      ],
      code_quality: {
        score: 92,
        complexity: 12,
        maintainability: 88,
        security_issues: 0,
        code_smells: 2,
        duplications: 1,
        comments: {
          lines: 45,
          coverage_percentage: 22
        }
      },
      performance: {
        score: 96,
        avg_response_time_ms: 18,
        memory_usage_mb: 42,
        cpu_usage_percentage: 15,
        requests_per_second: 1850
      },
      ai_feedback: {
        strengths: [
          'Excellent use of composite indexes for complex queries',
          'Proper implementation of query result caching',
          'Effective elimination of N+1 queries',
          'Good use of database connection pooling'
        ],
        improvements: [
          'Consider implementing materialized views for frequently accessed aggregations',
          'Add more comprehensive error handling for database timeouts',
          'Could benefit from query explain plan documentation'
        ],
        best_practices: [
          'Followed PostgreSQL best practices for index creation',
          'Properly parameterized all SQL queries',
          'Good separation of read and write operations'
        ],
        security_notes: [
          'All queries properly protected against SQL injection',
          'No sensitive data exposed in error messages',
          'Connection strings properly secured'
        ],
        overall_comment: 'Outstanding work on database optimization! Your solution demonstrates deep understanding of PostgreSQL performance tuning. The query performance improvement of 75% exceeds the requirement. The code is clean, well-structured, and follows best practices. Minor improvements could be made in error handling and documentation, but overall this is an exemplary submission.'
      },
      evaluated_at: '2025-01-20T11:45:00Z'
    }
  },
  {
    submission_id: 's2',
    challenge_id: '3',
    user_id: 'user1',
    github_url: 'https://github.com/user/memory-leak-fix',
    submitted_at: '2025-01-21T14:15:00Z',
    status: 'evaluating',
  },
  {
    submission_id: 's3',
    challenge_id: '6',
    user_id: 'user1',
    github_url: 'https://github.com/user/unit-tests',
    submitted_at: '2025-01-19T16:45:00Z',
    status: 'completed',
    score: 88,
    feedback: 'Good test coverage achieved. Some edge cases could be tested more thoroughly.',
    evaluation_result: {
      submission_id: 's3',
      overall_score: 88,
      test_results: [
        { test_id: 't1', name: 'Unit Test Coverage', status: 'passed', score: 10, max_score: 10, execution_time_ms: 234 },
        { test_id: 't2', name: 'Integration Test Coverage', status: 'passed', score: 8, max_score: 10, execution_time_ms: 456 },
        { test_id: 't3', name: 'Edge Case Testing', status: 'passed', score: 7, max_score: 10, execution_time_ms: 189, error_message: 'Some edge cases not covered' },
        { test_id: 't4', name: 'Mock Implementation', status: 'passed', score: 9, max_score: 10, execution_time_ms: 123 },
        { test_id: 't5', name: 'Test Organization', status: 'passed', score: 10, max_score: 10, execution_time_ms: 98 },
        { test_id: 't6', name: 'Assertion Quality', status: 'passed', score: 9, max_score: 10, execution_time_ms: 145 },
        { test_id: 't7', name: 'Test Isolation', status: 'passed', score: 10, max_score: 10, execution_time_ms: 167 },
        { test_id: 't8', name: 'Setup/Teardown', status: 'passed', score: 9, max_score: 10, execution_time_ms: 134 },
        { test_id: 't9', name: 'Async Testing', status: 'passed', score: 8, max_score: 10, execution_time_ms: 278 },
        { test_id: 't10', name: 'Test Documentation', status: 'passed', score: 8, max_score: 10, execution_time_ms: 87 },
      ],
      code_quality: {
        score: 85,
        complexity: 8,
        maintainability: 82,
        security_issues: 0,
        code_smells: 5,
        duplications: 3,
        comments: {
          lines: 67,
          coverage_percentage: 28
        }
      },
      performance: {
        score: 90,
        avg_response_time_ms: 156,
        memory_usage_mb: 38,
        cpu_usage_percentage: 12,
        requests_per_second: 450
      },
      ai_feedback: {
        strengths: [
          'Achieved 83% code coverage, exceeding the 80% requirement',
          'Well-organized test suites with clear descriptions',
          'Good use of mocking for external dependencies',
          'Comprehensive setup and teardown procedures'
        ],
        improvements: [
          'Add more edge case tests for error conditions',
          'Some tests could be more isolated from each other',
          'Consider adding property-based testing for complex logic',
          'Test execution could be optimized for better performance'
        ],
        best_practices: [
          'Followed AAA (Arrange-Act-Assert) pattern consistently',
          'Good use of test fixtures and factories',
          'Clear and descriptive test names'
        ],
        security_notes: [
          'No security issues detected in test code',
          'Properly handled sensitive data in test fixtures',
          'Mock credentials follow security best practices'
        ],
        overall_comment: 'Solid testing implementation that successfully achieves the coverage requirement. Your tests are well-structured and follow testing best practices. The main area for improvement is expanding edge case coverage, particularly for error handling paths. The test organization is excellent and will make maintenance easy for future developers.'
      },
      evaluated_at: '2025-01-19T17:30:00Z'
    }
  },
]

// Helper functions
export function getDifficultyColor(difficulty: DifficultyLevel): string {
  const colors = {
    beginner: 'bg-green-100 text-green-800 border-green-300',
    intermediate: 'bg-blue-100 text-blue-800 border-blue-300',
    advanced: 'bg-purple-100 text-purple-800 border-purple-300',
    expert: 'bg-red-100 text-red-800 border-red-300',
  }
  return colors[difficulty]
}

export function getCategoryColor(category: ChallengeCategory): string {
  const colors = {
    development: 'bg-indigo-100 text-indigo-700',
    debugging: 'bg-orange-100 text-orange-700',
    optimization: 'bg-yellow-100 text-yellow-700',
    architecture: 'bg-pink-100 text-pink-700',
    testing: 'bg-teal-100 text-teal-700',
  }
  return colors[category]
}

export function getStatusColor(status: ChallengeStatus): string {
  const colors = {
    not_started: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    submitted: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
  }
  return colors[status]
}

-- Seed data for SkillSync platform
-- This file populates the database with sample data for development and testing

-- Insert sample challenges
INSERT INTO public.challenges (id, title, slug, description, difficulty, category, points, time_limit_minutes, requirements, test_cases, tags, is_published) VALUES
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'React 상태 관리',
  'react-state-management',
  'React hooks를 사용하여 복잡한 상태를 관리하는 TODO 앱을 구현하세요.',
  'intermediate',
  'frontend',
  150,
  120,
  '{"requirements": ["useState, useEffect, useContext 사용", "로컬 스토리지 저장", "필터링 기능 구현"]}',
  '{"tests": [{"name": "TODO 추가", "points": 30}, {"name": "TODO 완료 처리", "points": 30}, {"name": "필터링", "points": 40}]}',
  ARRAY['react', 'hooks', 'state-management'],
  true
),
(
  'b2c3d4e5-f6a7-8901-2345-678901bcdefg',
  'TypeScript 타입 시스템',
  'typescript-type-system',
  'TypeScript의 고급 타입 기능을 활용하여 타입 안전한 API 클라이언트를 만드세요.',
  'advanced',
  'frontend',
  200,
  150,
  '{"requirements": ["제네릭 타입 사용", "유틸리티 타입 활용", "타입 가드 구현"]}',
  '{"tests": [{"name": "타입 안전성", "points": 50}, {"name": "에러 핸들링", "points": 50}]}',
  ARRAY['typescript', 'types', 'generics'],
  true
),
(
  'c3d4e5f6-a7b8-9012-3456-789012cdefgh',
  '알고리즘: 이진 탐색 트리',
  'algorithm-binary-search-tree',
  '이진 탐색 트리를 구현하고 삽입, 삭제, 검색 기능을 완성하세요.',
  'intermediate',
  'algorithms',
  180,
  90,
  '{"requirements": ["BST 노드 구조 정의", "삽입/삭제/검색 메서드", "균형 유지 로직"]}',
  '{"tests": [{"name": "삽입", "points": 40}, {"name": "검색", "points": 30}, {"name": "삭제", "points": 50}]}',
  ARRAY['algorithms', 'data-structures', 'tree'],
  true
),
(
  'd4e5f6a7-b8c9-0123-4567-890123defghi',
  'REST API 설계',
  'rest-api-design',
  'Express.js를 사용하여 RESTful API를 설계하고 구현하세요.',
  'beginner',
  'backend',
  120,
  180,
  '{"requirements": ["CRUD 엔드포인트", "에러 핸들링", "입력 검증"]}',
  '{"tests": [{"name": "GET 엔드포인트", "points": 25}, {"name": "POST 엔드포인트", "points": 25}, {"name": "PUT 엔드포인트", "points": 25}, {"name": "DELETE 엔드포인트", "points": 25}]}',
  ARRAY['nodejs', 'express', 'api', 'rest'],
  true
),
(
  'e5f6a7b8-c9d0-1234-5678-901234efghij',
  '데이터베이스 최적화',
  'database-optimization',
  'PostgreSQL 쿼리를 최적화하고 인덱스를 적절히 활용하세요.',
  'advanced',
  'database',
  220,
  120,
  '{"requirements": ["복잡한 JOIN 쿼리", "인덱스 전략", "쿼리 성능 분석"]}',
  '{"tests": [{"name": "쿼리 정확성", "points": 60}, {"name": "쿼리 성능", "points": 80}]}',
  ARRAY['postgresql', 'sql', 'optimization', 'indexing'],
  true
);

-- Insert sample badges
INSERT INTO public.badges (id, name, slug, description, icon, category, criteria, points, rarity, is_active) VALUES
(
  'f6a7b8c9-d0e1-2345-6789-012345fghijk',
  'TypeScript Master',
  'typescript-master',
  'TypeScript 챌린지 10개 완료',
  '🏆',
  'challenge',
  '{"challenge_count": 10, "category": "frontend", "tag": "typescript"}',
  500,
  'epic',
  true
),
(
  'a7b8c9d0-e1f2-3456-7890-123456ghijkl',
  'React Pro',
  'react-pro',
  'React 고급 챌린지 완료',
  '⚛️',
  'challenge',
  '{"difficulty": "advanced", "tag": "react"}',
  300,
  'rare',
  true
),
(
  'b8c9d0e1-f2a3-4567-8901-234567hijklm',
  'AI Tool Expert',
  'ai-tool-expert',
  'AI 도구 1000회 사용',
  '🤖',
  'usage',
  '{"usage_count": 1000}',
  400,
  'rare',
  true
),
(
  'c9d0e1f2-a3b4-5678-9012-345678ijklmn',
  'Algorithm Wizard',
  'algorithm-wizard',
  '알고리즘 챌린지 20개 완료',
  '🧙',
  'challenge',
  '{"challenge_count": 20, "category": "algorithms"}',
  600,
  'epic',
  true
),
(
  'd0e1f2a3-b4c5-6789-0123-456789jklmno',
  'Full Stack Hero',
  'full-stack-hero',
  '풀스택 프로젝트 완료',
  '🦸',
  'challenge',
  '{"category": "fullstack", "difficulty": "advanced"}',
  800,
  'legendary',
  true
),
(
  'e1f2a3b4-c5d6-7890-1234-567890klmnop',
  'Early Adopter',
  'early-adopter',
  'SkillSync 초기 가입자',
  '🌟',
  'special',
  '{"signup_before": "2024-03-01"}',
  100,
  'common',
  true
),
(
  'f2a3b4c5-d6e7-8901-2345-678901lmnopq',
  '7일 연속 학습',
  '7-day-streak',
  '7일 연속 챌린지 수행',
  '🔥',
  'streak',
  '{"streak_days": 7}',
  200,
  'rare',
  true
),
(
  'a3b4c5d6-e7f8-9012-3456-789012mnopqr',
  '코드 리뷰어',
  'code-reviewer',
  '코드 리뷰 50회 수행',
  '👁️',
  'special',
  '{"review_count": 50}',
  350,
  'rare',
  true
);

-- Insert sample jobs
INSERT INTO public.jobs (id, title, company_name, description, location, salary_range, job_type, required_skills, preferred_skills, ai_skill_level, is_active, posted_at) VALUES
(
  'a4b5c6d7-e8f9-0123-4567-890123nopqrs',
  'Senior Frontend Developer',
  'Tech Corp',
  'We are looking for an experienced Frontend Developer who is proficient in React and TypeScript. You will work with AI-powered development tools.',
  '서울, 한국',
  '6000만 - 8000만원',
  'full-time',
  ARRAY['React', 'TypeScript', 'Next.js'],
  ARRAY['AI Tools', 'Claude Code', 'GitHub Copilot'],
  'advanced',
  true,
  NOW() - INTERVAL '2 days'
),
(
  'b5c6d7e8-f9a0-1234-5678-901234opqrst',
  'AI Engineer',
  'AI Startup',
  'Join our team to build cutting-edge AI applications. Experience with LLMs and AI development tools is essential.',
  '판교, 한국',
  '7000만 - 1억원',
  'full-time',
  ARRAY['Python', 'TensorFlow', 'PyTorch'],
  ARRAY['LLM', 'Claude API', 'OpenAI API'],
  'advanced',
  true,
  NOW() - INTERVAL '1 week'
),
(
  'c6d7e8f9-a0b1-2345-6789-012345pqrstu',
  'Full Stack Developer',
  'Global Company',
  'Remote-first company seeking a Full Stack Developer. You will use AI tools to boost productivity.',
  '원격',
  '5000만 - 7000만원',
  'remote',
  ARRAY['React', 'Node.js', 'PostgreSQL'],
  ARRAY['TypeScript', 'AI Development Tools'],
  'intermediate',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'd7e8f9a0-b1c2-3456-7890-123456qrstuv',
  'Backend Engineer',
  'FinTech Startup',
  'Build scalable backend systems for our FinTech platform. AI-assisted development experience is a plus.',
  '강남, 서울',
  '6500만 - 9000만원',
  'full-time',
  ARRAY['Node.js', 'PostgreSQL', 'Redis'],
  ARRAY['AWS', 'Docker', 'AI Tools'],
  'intermediate',
  true,
  NOW() - INTERVAL '5 days'
);

-- Insert sample teams
INSERT INTO public.teams (id, name, slug, description, is_active) VALUES
(
  'e8f9a0b1-c2d3-4567-8901-234567rstuvw',
  'Tech Corp Engineering',
  'tech-corp-engineering',
  'Engineering team at Tech Corp',
  true
),
(
  'f9a0b1c2-d3e4-5678-9012-345678stuvwx',
  'AI Startup Team',
  'ai-startup-team',
  'AI development team',
  true
);

-- Note: User-specific data (users, submissions, evaluations, etc.) should be created through the application
-- after users sign up, as they require authentication and proper user IDs from Supabase Auth.

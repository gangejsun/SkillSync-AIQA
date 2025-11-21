# PPT Generator 사용 예시

## 예시 1: AI 기술 트렌드 발표

### 입력

```
Slide 1: [제목 슬라이드]
제목: 2025 AI 기술 트렌드
부제: 개발자가 알아야 할 핵심 변화

Slide 2: [목차]
• AI 기술 현황
• 주요 트렌드
• 개발자 역할 변화
• 실무 적용 방법
• Q&A

Slide 3: [본문]
제목: AI 기술 현황
• ChatGPT 등장 이후 급격한 변화
• GitHub Copilot 일상화
• AI 기반 개발 도구 폭증
• 생산성 2-3배 향상

Slide 4: [본문]
제목: 주요 트렌드 #1 - LLM 활용
• 코드 생성 및 리뷰
• 문서 자동화
• 테스트 케이스 생성
• 버그 탐지 및 수정

Slide 5: [본문]
제목: 주요 트렌드 #2 - AI 에이전트
• 자율적 작업 수행
• 복잡한 태스크 분해
• 멀티 에이전트 협업
• 24/7 자동화

Slide 6: [2단 레이아웃]
제목: 전통적 개발 vs AI 개발

[왼쪽]
• 수동 코딩
• 반복 작업 많음
• 긴 개발 시간
• 단순 오류 빈번

[오른쪽]
• AI 보조 코딩
• 자동화 증가
• 빠른 프로토타이핑
• 높은 코드 품질

Slide 7: [본문]
제목: 개발자 역할의 변화
• 코더 → 아키텍트
• 구현 → 검증 및 최적화
• 단순 작업 → 창의적 설계
• 기술 스킬 → AI 활용 능력

Slide 8: [인용]
"AI는 개발자를 대체하지 않는다.
AI를 사용하는 개발자가
그렇지 않은 개발자를 대체한다"
- 샘 알트만, OpenAI CEO

Slide 9: [본문]
제목: 실무 적용 방법
• GitHub Copilot 업무 통합
• ChatGPT로 문제 해결
• Claude Code로 프로젝트 관리
• 지속적인 학습과 실험

Slide 10: [본문]
제목: 핵심 요약
• AI는 필수 도구가 됨
• 역할 변화에 적응 필요
• 창의성과 검증 능력 중요
• 지금 바로 시작하세요

Slide 11: [본문]
제목: Q&A
• 질문 환영합니다
• 실무 경험 공유
• 함께 성장하는 개발자 커뮤니티
```

### 생성 명령

```bash
python /Users/gyeong/Documents/AIQA/skills/ppt-generator/generate_ppt.py \
  --output /Users/gyeong/Documents/AIQA/outputs/ai_trends_2025.pptx \
  --style professional \
  --color blue < content.txt
```

---

## 예시 2: 스타트업 피칭 덱

### 입력

```
Slide 1: [제목 슬라이드]
제목: SkillSync
부제: AI 스킬 평가 & 매칭 플랫폼

Slide 2: [본문]
제목: 문제점
• AI 활용 능력 평가 기준 없음
• 개발자 스킬 증명 어려움
• 기업의 인재 선발 비효율
• 객관적 지표 부재

Slide 3: [본문]
제목: 우리의 솔루션
• AI 도구 사용량 자동 추적
• 실전 코딩 챌린지 평가
• AI 기반 자동 코드 리뷰
• 배지 & 증명서 발급

Slide 4: [본문]
제목: 핵심 기능
• GitHub Copilot 사용 통계
• 실시간 코딩 챌린지
• Claude API 기반 평가
• 기업 매칭 알고리즘

Slide 5: [2단 레이아웃]
제목: 시장 기회

[왼쪽]
• 전 세계 개발자 2,700만명
• AI 도구 사용자 급증
• 채용 시장 규모 확대
• 스킬 검증 니즈 증가

[오른쪽]
• TAM: $5B
• SAM: $500M
• SOM: $50M (첫 3년)
• 연 성장률: 40%

Slide 6: [본문]
제목: 비즈니스 모델
• Freemium 구독
• 기업용 프리미엄 플랜
• 채용 매칭 수수료
• API 서비스

Slide 7: [본문]
제목: 경쟁 우위
• 최초 AI 스킬 평가 플랫폼
• 실시간 사용량 추적
• 객관적 평가 알고리즘
• 검증된 기술 스택

Slide 8: [본문]
제목: 로드맵
• Q1 2025: Beta 런칭
• Q2 2025: 1,000 사용자
• Q3 2025: 기업 파트너십
• Q4 2025: Series A 투자 유치

Slide 9: [본문]
제목: 팀 소개
• CEO: AI/ML 10년 경력
• CTO: 풀스택 개발 15년
• CPO: 프로덕트 디자인 8년
• 총 3명의 창업 경험

Slide 10: [본문]
제목: 투자 제안
• 모집 금액: $500K
• 사용처: 제품 개발 70%, 마케팅 30%
• Exit 전략: 3-5년 내 M&A 또는 IPO
• 예상 ROI: 10-15x
```

### 생성 명령

```bash
python /Users/gyeong/Documents/AIQA/skills/ppt-generator/generate_ppt.py \
  --output /Users/gyeong/Documents/AIQA/outputs/skillsync_pitch.pptx \
  --style creative \
  --color purple < pitch_content.txt
```

---

## 예시 3: 기술 워크샵

### 입력

```
Slide 1: [제목 슬라이드]
제목: Next.js 15 Deep Dive
부제: 새로운 기능과 마이그레이션 가이드

Slide 2: [목차]
• What's New in Next.js 15
• App Router 개선사항
• Server Actions 강화
• 성능 최적화
• 마이그레이션 가이드

Slide 3: [본문]
제목: Next.js 15 주요 변경사항
• React 19 지원
• Turbopack 안정화
• Partial Prerendering
• Server Actions 개선

Slide 4: [본문]
제목: App Router 개선사항
• 향상된 라우팅 성능
• 병렬 라우트 안정화
• 인터셉팅 라우트 개선
• 메타데이터 API 확장

Slide 5: [2단 레이아웃]
제목: Pages Router vs App Router

[왼쪽]
• getServerSideProps
• getStaticProps
• API Routes
• _app.js 설정

[오른쪽]
• Server Components
• Streaming
• Server Actions
• layout.js 활용

Slide 6: [본문]
제목: Server Actions 활용
• Form 처리 간소화
• 자동 재검증
• 낙관적 업데이트
• 에러 처리 개선

Slide 7: [본문]
제목: 성능 최적화
• Turbopack으로 빌드 시간 50% 감소
• 이미지 최적화 강화
• 폰트 최적화 자동화
• 메모리 사용량 개선

Slide 8: [본문]
제목: 마이그레이션 Step 1
• Next.js 15 설치
• React 19 업데이트
• 의존성 패키지 확인
• 타입스크립트 설정 조정

Slide 9: [본문]
제목: 마이그레이션 Step 2
• Pages → App Router 변환
• API Routes → Route Handlers
• getServerSideProps → fetch
• _app.js → layout.js

Slide 10: [본문]
제목: 실습 시간
• 프로젝트 마이그레이션
• Server Actions 구현
• 성능 측정 및 비교
• Q&A
```

### 생성 명령

```bash
python /Users/gyeong/Documents/AIQA/skills/ppt-generator/generate_ppt.py \
  --output /Users/gyeong/Documents/AIQA/outputs/nextjs15_workshop.pptx \
  --style minimal \
  --color green < workshop_content.txt
```

---

## 예시 4: 팀 내부 발표

### 입력

```
Slide 1: [제목 슬라이드]
제목: Q4 개발팀 회고
부제: 성과와 개선 방향

Slide 2: [목차]
• Q4 주요 성과
• 기술 스택 변화
• 도전과제
• 개선 계획
• Q1 목표

Slide 3: [본문]
제목: Q4 주요 성과
• 신규 기능 15개 출시
• 버그 감소율 40%
• 배포 시간 60% 단축
• 코드 커버리지 80% 달성

Slide 4: [본문]
제목: 기술 스택 변화
• Next.js 14 → 15 마이그레이션
• Zustand 상태 관리 도입
• Tailwind CSS 전면 적용
• TypeScript strict 모드

Slide 5: [본문]
제목: 팀 생산성 향상
• GitHub Copilot 도입
• Code Review 프로세스 개선
• CI/CD 파이프라인 최적화
• 문서화 자동화

Slide 6: [본문]
제목: 도전과제
• 레거시 코드 리팩토링
• 기술 부채 누적
• 크로스 브라우저 이슈
• 성능 최적화 필요

Slide 7: [본문]
제목: 개선 계획
• 주 1회 리팩토링 데이
• 기술 부채 백로그 관리
• E2E 테스트 강화
• 성능 모니터링 도입

Slide 8: [본문]
제목: Q1 2025 목표
• 마이크로서비스 전환 완료
• API 응답 시간 50% 개선
• 테스트 커버리지 90%
• 신규 팀원 2명 온보딩

Slide 9: [인용]
"좋은 코드는 빠르게 작성되는 것이 아니라
계속해서 개선되는 것이다"
- 로버트 C. 마틴

Slide 10: [본문]
제목: 감사합니다
• 팀의 노력에 감사
• 지속적인 성장과 개선
• 함께 만드는 더 나은 제품
• Q&A
```

### 생성 명령

```bash
python /Users/gyeong/Documents/AIQA/skills/ppt-generator/generate_ppt.py \
  --output /Users/gyeong/Documents/AIQA/outputs/q4_retrospective.pptx \
  --style professional \
  --color orange < retro_content.txt
```

---

## 팁과 트릭

### 1. 효과적인 제목 작성
- 명확하고 간결하게
- 핵심 메시지 포함
- 동사 활용 (권장)

### 2. 불릿 포인트 최적화
- 3-5개가 이상적
- 각 불릿은 한 줄로
- 병렬 구조 유지

### 3. 비주얼 계층 활용
- 중요도에 따라 크기 조정
- 색상으로 강조점 표시
- 여백으로 그룹화

### 4. 스토리 라인 구성
- 도입 → 전개 → 결론
- 논리적 흐름 유지
- 청중 관점에서 작성

### 5. 컬러 테마 선택
- Blue: 비즈니스, 신뢰
- Green: 혁신, 성장
- Purple: 창의성, 고급
- Orange: 열정, 에너지

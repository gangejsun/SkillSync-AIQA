---
name: ppt-generator
description: Create professional PowerPoint presentations automatically. User provides topic and preferences - Claude generates content and creates a complete PPTX file with proper formatting, design, and structure.
---

# PPT Generator - Auto Mode

Creates professional PowerPoint presentations with automatic content generation and formatting. User provides a topic and preferences - Claude handles everything from outline creation to slide generation.

## When to Use

Use this skill when user requests:
- "PPT 만들어줘"
- "발표 자료 만들어줘"
- "프레젠테이션 생성해줘"
- "슬라이드 만들어줘"
- Any request for PowerPoint/presentation content

## Core Workflow - AUTO MODE

### Step 1: Get Topic and Preferences from User

Ask user for:
- **Topic** (주제): What the presentation is about
- **Number of Slides** (슬라이드 수): Default 10-15 slides
- **Style** (스타일): professional (기본), minimal (미니멀), creative (창의적)
- **Color Theme** (컬러 테마): blue (파랑, 기본), green (초록), purple (보라), orange (주황)

Example conversation:
```
Claude: 어떤 주제로 PPT를 만들까요?
User: AI 시대의 개발자 역량

Claude: 몇 장의 슬라이드로 만들까요? (기본 10-15장)
User: 12장

Claude: 스타일을 선택해주세요:
• professional (전문적, 기본)
• minimal (미니멀)
• creative (창의적)
User: professional

Claude: 컬러 테마를 선택해주세요:
• blue (파랑, 기본)
• green (초록)
• purple (보라)
• orange (주황)
User: blue
```

### Step 2: Generate Presentation Outline

Create a structured outline with:
1. **Title Slide**: Main title and subtitle
2. **Introduction**: Context and overview (1-2 slides)
3. **Main Content**: Key points with details (6-10 slides)
4. **Conclusion**: Summary and call-to-action (1-2 slides)

Output format:
```
Slide 1: [제목 슬라이드]
제목: AI 시대의 개발자 역량
부제: 미래를 준비하는 필수 스킬

Slide 2: [목차]
• AI 기술의 발전
• 개발자 역할의 변화
• 필수 역량
• 학습 전략

Slide 3: [도입]
제목: AI 시대가 온다
• ChatGPT, GitHub Copilot 등장
• 개발 패러다임의 변화
• 새로운 기회와 도전

Slide 4-10: [본론]
...

Slide 11: [요약]
...

Slide 12: [마무리]
...
```

### Step 3: Auto-Generate PPT

Use the Python script to create the presentation:

```bash
python /Users/gyeong/Documents/AIQA/skills/ppt-generator/generate_ppt.py \
  --output /Users/gyeong/Documents/AIQA/outputs/presentation.pptx \
  --style professional \
  --color blue << 'EOF'
Slide 1: [제목 슬라이드]
제목: AI 시대의 개발자 역량
부제: 미래를 준비하는 필수 스킬

Slide 2: [목차]
• AI 기술의 발전
• 개발자 역할의 변화
• 필수 역량
• 학습 전략

Slide 3: [도입]
제목: AI 시대가 온다
• ChatGPT, GitHub Copilot 등장
• 개발 패러다임의 변화
• 새로운 기회와 도전
EOF
```

**Script Parameters:**
- `--output`: Output file path (.pptx)
- `--style`: Presentation style (professional, minimal, creative)
- `--color`: Color theme (blue, green, purple, orange)
- Content via STDIN: Structured slide content

### Step 4: Provide Download Link

After generation, show user:
```
✅ PPT가 생성되었습니다!

[Download Presentation](file:///Users/gyeong/Documents/AIQA/outputs/presentation.pptx)

슬라이드 수: 12장
스타일: Professional
컬러 테마: Blue
```

## Slide Types and Formats

### Type 1: Title Slide
```
Slide X: [제목 슬라이드]
제목: 메인 제목
부제: 서브 타이틀
```

### Type 2: Table of Contents
```
Slide X: [목차]
• 항목 1
• 항목 2
• 항목 3
```

### Type 3: Content Slide (Bullet Points)
```
Slide X: [본문]
제목: 슬라이드 제목
• 포인트 1
• 포인트 2
  - 서브 포인트 2-1
  - 서브 포인트 2-2
• 포인트 3
```

### Type 4: Two Column Layout
```
Slide X: [2단 레이아웃]
제목: 비교 분석

[왼쪽]
• 전통적 개발
• 수동 코딩
• 긴 개발 시간

[오른쪽]
• AI 보조 개발
• 자동 완성
• 빠른 프로토타이핑
```

### Type 5: Quote/Highlight Slide
```
Slide X: [인용]
"AI는 개발자를 대체하는 것이 아니라,
AI를 활용하는 개발자가 그렇지 않은 개발자를 대체한다"
- 출처/저자명
```

### Type 6: Summary/Conclusion
```
Slide X: [요약]
제목: 핵심 요약
1. 첫 번째 핵심 내용
2. 두 번째 핵심 내용
3. 세 번째 핵심 내용
```

## Color Themes

### Blue Theme (Default)
- Primary: #2E5090
- Secondary: #4A90E2
- Accent: #7CB9E8
- Background: #F0F4F8

### Green Theme
- Primary: #2D5F3F
- Secondary: #4CAF50
- Accent: #81C784
- Background: #F1F8F4

### Purple Theme
- Primary: #5E35B1
- Secondary: #7E57C2
- Accent: #B39DDB
- Background: #F3F0F8

### Orange Theme
- Primary: #D84315
- Secondary: #FF7043
- Accent: #FFAB91
- Background: #FFF3E0

## Design Styles

### Professional
- Clean layouts with clear hierarchy
- Conservative color palette
- Standard fonts (맑은 고딕, Arial)
- Suitable for business presentations

### Minimal
- Maximum white space
- Minimal text per slide
- Large, bold typography
- Modern and clean aesthetic

### Creative
- Asymmetric layouts
- Bold color combinations
- Visual emphasis on key points
- Suitable for pitches and showcases

## Content Guidelines

### Best Practices
- **Title**: Keep under 50 characters
- **Bullet Points**: 3-5 per slide maximum
- **Text Length**: Each bullet under 100 characters
- **Hierarchy**: Use 2 levels of bullets maximum
- **Consistency**: Maintain consistent formatting

### Good Slide Example
```
Slide 5: [본문]
제목: AI 도구 활용 능력

• GitHub Copilot
  - 코드 자동 완성
  - 컨텍스트 기반 제안

• ChatGPT
  - 문제 해결 지원
  - 코드 리뷰
```
✓ Clear title
✓ 2 main points with sub-points
✓ Concise text
✓ Proper hierarchy

### Bad Slide Example
```
Slide 5: 인공지능 시대에 개발자들이 반드시 알아야 할 도구들
• GitHub Copilot은 Visual Studio Code와 JetBrains IDE에서 사용할 수 있는 AI 기반 코드 완성 도구입니다
• ChatGPT는 OpenAI에서 개발한 대화형 AI로 프로그래밍 질문에 답변하고 코드를 생성할 수 있습니다
• Midjourney는 텍스트를 이미지로 변환하는 AI 도구입니다
• DALL-E는 OpenAI의 이미지 생성 모델입니다
• Stable Diffusion은 오픈소스 이미지 생성 모델입니다
```
✗ Title too long
✗ Too many bullet points (5)
✗ Each bullet too long
✗ Information overload

## Technical Details

### PowerPoint Specifications
- Slide size: 16:9 widescreen (standard)
- Font: 맑은 고딕 (Korean), Arial (English)
- Title font size: 44pt
- Body font size: 24pt
- Bullet font size: 20pt

### Dependencies
```bash
pip install python-pptx
```

### File Structure
```
skills/ppt-generator/
├── SKILL.md              # This file
├── README.md             # User guide
├── generate_ppt.py       # Main generator script
└── templates/            # Template designs
    ├── professional.json
    ├── minimal.json
    └── creative.json
```

## Example Workflows

### Example 1: Business Presentation
User request: "AI 마케팅 전략 PPT 15장 만들어줘"

Claude response:
1. Confirm topic and get preferences
2. Generate outline with 15 slides
3. Create content following structure:
   - Title (1)
   - Table of Contents (1)
   - Introduction (2)
   - Main Content (9)
   - Summary (1)
   - Q&A (1)
4. Run generate_ppt.py
5. Provide download link

Total time: ~60 seconds

### Example 2: Technical Presentation
User request: "Next.js 14 신기능 소개 PPT 만들어줘, 미니멀 스타일로"

Claude response:
1. Get preferences (10 slides, minimal style, green theme)
2. Generate technical outline
3. Create slides with:
   - Code examples in monospace
   - Before/After comparisons
   - Feature highlights
4. Run generate_ppt.py with minimal style
5. Provide download link

Total time: ~60 seconds

## Error Handling

If content generation fails:
- Verify python-pptx is installed
- Check output directory exists
- Ensure proper slide format in input
- Validate color theme and style parameters

## Advanced Features

### Custom Templates
Users can provide custom templates:
```bash
python generate_ppt.py \
  --template /path/to/template.pptx \
  --output presentation.pptx
```

### Image Integration (Future)
```
Slide X: [이미지]
제목: 아키텍처 다이어그램
이미지: /path/to/diagram.png
설명: 마이크로서비스 구조
```

### Chart Support (Future)
```
Slide X: [차트]
제목: 사용자 성장
타입: line
데이터: [100, 150, 200, 300, 450]
라벨: [1월, 2월, 3월, 4월, 5월]
```

## Tips for Better Presentations

1. **Start with Structure**: Plan outline before content
2. **One Idea per Slide**: Don't overload slides
3. **Visual Hierarchy**: Use size and color to guide attention
4. **Consistency**: Maintain style throughout
5. **Readability**: Ensure text is readable from distance
6. **Balance**: Mix text slides with visuals
7. **Story Flow**: Create narrative progression

## Related Skills

- **card-news-generator**: For social media content
- **web-to-markdown**: For research and content sourcing
- **landing-page-guide**: For web presentation versions

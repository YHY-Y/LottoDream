# 꿈결로또

꿈 내용을 Google Gemini로 구조화해 해석하고, 추출한 상징을 **서버와 분리된 TypeScript 알고리즘**으로 로또 6/45 번호에 연결하는 한국어 웹 서비스입니다. Next.js App Router, TypeScript, Tailwind CSS를 사용하며 Vercel 배포를 기준으로 설계했습니다.

> 꿈 해몽과 번호 추천은 오락용입니다. 모든 유효한 번호 조합의 당첨 확률은 동일합니다.

## 주요 기능

- Gemini의 JSON Schema 출력 + Zod 이중 검증
- 프롬프트 인젝션을 완화하는 데이터 경계 및 시스템 지침
- 상징 기반 1게임/5게임 번호 생성, 재생성·복사·Web Share (재생성 시 AI 재호출 없음)
- 개발 전용 Mock, 오류/타임아웃/키 미설정 안내
- Upstash Redis REST 기반 IP 일일 제한(기본 5회)
- 반응형·키보드 접근 가능한 UI, 입력 임시 보존
- Metadata API, canonical, Open Graph, robots, sitemap, 고유 콘텐츠 5종
- 개인정보·약관·면책·문의 페이지와 비활성 광고 슬롯

## 로컬 설치

Node.js 20 이상이 필요합니다.

```bash
npm install
cp .env.example .env.local
npm run dev
```

`http://localhost:3000`을 엽니다. API 키 없이 UI를 확인하려면 `.env.local`에서 `USE_MOCK_AI=true`를 사용하세요. Mock은 `NODE_ENV=production`에서는 무조건 비활성화됩니다.

## Gemini 설정

1. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 API 키를 발급합니다.
2. 키를 `.env.local`의 `GEMINI_API_KEY`에만 저장합니다.
3. `GEMINI_MODEL`을 배포 지역과 계정에서 사용 가능한 저비용 모델로 설정합니다. 기본값은 `gemini-2.5-flash-lite`입니다.

프로젝트는 Google의 현재 JavaScript SDK인 `@google/genai`와 `generateContent`의 구조화 출력 기능을 사용합니다. 모델 수명 주기와 사용 가능 여부는 배포 직전 [공식 모델 문서](https://ai.google.dev/gemini-api/docs/models)에서 다시 확인하세요. 키를 `NEXT_PUBLIC_` 변수에 절대 넣지 마세요.

## 환경 변수

| 변수 | 용도 |
|---|---|
| `GEMINI_API_KEY` | 서버 전용 Gemini 키 |
| `GEMINI_MODEL` | 교체 가능한 모델명 |
| `NEXT_PUBLIC_SITE_URL` | canonical/sitemap용 실제 `https://` 도메인 |
| `USE_MOCK_AI` | 개발에서만 Mock 사용 |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | 영속 요청 제한 저장소 |
| `DAILY_AI_LIMIT` | 사용자별 일일 요청 수, 기본 5 |
| `RATE_LIMIT_SALT` | 식별자 HMAC용 32자 이상 비밀값 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 공개 문의 주소 |

개발에서는 Redis가 없어도 진행할 수 있으나, **프로덕션에서는 Redis와 유효한 salt가 없으면 API가 503으로 닫힙니다.** 메모리 제한을 운영 보안으로 가장하지 않기 위한 의도적인 fail-closed 정책입니다. Upstash 무료 플랜으로 시작할 수 있으며, 다른 저장소를 쓸 경우 `lib/security/rate-limit.ts`를 교체하세요.

## 검사

```bash
npm test
npm run typecheck
npm run build
```

실제 Gemini 호출은 API 키와 쿼터가 필요한 통합 테스트이므로 자동 단위 테스트에는 포함하지 않습니다. 개발 Mock으로 UI 흐름을 확인한 뒤, 스테이징에서 실제 키로 요청/스키마 오류/쿼터 오류를 확인하세요.

## Vercel 배포

1. 저장소를 GitHub에 push하고 Vercel에서 **New Project → Import** 합니다.
2. Framework Preset이 Next.js인지 확인합니다.
3. Production 환경 변수에 `.env.example` 항목을 입력하되 `USE_MOCK_AI`는 넣지 않습니다.
4. Upstash Redis를 준비하고 REST URL/token과 강한 `RATE_LIMIT_SALT`를 설정합니다.
5. 첫 배포 URL로 `NEXT_PUBLIC_SITE_URL`을 갱신한 뒤 다시 배포합니다.
6. 도메인 연결 후 `/robots.txt`, `/sitemap.xml`, canonical, 모바일 화면과 실제 AI 요청을 확인합니다.

## 운영 전 체크리스트

- Gemini 모델/가격/무료 쿼터 및 Google 데이터 처리 조건 재확인
- 도메인, 문의 이메일, 운영자 정보 및 개인정보처리방침의 국외 이전 세부사항 확정
- Redis 제한 키 만료와 프록시 헤더가 실제 Vercel 환경에서 정상인지 점검
- 모니터링/예산 알림 설정, 악용 패턴에 따라 WAF 또는 CAPTCHA 검토
- 실제 기기 접근성·공유·클립보드 테스트 및 Search Console 등록
- AdSense 승인 후에만 광고 컴포넌트를 활성화하고 입력/CTA와 충분한 거리 유지

광고 슬롯은 현재 숨겨져 있으며 광고 SDK나 추적 코드는 포함하지 않습니다. 공개 배포와 유료 서비스 활성화는 별도의 수동 작업입니다.

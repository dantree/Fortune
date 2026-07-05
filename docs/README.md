# Fortune Tool — MBTI × 오행 궁합 테스트

에버그린 도구형 콘텐츠 (모듈 A) · AdSense 수익화 · Blogspot 연동

| 항목 | 내용 |
|------|------|
| 서비스 URL (예정) | `https://saju.kaltaelee.com` |
| 설계 버전 | v0.1 |
| 작성일 | 2026-07-05 |

---

## 문서 목록

### 1. 화면 설계

| # | 문서 | 설명 |
|---|------|------|
| 1 | [화면정의서](./01-screen-design/01-화면정의서.md) | SCR-00~02, MOD-01, 광고 슬롯, 필드 검증 |
| 2 | [화면흐름도](./01-screen-design/02-화면흐름도.md) | User Journey, State Machine, 트래픽 루프 |
| 3 | [UI 와이어프레임](./01-screen-design/03-UI-와이어프레임.md) | ASCII 와이어, 반응형, iframe 모드 |

### 2. 시스템 구성

| # | 문서 | 설명 |
|---|------|------|
| 1 | [하드웨어 구성도](./02-system-architecture/01-하드웨어-구성도.md) | 서버리스, GitHub Pages, AdSense |
| 2 | [네트워크 구성도](./02-system-architecture/02-네트워크-구성도.md) | DNS, SSL, CORS, UTM, iframe |
| 3 | [소프트웨어 아키텍처](./02-system-architecture/03-소프트웨어-아키텍처.md) | 레이어, 파일 구조, 계산 알고리즘 |

### 3. 인터페이스

| # | 문서 | 설명 |
|---|------|------|
| 1 | [인터페이스 설계서](./03-interface/01-인터페이스-설계서.md) | DTO, API, Storage, AdSense, postMessage |

---

## 다음 단계

1. **v0.1 프로토타입** — `index.html` 단일 파일 (입력 → 로딩 → 결과)
2. **광고 placeholder** — `#ad-top`, `#ad-loading`, `#ad-result` div
3. **GitHub Pages + CNAME** — `saju.kaltaelee.com`
4. **AdSense 코드 삽입** — kaltaelee.com 서브도메인 등록
5. **Blogspot iframe** — `?embed=1` + postMessage

---

## 설계 결정 요약

| 결정 | 선택 | 이유 |
|------|------|------|
| 호스팅 | GitHub Pages + 서브도메인 | 무료, AdSense 기존 승인 활용 |
| 프레임워크 | Vanilla JS | 에버그린, 경량, iframe 호환 |
| 라우팅 | Hash SPA | Pages SPA support |
| 데이터 | 전량 내장 | 모듈 A (데이터 자급, 무갱신) |
| 수익 | 3단 광고 (로딩·결과·앵커) | 도구형 RPM 극대화 |

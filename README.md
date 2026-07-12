# 운세리 (Fortune)

에버그린 도구형 콘텐츠 · GitHub Pages · `saju.kaltaelee.com`

**결정론적 계산** — 같은 생년월일·MBTI → 항상 같은 결과 (랜덤 없음)

## 도구 목록

| 도구 | 경로 |
|------|------|
| 홈 (후킹·메뉴) | `/index.html` |
| 오늘의 운세 · 로또 | `/tools/today.html` |
| MBTI × 오행 궁합 | `/mbti-oheng.html` |
| 내 일주 · 시주 | `/tools/ilju.html` |
| 띠 궁합 | `/tools/ddi-compat.html` |
| 계산 검증 | `/tests/verify.html` |

새 도구 추가: `js/site.js`의 `TOOLS` 배열에 항목을 넣고 `tools/`에 페이지를 만들면 홈·하단 메뉴에 자동 반영됩니다.

## 로컬 미리보기

```bash
cd Fortune
python3 -m http.server 8080
# http://localhost:8080
```

## 계산 기준

[docs/CALCULATION.md](./docs/CALCULATION.md) — 만세력 JDN, 입춘 2/4, 엔진 v1.0

## GitHub Pages 배포

1. GitHub에 `Fortune` 저장소 push
2. **Settings → Pages → Source**: Deploy from branch `main`, folder `/ (root)`
3. **Custom domain**: `saju.kaltaelee.com`

## Blogspot iframe

```html
<iframe
  src="https://saju.kaltaelee.com/mbti-oheng.html?embed=1"
  width="100%"
  height="720"
  style="border:none;max-width:480px;display:block;margin:0 auto;">
</iframe>
```

## 설계 문서

[docs/README.md](./docs/README.md)

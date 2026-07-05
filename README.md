# MBTI × 오행 궁합 테스트

에버그린 도구형 콘텐츠 · GitHub Pages · `saju.kaltaelee.com`

## 로컬 미리보기

```bash
cd Fortune
python3 -m http.server 8080
# http://localhost:8080
```

## GitHub Pages 배포

1. GitHub에 `Fortune` 저장소 push
2. **Settings → Pages → Source**: Deploy from branch `main`, folder `/ (root)`
3. **Custom domain**: `saju.kaltaelee.com` 입력
4. DNS에 CNAME 추가 (아래 참고)

## DNS 설정 (kaltaelee.com)

| 호스트 | 타입 | 값 |
|--------|------|-----|
| `saju` | CNAME | `[username].github.io` |

추가 비용 없음 — 기존 도메인의 서브도메인만 추가.

## AdSense 연결

1. [AdSense](https://www.google.com/adsense) → **사이트** → `saju.kaltaelee.com` 추가
2. `index.html` head의 AdSense script 주석 해제 + `ca-pub-XXXX` 교체
3. `#ad-top`, `#ad-loading`, `#ad-result` 슬롯에 광고 단위 코드 삽입

## Blogspot iframe

```html
<iframe
  src="https://saju.kaltaelee.com/?embed=1"
  width="100%"
  height="720"
  style="border:none;max-width:480px;display:block;margin:0 auto;">
</iframe>
```

## 설계 문서

[docs/README.md](./docs/README.md)

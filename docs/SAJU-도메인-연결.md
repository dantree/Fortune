# saju.kaltaelee.com 연결 가이드

> **추가 비용 0원** — `kaltaelee.com`을 이미 갖고 있으면 DNS에 CNAME 한 줄만 추가하면 됩니다.

---

## 전체 흐름 (4단계)

```
① GitHub에 코드 올리기
        ↓
② GitHub Pages 켜기
        ↓
③ DNS에 saju → github.io 연결
        ↓
④ GitHub에 saju.kaltaelee.com 등록 → HTTPS
```

완료 후: **https://saju.kaltaelee.com**

---

## STEP 1. GitHub 저장소 만들기 & 코드 올리기

### 1-1. GitHub에서 저장소 생성

1. https://github.com/new 접속
2. Repository name: `Fortune` (또는 원하는 이름)
3. **Public** 선택 → Create repository

### 1-2. 터미널에서 push

> GitHub 아이디가 `dantree`가 아니면 URL만 본인 아이디로 바꾸세요.

```bash
cd /Users/kaltaelee/Code/Fortune

git init
git add .
git commit -m "MBTI x 오행 궁합 테스트 v0.1"
git branch -M main
git remote add origin https://github.com/dantree/Fortune.git
git push -u origin main
```

로그인 창이 뜨면 GitHub 계정으로 인증합니다.

---

## STEP 2. GitHub Pages 켜기

1. GitHub → `Fortune` 저장소 → **Settings**
2. 왼쪽 **Pages**
3. **Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**
4. **Save**

1~2분 후 임시 주소로 확인:

**https://dantree.github.io/Fortune/**

(아이디·저장소명에 맞게 URL 변경)

---

## STEP 3. DNS 설정 (kaltaelee.com)

도메인을 산 곳(가비아, Cloudflare, Namecheap 등)에 로그인 → **DNS 관리**

### 추가할 레코드

| 호스트 (이름) | 타입 | 값 (가리키는 곳) | TTL |
|--------------|------|-----------------|-----|
| `saju` | **CNAME** | `dantree.github.io` | 3600 |

### 등록 예시

| 서비스 | 입력 방법 |
|--------|----------|
| **가비아** | 호스트: `saju` / 타입: CNAME / 값: `dantree.github.io` |
| **Cloudflare** | Name: `saju` / CNAME / Target: `dantree.github.io` — **프록시 끄기(회색 구름)** 권장 |
| **Google Domains** | Custom resource records → `saju` CNAME `dantree.github.io` |

### 주의

- `saju.kaltaelee.com` 전체를 넣지 말고, 호스트란에는 **`saju`만**
- 값에는 **`https://` 붙이지 않음**
- CNAME 값은 **`dantree.github.io`** (저장소 이름 Fortune 아님!)

---

## STEP 4. GitHub에 커스텀 도메인 등록

1. GitHub → `Fortune` → **Settings** → **Pages**
2. **Custom domain** 입력: `saju.kaltaelee.com`
3. **Save**
4. **Enforce HTTPS** 체크 (DNS 전파 후 활성화됨)

프로젝트 루트의 `CNAME` 파일에 이미 `saju.kaltaelee.com` 이 들어 있어서 push하면 GitHub가 자동 인식합니다.

### DNS 확인 대기

- 보통 **10분 ~ 24시간** (대부분 30분 이내)
- GitHub Pages 화면에 **DNS check successful** 뜨면 OK
- 처음엔 "Not yet configured" → 기다리면 녹색 체크로 바뀜

### 접속 테스트

브라우저에서:

**https://saju.kaltaelee.com**

궁합 테스트 화면이 뜨면 성공.

---

## STEP 5. AdSense 연결 (선택, 나중에 해도 됨)

`kaltaelee.com`이 이미 AdSense 승인되어 있다면:

1. [AdSense](https://www.google.com/adsense) → **사이트** → **사이트 추가**
2. `saju.kaltaelee.com` 입력
3. **광고** → **광고 단위** → 반응형 디스플레이 3개 생성
4. `config.js` 수정:

```javascript
adsense: {
  enabled: true,
  client: 'ca-pub-XXXXXXXXXXXXXXXX',
  slots: {
    top: '슬롯ID1',
    loading: '슬롯ID2',
    result: '슬롯ID3'
  }
}
```

5. GitHub에 push → 1~2분 후 사이트에 반영

**앵커 광고(하단 띠):** AdSense 대시보드 → 앵커 광고 → `saju.kaltaelee.com` 선택

---

## STEP 6. 블로그스팟에서 연결

글 HTML 보기에 링크 또는 iframe:

```html
<a href="https://saju.kaltaelee.com?utm_source=blogspot&utm_medium=link">
  🔮 MBTI × 오행 궁합 테스트
</a>
```

또는:

```html
<iframe
  src="https://saju.kaltaelee.com/?embed=1"
  width="100%"
  height="720"
  style="border:none;max-width:480px;display:block;margin:0 auto;">
</iframe>
```

---

## 문제 해결

| 증상 | 해결 |
|------|------|
| DNS check 실패 | CNAME 값이 `아이디.github.io`인지 확인, 30분 더 대기 |
| HTTPS 체크 안 됨 | DNS 전파 후 24시간까지 대기, Enforce HTTPS 다시 시도 |
| 404 Not Found | Pages branch가 `main` / root인지 확인 |
| Cloudflare 오류 | saju CNAME **프록시 끄기**(DNS only) |
| 예전 주소로 리다이렉트 | 브라우저 캐시 삭제 또는 시크릿 모드 |

---

## 체크리스트

- [ ] GitHub push 완료
- [ ] `https://아이디.github.io/Fortune/` 접속 OK
- [ ] DNS CNAME `saju` → `아이디.github.io` 추가
- [ ] GitHub Pages Custom domain `saju.kaltaelee.com` 저장
- [ ] `https://saju.kaltaelee.com` 접속 OK
- [ ] (선택) AdSense 사이트 추가
- [ ] (선택) 블로그스팟 글에 링크/iframe

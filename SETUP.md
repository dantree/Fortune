# 3단계만 하면 끝

## ① 지금 — 로컬에서 테스트

터미널:

```bash
cd /Users/kaltaelee/Code/Fortune
python3 -m http.server 8080
```

브라우저: **http://localhost:8080**

생년월일 + MBTI 넣고 결과 나오면 OK.

---

## ② GitHub에 올리기 (인터넷에 공개)

1. https://github.com/new → 저장소 이름 `Fortune` → Create
2. 터미널:

```bash
cd /Users/kaltaelee/Code/Fortune
git init
git add .
git commit -m "MBTI x 오행 궁합 테스트 v0.1"
git branch -M main
git remote add origin https://github.com/dantree/Fortune.git
git push -u origin main
```

(GitHub 아이디가 `dantree`가 아니면 URL만 바꾸세요)

3. GitHub → **Settings → Pages**
   - Source: **Deploy from branch**
   - Branch: **main** / **/ (root)**
   - Save

4. 1~2분 후 접속: `https://dantree.github.io/Fortune/`

---

## ③ 도메인 연결 (saju.kaltaelee.com)

1. **도메인 관리 페이지** (가비아, Cloudflare 등) → DNS 추가:

   | 호스트 | 타입 | 값 |
   |--------|------|-----|
   | saju | CNAME | dantree.github.io |

2. GitHub → Fortune → Settings → Pages → **Custom domain**
   → `saju.kaltaelee.com` 입력 → Save

3. 10~30분 후: **https://saju.kaltaelee.com**

---

## AdSense (나중에 해도 됨)

1. AdSense → **사이트** → `saju.kaltaelee.com` 추가
2. **광고 단위** 3개 만들기 (반응형)
3. `config.js` 열기:

```javascript
adsense: {
  enabled: true,
  client: 'ca-pub-여기에본인ID',
  slots: {
    top: '슬롯ID1',
    loading: '슬롯ID2',
    result: '슬롯ID3'
  }
}
```

4. GitHub에 push → 끝

---

## 블로그스팟 글

1. 글 쓰기 → **HTML 보기**
2. `blogspot/붙여넣기.html` 내용 복사 → 붙여넣기
3. 게시

끝.

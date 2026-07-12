# 운세리 — 검색엔진 등록 가이드

사이트: **https://saju.kaltaelee.com**  
브랜드: **운세리**

`robots.txt` · `sitemap.xml` 은 이미 올려 두었습니다.  
아래는 **각 콘솔에서 직접 한 번만** 하면 되는 등록 절차입니다.

---

## 1. Google Search Console

1. [Google Search Console](https://search.google.com/search-console) 접속
2. **속성 추가** → URL 접두어 → `https://saju.kaltaelee.com`
3. 소유권 확인 (택 1)
   - **HTML 태그**: 안내된 `<meta name="google-site-verification" …>` 를 `index.html` `<head>`에 넣고 push
   - **HTML 파일**: 안내된 파일을 저장소 루트에 넣고 push
   - **DNS**: `kaltaelee.com` DNS에 TXT 레코드
4. 확인 후 **Sitemaps** → `https://saju.kaltaelee.com/sitemap.xml` 제출

---

## 2. 네이버 서치어드바이저

1. [네이버 서치어드바이저](https://searchadvisor.naver.com/) 접속 · 로그인
2. 사이트 `https://saju.kaltaelee.com` 선택 (소유 확인 완료 후)
3. 왼쪽 **요청** 메뉴
4. **사이트맵 제출**에 아래 주소 그대로 입력 후 확인  
   `https://saju.kaltaelee.com/sitemap.xml`
5. **RSS 제출**에 아래 주소 입력 후 확인  
   `https://saju.kaltaelee.com/rss.xml`

> 사이트맵 = 어떤 페이지가 있는지 목록  
> RSS = 네이버가 주기적으로 훑어볼 최신 글/도구 피드  
> 둘 다 “파일을 만드는 것”은 이미 됐고, 콘솔에 **URL만 붙여 넣으면** 됩니다.

브라우저에서 먼저 열어 보세요.

- https://saju.kaltaelee.com/sitemap.xml
- https://saju.kaltaelee.com/rss.xml

XML이 보이면 정상입니다. 그다음 네이버에 제출하세요.

---

## 3. Bing Webmaster Tools

1. [Bing Webmaster](https://www.bing.com/webmasters) 접속
2. 사이트 추가 → `https://saju.kaltaelee.com`
3. 소유 확인 (HTML / meta / DNS) 또는 **Google Search Console로 가져오기**
4. Sitemaps → `sitemap.xml` 제출

---

## 확인 체크

- [ ] https://saju.kaltaelee.com/robots.txt 접속됨
- [ ] https://saju.kaltaelee.com/sitemap.xml 접속됨
- [ ] 홈 타이틀·푸터에 **운세리** 표시
- [ ] 세 콘솔에 사이트맵 제출 완료

소유권용 meta/파일 코드가 나오면 알려주시면 `index.html`에 바로 넣어 드리겠습니다.

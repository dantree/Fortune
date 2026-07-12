# 사주칼퇴리 — 검색엔진 등록 가이드

사이트: **https://saju.kaltaelee.com**  
브랜드: **사주칼퇴리**

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
2. **웹마스터 도구** → 사이트 추가 → `https://saju.kaltaelee.com`
3. 소유 확인 (HTML 파일 또는 meta 태그 — Google과 동일하게 루트/`index.html`에 반영 후 push)
4. **요청** → 사이트맵 제출: `https://saju.kaltaelee.com/sitemap.xml`
5. (선택) RSS가 있으면 함께 등록. 지금은 사이트맵만으로 충분합니다.

> 네이버는 수집이 느릴 수 있어요. 블로그·카페에 `사주칼퇴리` + 링크를 꾸준히 거는 편이 도움이 됩니다.

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
- [ ] 홈 타이틀·푸터에 **사주칼퇴리** 표시
- [ ] 세 콘솔에 사이트맵 제출 완료

소유권용 meta/파일 코드가 나오면 알려주시면 `index.html`에 바로 넣어 드리겠습니다.

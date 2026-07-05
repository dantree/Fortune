/**
 * ★★★ 여기만 수정하세요 ★★★
 */
window.FORTUNE_CONFIG = {
  // 도구 주소 (배포 후 그대로 두면 됨)
  siteUrl: 'https://saju.kaltaelee.com',

  // 블로그스팟 주소 → 결과 화면 "더 깊은 해설" 링크
  blogUrl: 'https://kaltaelee.com',

  // AdSense — 아직이면 enabled: false 그대로 두세요
  adsense: {
    enabled: false,
    client: 'ca-pub-XXXXXXXXXXXXXXXX', // AdSense → 계정 → pub-ID
    slots: {
      top: '',      // 입력 화면 광고 슬롯 ID
      loading: '',  // 로딩 화면
      result: ''    // 결과 화면
    }
  }
};

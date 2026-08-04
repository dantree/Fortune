/**
 * 사이트 공통 — 도구 목록·네비게이션
 * 새 도구: TOOLS에 추가 → 홈 그리드·하단 메뉴 반영
 */
(function (global) {
  'use strict';

  var BRAND =
    (global.FORTUNE_CONFIG && global.FORTUNE_CONFIG.brandName) || '운세리';

  var TOOLS = [
    { id: 'home', title: '홈', desc: '', href: 'index.html', nav: '홈', public: false },
    {
      id: 'total-today',
      title: '오늘의 총운',
      desc: '사주·띠·별자리 종합',
      href: 'tools/total-today.html',
      emoji: '☀️',
      tag: '추천',
      nav: '오늘',
      public: true,
      hub: false,
      group: 'today'
    },
    {
      id: 'today',
      title: '오늘의 운세·로또',
      desc: '생활 운세 · 추천 번호',
      href: 'tools/today.html',
      emoji: '🎱',
      tag: '로또',
      nav: null,
      public: true,
      hub: true,
      group: 'today'
    },
    {
      id: 'card',
      title: '오늘의 카드',
      desc: '키워드 한 장 · 스토리 공유 이미지',
      href: 'tools/daily-card.html',
      emoji: '🃏',
      tag: 'REVEAL',
      nav: null,
      public: true,
      hub: true,
      group: 'today'
    },
    {
      id: 'year-fortune',
      title: '올해 운세',
      desc: '신년·세운 · 직장·애정·재물',
      href: 'tools/year-fortune.html',
      emoji: '🌅',
      tag: '신년',
      nav: null,
      public: true,
      hub: true,
      group: 'year'
    },
    {
      id: 'mbti-oheng',
      title: 'MBTI 궁합',
      desc: '예: ENFP×INFJ 궁합 점수',
      href: 'mbti-oheng.html',
      emoji: '✨',
      tag: '인기',
      nav: '궁합',
      public: true,
      group: 'compat'
    },
    {
      id: 'ddi',
      title: '띠 궁합',
      desc: '육합·삼합·상충 한눈에',
      href: 'tools/ddi-compat.html',
      emoji: '🐉',
      tag: '12띠',
      nav: null,
      public: true,
      group: 'compat'
    },
    {
      id: 'full-saju',
      title: '풀사주',
      desc: '이름·생시 → 인생 4운 풀이',
      href: 'tools/full-saju.html',
      emoji: '📖',
      tag: '원국',
      nav: null,
      public: true,
      group: 'me'
    },
    {
      id: 'ilju',
      title: '내 일주·시주',
      desc: '양력·음력·시간으로 내 기둥',
      href: 'tools/ilju.html',
      emoji: '📅',
      tag: 'NEW',
      nav: '일주',
      public: true,
      group: 'me'
    },
    {
      id: 'oheng-me',
      title: '내 오행 성격',
      desc: '일간으로 보는 기질·강점',
      href: 'tools/oheng-me.html',
      emoji: '🌿',
      tag: '성격',
      nav: null,
      public: true,
      group: 'me'
    },
    {
      id: 'star',
      title: '별자리',
      desc: '성격 + 오늘의 별자리 한 줄',
      href: 'tools/star-sign.html',
      emoji: '⭐',
      tag: '12궁',
      nav: null,
      public: true,
      group: 'me'
    },
    {
      id: 'dream',
      title: '꿈해몽',
      desc: '뱀·물·돈… 키워드만 적으면',
      href: 'tools/dream.html',
      emoji: '🌙',
      tag: '인기',
      nav: null,
      public: true,
      hub: true,
      group: 'life'
    },
    {
      id: 'name-reading',
      title: '이름 풀이',
      desc: '한자 이름 그대로 입력 · 획수',
      href: 'tools/name-reading.html',
      emoji: '✍️',
      tag: 'NEW',
      nav: null,
      public: true,
      hub: true,
      group: 'life'
    },
    {
      id: 'verify',
      title: '계산 검증',
      desc: '개발용',
      href: 'tests/verify.html',
      emoji: '🧪',
      nav: null,
      public: false
    }
  ];

  /* 홈 허브 노출 순서 (인기순) */
  var GROUPS = [
    { id: 'year', label: '올해 · 신년' },
    { id: 'life', label: '일상 풀이' },
    { id: 'me', label: '나에 대해' },
    { id: 'compat', label: '궁합' },
    { id: 'today', label: '오늘' }
  ];

  function basePrefix() {
    var path = (global.location && global.location.pathname) || '';
    if (/\/(tools|tests)\//.test(path)) return '../';
    return '';
  }

  function resolveHref(href) {
    var base = basePrefix();
    if (!base) return href;
    if (href.indexOf('tools/') === 0 || href.indexOf('tests/') === 0) return base + href;
    return base + href;
  }

  function publicTools() {
    return TOOLS.filter(function (t) { return t.public; });
  }

  function navTools() {
    return TOOLS.filter(function (t) { return t.nav; });
  }

  function injectStyles() {
    if (global.document.getElementById('site-nav-styles')) return;
    var css = [
      '.site-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;}',
      '.site-brand{font-size:15px;font-weight:850;color:#6b4eff;text-decoration:none;letter-spacing:-0.02em;}',
      '.site-back{font-size:13px;color:#6b7280;text-decoration:none;}',
      '.site-hub{display:flex;flex-direction:column;gap:14px;margin-top:2px;}',
      '.site-group-label{font-size:12px;font-weight:700;color:#6b7280;margin:0 0 8px;}',
      '.site-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
      '.site-grid-1{grid-template-columns:1fr;}',
      '.site-grid a{display:flex;flex-direction:column;gap:4px;background:#fff;border-radius:14px;',
      'padding:14px;box-shadow:0 4px 18px rgba(107,78,255,.1);text-decoration:none;color:inherit;min-height:96px;}',
      '.site-grid a:active{transform:scale(.98);}',
      '.site-grid .emoji{font-size:22px;line-height:1;}',
      '.site-grid strong{font-size:14px;font-weight:800;}',
      '.site-grid span{font-size:12px;color:#6b7280;line-height:1.35;}',
      '.site-grid .tag{align-self:flex-start;margin-top:auto;font-size:10px;font-weight:700;',
      'color:#6b4eff;background:#ede9fe;padding:2px 7px;border-radius:6px;}',
      '.site-bottom{position:fixed;left:0;right:0;bottom:0;z-index:40;',
      'background:rgba(255,255,255,.94);backdrop-filter:blur(10px);',
      'border-top:1px solid #e5e7eb;padding:8px 8px calc(8px + env(safe-area-inset-bottom));}',
      '.site-bottom-inner{max-width:520px;margin:0 auto;display:flex;justify-content:space-around;}',
      '.site-bottom a{flex:1;text-align:center;text-decoration:none;color:#6b7280;',
      'font-size:11px;font-weight:600;padding:8px 4px;border-radius:10px;}',
      '.site-bottom a.active{color:#6b4eff;background:#ede9fe;}',
      'body.has-site-nav{padding-bottom:72px;}',
      '.consult-cta{display:block;margin:12px 0;padding:15px 16px 14px;border-radius:14px;',
      'background:#fff;color:#1a1a2e;box-shadow:0 4px 18px rgba(107,78,255,.1);',
      'text-decoration:none;border:1px solid #e9e5ff;}',
      '.consult-cta .eyebrow{font-size:11px;font-weight:800;color:#6b4eff;letter-spacing:.03em;margin-bottom:6px;}',
      '.consult-cta .line{font-size:15px;font-weight:800;line-height:1.5;letter-spacing:-0.02em;margin:0 0 12px;color:#1a1a2e;}',
      '.consult-cta .go{display:inline-block;font-size:13px;font-weight:850;padding:10px 14px;border-radius:999px;',
      'background:#6b4eff;color:#fff;}'
    ].join('');
    var style = global.document.createElement('style');
    style.id = 'site-nav-styles';
    style.textContent = css;
    global.document.head.appendChild(style);
  }

  function consultUrl() {
    var cfg = global.FORTUNE_CONFIG || {};
    return cfg.kakaoOpenChat || 'https://open.kakao.com/o/sOGOK2Gi';
  }

  /**
   * 카톡 1:1 상담 CTA
   * @param {string|Element} target
   * @param {'home'|'result'} variant
   */
  function mountConsult(target, variant) {
    injectStyles();
    var url = consultUrl();
    if (!url) return;
    var el = typeof target === 'string'
      ? global.document.getElementById(target.replace(/^#/, ''))
      : target;
    if (!el) return;

    var copy = variant === 'result'
      ? {
        eyebrow: '8월 한달 무료 · 사주 1:1',
        line: '점수는 힌트일 뿐이에요. 내 사주 안에서 「그래서 나는 어떻게 판단하면 되지?」가 남았다면, 그 한 줄만 카톡으로 보내주세요.',
        go: '무료로 카톡 상담받기'
      }
      : {
        eyebrow: '8월 한달 무료 · 운명 × 사주',
        line: '사주로 내 운명의 결을 알면, 같은 상황에서도 더 맞는 판단을 하며 살아갈 수 있어요. 지금 마음에 걸린 그 한 가지만 카톡으로 보내주세요.',
        go: '무료 1:1 사주 상담 열기'
      };

    var wrap = global.document.createElement('a');
    wrap.className = 'consult-cta';
    wrap.href = url;
    wrap.target = '_blank';
    wrap.rel = 'noopener noreferrer';
    wrap.innerHTML =
      '<div class="eyebrow">' + copy.eyebrow + '</div>' +
      '<p class="line">' + copy.line + '</p>' +
      '<span class="go">' + copy.go + ' →</span>';

    if (el.id === 'consult-home' || el.id === 'consult-result' || /^consult-/.test(el.id || '')) {
      el.innerHTML = '';
      el.appendChild(wrap);
      el.style.display = 'block';
      return;
    }
    var slot = el.querySelector('#consult-result');
    if (slot) {
      slot.innerHTML = '';
      slot.appendChild(wrap);
      slot.style.display = 'block';
      return;
    }
    var existing = el.querySelector('.consult-cta');
    if (existing) {
      existing.replaceWith(wrap);
      return;
    }
    el.appendChild(wrap);
  }

  function renderTop(activeId) {
    injectStyles();
    var el = global.document.getElementById('site-top');
    if (!el) return;
    var home = resolveHref('index.html');
    el.innerHTML =
      '<a class="site-brand" href="' + home + '">🔮 ' + BRAND + '</a>' +
      (activeId !== 'home' ? '<a class="site-back" href="' + home + '">← 메뉴</a>' : '');
  }

  function renderBottom(activeId) {
    injectStyles();
    var el = global.document.getElementById('site-bottom');
    if (!el) {
      el = global.document.createElement('nav');
      el.id = 'site-bottom';
      el.className = 'site-bottom';
      el.setAttribute('aria-label', '도구 메뉴');
      global.document.body.appendChild(el);
    }
    global.document.body.classList.add('has-site-nav');
    var html = '<div class="site-bottom-inner">';
    navTools().forEach(function (t) {
      html += '<a class="' + (t.id === activeId ? 'active' : '') + '" href="' + resolveHref(t.href) + '">' + t.nav + '</a>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  function hubTools() {
    return publicTools().filter(function (t) { return t.hub !== false; });
  }

  function renderHub() {
    injectStyles();
    var el = global.document.getElementById('site-hub');
    if (!el) return;
    var html = '';
    GROUPS.forEach(function (g) {
      var items = hubTools().filter(function (t) { return t.group === g.id; });
      if (!items.length) return;
      var cols = items.length === 1 ? ' site-grid-1' : '';
      html += '<div><div class="site-group-label">' + g.label + '</div><div class="site-grid' + cols + '">';
      items.forEach(function (t) {
        html +=
          '<a href="' + resolveHref(t.href) + '">' +
          '<div class="emoji">' + (t.emoji || '🔮') + '</div>' +
          '<strong>' + t.title + '</strong>' +
          '<span>' + t.desc + '</span>' +
          (t.tag ? '<div class="tag">' + t.tag + '</div>' : '') +
          '</a>';
      });
      html += '</div></div>';
    });
    el.innerHTML = html;
  }

  function mount(activeId) {
    renderTop(activeId || 'home');
    renderBottom(activeId || 'home');
    if (activeId === 'home') renderHub();
    if (global.document.getElementById('consult-home')) {
      mountConsult('consult-home', 'home');
    }
  }

  global.SiteNav = {
    BRAND: BRAND,
    TOOLS: TOOLS,
    GROUPS: GROUPS,
    publicTools: publicTools,
    resolveHref: resolveHref,
    consultUrl: consultUrl,
    mountConsult: mountConsult,
    mount: mount,
    renderHub: renderHub,
    renderTop: renderTop,
    renderBottom: renderBottom
  };
})(typeof window !== 'undefined' ? window : this);

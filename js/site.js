/**
 * 사이트 공통 — 도구 목록·네비게이션
 * 새 도구: TOOLS에 추가 → 홈 그리드·하단 메뉴 반영
 */
(function (global) {
  'use strict';

  var BRAND =
    (global.FORTUNE_CONFIG && global.FORTUNE_CONFIG.brandName) || '사주칼퇴리';

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
      desc: '생활 운세 · 로또',
      href: 'tools/today.html',
      emoji: '🎱',
      tag: '매일',
      nav: null,
      public: true,
      hub: false,
      group: 'today'
    },
    {
      id: 'card',
      title: '오늘의 카드',
      desc: '키워드 한 장',
      href: 'tools/daily-card.html',
      emoji: '🃏',
      tag: '재미',
      nav: null,
      public: true,
      hub: true,
      group: 'today'
    },
    {
      id: 'mbti-oheng',
      title: 'MBTI 궁합',
      desc: '오행 하이브리드',
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
      desc: '육합·삼합·점수·해설',
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
      desc: '이름·성별·시주',
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
      desc: '양력·음력·시간',
      href: 'tools/ilju.html',
      emoji: '📅',
      tag: '만세력',
      nav: '일주',
      public: true,
      group: 'me'
    },
    {
      id: 'oheng-me',
      title: '내 오행 성격',
      desc: '일간 상세 풀이',
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
      desc: '성격 · 오늘 운세',
      href: 'tools/star-sign.html',
      emoji: '⭐',
      tag: '12궁',
      nav: null,
      public: true,
      group: 'me'
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

  var GROUPS = [
    { id: 'today', label: '오늘' },
    { id: 'compat', label: '궁합' },
    { id: 'me', label: '나에 대해' }
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
      'body.has-site-nav{padding-bottom:72px;}'
    ].join('');
    var style = global.document.createElement('style');
    style.id = 'site-nav-styles';
    style.textContent = css;
    global.document.head.appendChild(style);
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
  }

  global.SiteNav = {
    BRAND: BRAND,
    TOOLS: TOOLS,
    GROUPS: GROUPS,
    publicTools: publicTools,
    resolveHref: resolveHref,
    mount: mount,
    renderHub: renderHub,
    renderTop: renderTop,
    renderBottom: renderBottom
  };
})(typeof window !== 'undefined' ? window : this);

/**
 * 이름 풀이 — 한글 획수·발음 오행 (결정론, AI 없음)
 * 한자 작명이 아니라 “지금 쓰는 한글 이름” 참고용 풀이
 */
(function (global) {
  'use strict';

  /* 초성 획수 (한글 자모) */
  var CHO_STROKE = [2, 4, 2, 3, 6, 5, 4, 4, 8, 2, 4, 1, 3, 6, 4, 3, 4, 4, 3];
  /* 중성 획수 */
  var JUNG_STROKE = [2, 3, 3, 4, 2, 3, 3, 4, 2, 4, 5, 3, 3, 2, 4, 5, 3, 3, 1, 2, 1];
  /* 종성 획수 (없음=0) */
  var JONG_STROKE = [0, 2, 4, 4, 2, 5, 5, 3, 5, 7, 9, 9, 7, 9, 9, 3, 4, 4, 2, 4, 1, 3, 4, 3, 4, 2, 4, 3];

  var OHENG = {
    wood: { id: 'wood', ko: '목', icon: '🌳', tip: '성장·시작·기획에 힘이 실립니다.' },
    fire: { id: 'fire', ko: '화', icon: '🔥', tip: '표현·열정·대외 활동이 잘 붙습니다.' },
    earth: { id: 'earth', ko: '토', icon: '🪨', tip: '신뢰·실무·중심 잡기가 강점입니다.' },
    metal: { id: 'metal', ko: '금', icon: '⚙️', tip: '결단·완성·기준이 분명해집니다.' },
    water: { id: 'water', ko: '수', icon: '💧', tip: '지혜·흐름·유연함이 길을 엽니다.' }
  };

  /* 획수 끝자리 → 오행 (성명학에서 흔한 簡易) */
  function strokeToOheng(n) {
    var d = ((n % 10) + 10) % 10;
    if (d === 1 || d === 2) return OHENG.wood;
    if (d === 3 || d === 4) return OHENG.fire;
    if (d === 5 || d === 6) return OHENG.earth;
    if (d === 7 || d === 8) return OHENG.metal;
    return OHENG.water; /* 9, 0 */
  }

  /* 발음 오행 — 초성 기준 */
  var CHO_SOUND = [
    'wood', 'wood', 'fire', 'fire', 'fire', 'fire', 'water', 'water', 'water',
    'metal', 'metal', 'earth', 'metal', 'metal', 'metal', 'wood', 'fire', 'water', 'earth'
  ];

  function isHangulSyllable(ch) {
    var c = ch.charCodeAt(0);
    return c >= 0xAC00 && c <= 0xD7A3;
  }

  function decompose(ch) {
    var c = ch.charCodeAt(0) - 0xAC00;
    var cho = Math.floor(c / 588);
    var jung = Math.floor((c % 588) / 28);
    var jong = c % 28;
    return { cho: cho, jung: jung, jong: jong };
  }

  function syllableStroke(ch) {
    if (!isHangulSyllable(ch)) return 0;
    var d = decompose(ch);
    return CHO_STROKE[d.cho] + JUNG_STROKE[d.jung] + JONG_STROKE[d.jong];
  }

  function syllableSoundOheng(ch) {
    if (!isHangulSyllable(ch)) return null;
    var d = decompose(ch);
    return OHENG[CHO_SOUND[d.cho]];
  }

  /* 수리 길/흉 — 간이 (합·불 등 복잡 체계 대신 끝자리 톤) */
  function strokeTone(n) {
    var d = n % 10;
    if (d === 1 || d === 3 || d === 5 || d === 6 || d === 7 || d === 8) {
      return { id: 'good', ko: '힘이 붙는 편', tip: '이름을 밖으로 드러내도 괜찮은 흐름입니다.' };
    }
    if (d === 2 || d === 4) {
      return { id: 'mixed', ko: '노력형', tip: '꾸준함이 이름을 빛나게 합니다.' };
    }
    return { id: 'care', ko: '다듬으면 좋은 편', tip: '서명·닉네임·호칭을 단정히 쓰면 보완됩니다.' };
  }

  function cleanName(raw) {
    return String(raw || '')
      .replace(/\s+/g, '')
      .replace(/[^가-힣]/g, '');
  }

  function analyzeSyllables(hangul) {
    var list = [];
    for (var i = 0; i < hangul.length; i++) {
      var ch = hangul.charAt(i);
      if (!isHangulSyllable(ch)) continue;
      var st = syllableStroke(ch);
      var so = syllableSoundOheng(ch);
      list.push({
        char: ch,
        stroke: st,
        strokeOheng: strokeToOheng(st),
        soundOheng: so
      });
    }
    return list;
  }

  function dominantOheng(list, field) {
    var count = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    list.forEach(function (s) {
      var o = s[field];
      if (o && o.id) count[o.id]++;
    });
    var best = 'earth';
    var max = -1;
    Object.keys(count).forEach(function (k) {
      if (count[k] > max) { max = count[k]; best = k; }
    });
    return OHENG[best];
  }

  /**
   * @param {string} fullName 예: 홍길동 / 길동
   * @param {{ surname?: string }} opts 성이 따로면 surname
   */
  function readName(fullName, opts) {
    opts = opts || {};
    var surname = cleanName(opts.surname || '');
    var given = cleanName(opts.given || '');
    var full = cleanName(fullName);

    if (surname && given) full = surname + given;
    if (!full || full.length < 2) {
      return { ok: false, error: '한글 이름 2글자 이상을 입력해 주세요. 예: 김민수, 이하은' };
    }
    if (full.length > 6) {
      return { ok: false, error: '이름은 6글자 이하로 입력해 주세요.' };
    }

    /* 성 1글자 추정 (사용자가 성 안 넣었을 때) */
    if (!surname && !opts.given && full.length >= 2) {
      surname = full.charAt(0);
      given = full.slice(1);
    } else if (!given && surname) {
      given = full.slice(surname.length) || full;
    }

    var all = analyzeSyllables(full);
    var surParts = analyzeSyllables(surname);
    var givenParts = analyzeSyllables(given);

    var totalStroke = all.reduce(function (a, s) { return a + s.stroke; }, 0);
    var givenStroke = givenParts.reduce(function (a, s) { return a + s.stroke; }, 0);
    var surStroke = surParts.reduce(function (a, s) { return a + s.stroke; }, 0);

    var mainOheng = dominantOheng(givenParts.length ? givenParts : all, 'soundOheng');
    var strokeOheng = strokeToOheng(totalStroke);
    var tone = strokeTone(totalStroke);

    var nature =
      mainOheng.icon + ' 이름 기운은 「' + mainOheng.ko + '」 쪽에 가깝습니다. ' + mainOheng.tip;

    var strokeLine =
      '한글 획수 합 ' + totalStroke + '획 · 수리 오행 「' + strokeOheng.ko + '」. ' + tone.tip;

    var parts = all.map(function (s) {
      return s.char + '(' + s.stroke + '획·' + (s.soundOheng ? s.soundOheng.ko : '?') + ')';
    }).join(' · ');

    return {
      ok: true,
      full: full,
      surname: surname,
      given: given,
      syllables: all,
      totalStroke: totalStroke,
      surStroke: surStroke,
      givenStroke: givenStroke,
      mainOheng: mainOheng,
      strokeOheng: strokeOheng,
      tone: tone,
      nature: nature,
      strokeLine: strokeLine,
      partsLine: parts,
      disclaimer: '한자 원획·작명소 결과와 다를 수 있어요. 한글 이름 참고용 풀이입니다.',
      summary:
        full + ' — ' + mainOheng.ko + ' 기운 · 합 ' + totalStroke + '획(' + tone.ko + ')'
    };
  }

  global.NameReading = {
    readName: readName,
    syllableStroke: syllableStroke,
    OHENG: OHENG
  };
})(typeof window !== 'undefined' ? window : this);

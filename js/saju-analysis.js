/**
 * 사주 구조 분석 — 지장간 · 신강/신약 · 용신 · 격국 (자평 통설 · 결정론)
 * 참고: 명리학 자료(억부+조후). 종격·화격은 다루지 않음.
 */
(function (global) {
  'use strict';

  var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var EL = ['wood', 'fire', 'earth', 'metal', 'water'];
  var EL_KO = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
  var EL_ICON = { wood: '🌳', fire: '🔥', earth: '🪨', metal: '⚙️', water: '💧' };
  var EL_TIP = {
    wood: '성장·시작·기획·배움',
    fire: '표현·열정·사람·주목',
    earth: '안정·신뢰·실무·중심',
    metal: '결단·마감·기준·정리',
    water: '지혜·흐름·휴식·직관'
  };

  /* 지지 → 여기/중기/본기 (없으면 null). 본기 비중 최대 */
  var HIDDEN = {
    '子': [{ h: '壬', w: 0.3 }, null, { h: '癸', w: 1.0 }],
    '丑': [{ h: '癸', w: 0.3 }, { h: '辛', w: 0.5 }, { h: '己', w: 1.0 }],
    '寅': [{ h: '戊', w: 0.3 }, { h: '丙', w: 0.5 }, { h: '甲', w: 1.0 }],
    '卯': [{ h: '甲', w: 0.3 }, null, { h: '乙', w: 1.0 }],
    '辰': [{ h: '乙', w: 0.3 }, { h: '癸', w: 0.5 }, { h: '戊', w: 1.0 }],
    '巳': [{ h: '戊', w: 0.3 }, { h: '庚', w: 0.5 }, { h: '丙', w: 1.0 }],
    '午': [{ h: '丙', w: 0.3 }, { h: '己', w: 0.5 }, { h: '丁', w: 1.0 }],
    '未': [{ h: '丁', w: 0.3 }, { h: '乙', w: 0.5 }, { h: '己', w: 1.0 }],
    '申': [{ h: '戊', w: 0.3 }, { h: '壬', w: 0.5 }, { h: '庚', w: 1.0 }],
    '酉': [{ h: '庚', w: 0.3 }, null, { h: '辛', w: 1.0 }],
    '戌': [{ h: '辛', w: 0.3 }, { h: '丁', w: 0.5 }, { h: '戊', w: 1.0 }],
    '亥': [{ h: '戊', w: 0.3 }, { h: '甲', w: 0.5 }, { h: '壬', w: 1.0 }]
  };

  var BRANCH_EL = {
    '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood',
    '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth',
    '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water'
  };

  var SHIP_KO = {
    bigyeon: '비견', geopjae: '겁재', siksin: '식신', sanggwan: '상관',
    pyeonjae: '편재', jeongjae: '정재', pyeongwan: '편관', jeonggwan: '정관',
    pyeonin: '편인', jeongin: '정인'
  };

  var SHIP_PLAIN = {
    bigyeon: '나와 비슷한 사람·동료 기운 — 독립심·경쟁',
    geopjae: '승부·쟁탈 기운 — 재물 분산에 주의',
    siksin: '재능·여유·표현이 잘 나오는 기운',
    sanggwan: '언변·아이디어·반골 — 말은 짧게',
    pyeonjae: '움직이는 돈·사업·기회가 보이는 기운',
    jeongjae: '월급·저축 같은 안정 돈이 중요한 기운',
    pyeongwan: '압박·도전·추진력이 커지는 기운',
    jeonggwan: '명예·직책·규칙이 커지는 기운',
    pyeonin: '특수 배움·직관·외골수 길이 열리는 기운',
    jeongin: '배움·자격·귀인이 도와주는 기운'
  };

  var GEOK_PLAIN = {
    jeonggwan: '정관격 기운 — 원칙·조직·자격직에서 인정받기 쉬운 틀',
    pyeongwan: '편관격 기운 — 압박을 견디며 앞에서 밀고 가는 틀',
    jeongjae: '정재격 기운 — 성실히 쌓아 가는 재물·실무형 틀',
    pyeonjae: '편재격 기운 — 활동 반경이 넓은 사업·영업형 틀',
    siksin: '식신격 기운 — 표현·의식주·여유를 키우는 틀',
    sanggwan: '상관격 기운 — 재능을 밖으로 내는 창작·독립형 틀',
    jeongin: '정인격 기운 — 학문·문서·보호·교육에 힘을 받는 틀',
    pyeonin: '편인격 기운 — 특수 전문·연구 감각이 돋보이는 틀',
    bigyeon: '비겁이 월지에 강한 틀 — 자존·독립·동료 축',
    geopjae: '비겁이 월지에 강한 틀 — 승부·확장 축',
    unknown: '월지 기운을 참고하는 일반 틀'
  };

  function stemIndex(h) {
    var i = STEMS.indexOf(h);
    return i >= 0 ? i : null;
  }

  function elOfStemIndex(i) {
    return EL[Math.floor(((i % 10) + 10) % 10 / 2)];
  }

  function elOfStemChar(h) {
    var i = stemIndex(h);
    return i == null ? null : elOfStemIndex(i);
  }

  function shipSinByStem(dayStemIndex, otherStemIndex) {
    if (dayStemIndex == null || otherStemIndex == null) {
      return { id: 'unknown', ko: '참고', group: 'unknown' };
    }
    var d = ((dayStemIndex % 10) + 10) % 10;
    var o = ((otherStemIndex % 10) + 10) % 10;
    var dEl = Math.floor(d / 2);
    var oEl = Math.floor(o / 2);
    var samePol = (d % 2) === (o % 2);
    var diff = (oEl - dEl + 5) % 5;
    var table = [
      [{ id: 'bigyeon', group: 'bijian' }, { id: 'geopjae', group: 'bijian' }],
      [{ id: 'siksin', group: 'siksang' }, { id: 'sanggwan', group: 'siksang' }],
      [{ id: 'pyeonjae', group: 'jaeseong' }, { id: 'jeongjae', group: 'jaeseong' }],
      [{ id: 'pyeongwan', group: 'gwanseong' }, { id: 'jeonggwan', group: 'gwanseong' }],
      [{ id: 'pyeonin', group: 'inseong' }, { id: 'jeongin', group: 'inseong' }]
    ];
    var row = table[diff][samePol ? 0 : 1];
    return { id: row.id, ko: SHIP_KO[row.id], group: row.group, plain: SHIP_PLAIN[row.id] };
  }

  function nextEl(el) {
    var i = EL.indexOf(el);
    return EL[(i + 1) % 5];
  }

  function prevEl(el) {
    var i = EL.indexOf(el);
    return EL[(i + 4) % 5];
  }

  function conquers(a, b) {
    return nextEl(nextEl(a)) === b;
  }

  function relationWeight(dayEl, otherEl) {
    if (otherEl === dayEl) return { side: 'support', w: 2.0, kind: 'bijian' };
    if (prevEl(dayEl) === otherEl) return { side: 'support', w: 2.2, kind: 'inseong' }; /* 생아 */
    if (nextEl(dayEl) === otherEl) return { side: 'drain', w: 1.6, kind: 'siksang' }; /* 아생 */
    if (conquers(dayEl, otherEl)) return { side: 'drain', w: 1.5, kind: 'jaeseong' }; /* 아극 */
    if (conquers(otherEl, dayEl)) return { side: 'drain', w: 1.8, kind: 'gwanseong' }; /* 극아 */
    return { side: 'neutral', w: 0, kind: 'idle' };
  }

  function collectPillars(saju) {
    var list = [];
    [['year', '년'], ['month', '월'], ['day', '일'], ['hour', '시']].forEach(function (pair) {
      var p = saju[pair[0]];
      if (!p) return;
      list.push({
        key: pair[0],
        label: pair[1],
        stem: p.stem,
        branch: p.branch,
        pillar: p.pillar || p.hanja || (p.stem + p.branch),
        stemIndex: p.stemIndex != null ? p.stemIndex : stemIndex(p.stem)
      });
    });
    return list;
  }

  function countOheng(pillars) {
    var counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    pillars.forEach(function (p) {
      var se = elOfStemChar(p.stem);
      if (se) counts[se] += 1;
      var be = BRANCH_EL[p.branch];
      if (be) counts[be] += 0.85;
      var hid = HIDDEN[p.branch] || [];
      hid.forEach(function (h) {
        if (!h) return;
        var e = elOfStemChar(h.h);
        if (e) counts[e] += h.w * 0.35;
      });
    });
    return counts;
  }

  function scoreStrength(dayEl, dayStemIdx, pillars) {
    var support = 0;
    var drain = 0;
    var detail = { deukryeong: false, deukji: false, deukse: 0 };

    pillars.forEach(function (p) {
      var mult = 1;
      if (p.key === 'month') mult = 1.6; /* 득령 비중 */
      if (p.key === 'day') mult = 1.25; /* 득지 */
      if (p.key === 'hour') mult = 0.9;

      /* 천간 */
      if (p.key !== 'day') {
        var se = elOfStemChar(p.stem);
        var rw = relationWeight(dayEl, se);
        if (rw.side === 'support') {
          support += rw.w * mult;
          detail.deukse += rw.w * mult;
        } else if (rw.side === 'drain') drain += rw.w * mult;
      }

      /* 지지 본기 + 중기 */
      var hid = HIDDEN[p.branch] || [];
      hid.forEach(function (h, hi) {
        if (!h) return;
        var e = elOfStemChar(h.h);
        var r = relationWeight(dayEl, e);
        var hm = hi === 2 ? 1 : hi === 1 ? 0.55 : 0.3;
        if (r.side === 'support') {
          support += r.w * h.w * hm * mult;
          if (p.key === 'month' && hi === 2 && (e === dayEl || prevEl(dayEl) === e)) {
            detail.deukryeong = true;
          }
          if (p.key === 'day' && hi === 2 && (e === dayEl || prevEl(dayEl) === e)) {
            detail.deukji = true;
          }
        } else if (r.side === 'drain') {
          drain += r.w * h.w * hm * mult * 0.85;
        }
      });
    });

    var ratio = drain > 0.01 ? support / drain : support > 0 ? 2 : 1;
    var level;
    if (ratio >= 1.25 || (support - drain) >= 3.5) level = 'strong';
    else if (ratio <= 0.8 || (drain - support) >= 3.5) level = 'weak';
    else level = 'mid';

    return {
      support: Math.round(support * 10) / 10,
      drain: Math.round(drain * 10) / 10,
      ratio: Math.round(ratio * 100) / 100,
      level: level,
      deukryeong: detail.deukryeong,
      deukji: detail.deukji,
      labelKo: level === 'strong' ? '신강' : level === 'weak' ? '신약' : '중화',
      plain:
        level === 'strong'
          ? '일간의 힘이 꽤 있는 편이에요. 혼자 버티기보다, 재능을 밖으로 흘려보내거나 결과로 바꾸는 쪽이 편해집니다.'
          : level === 'weak'
            ? '일간의 힘이 다소 모자란 편이에요. 배움·사람과 기대·휴식처럼 “채워 주는” 기운이 오면 숨이 트입니다.'
            : '강약의 치우침이 크지 않은 편이에요. 지나친 몰입도, 지나친 움츠림도 피하고 리듬을 지키면 좋습니다.'
    };
  }

  function pickYongsin(dayEl, strength, counts, monthBranch) {
    var season = BRANCH_EL[monthBranch];
    var winter = season === 'water' || monthBranch === '丑';
    var summer = season === 'fire' || monthBranch === '未';

    var candidates;
    if (strength.level === 'strong') {
      /* 식상 → 재 → 관 */
      candidates = [nextEl(dayEl), nextEl(nextEl(dayEl))];
      var guan = null;
      EL.forEach(function (e) {
        if (conquers(e, dayEl)) guan = e;
      });
      if (guan) candidates.push(guan);
    } else if (strength.level === 'weak') {
      candidates = [prevEl(dayEl), dayEl]; /* 인성 → 비겁 */
    } else {
      candidates = [prevEl(dayEl), nextEl(dayEl), dayEl];
    }

    /* 가장 부족한 후보 우선 */
    var yong = candidates[0];
    var min = Infinity;
    candidates.forEach(function (c) {
      if (!c) return;
      var n = counts[c] || 0;
      if (n < min) {
        min = n;
        yong = c;
      }
    });

    var johu = null;
    if (winter && (counts.fire || 0) < 1.2) johu = 'fire';
    if (summer && (counts.water || 0) < 1.2) johu = 'water';
    if (johu && strength.level !== 'strong') {
      /* 조후를 억부와 같이 쓸 때: 희신으로 두거나 약하면 용신 후보 승격 */
      if (strength.level === 'weak' || (counts[yong] || 0) > (counts[johu] || 0) + 0.5) {
        yong = johu;
      }
    } else if (johu && strength.level === 'strong' && johu === nextEl(dayEl)) {
      yong = johu;
    }

    var hee = prevEl(yong); /* 생해주는 쪽 */
    var gi = null;
    EL.forEach(function (e) {
      if (conquers(e, yong)) gi = e;
    });

    return {
      yong: yong,
      hee: hee,
      gi: gi,
      johu: johu,
      method: johu && yong === johu ? '억부+조후' : '억부',
      plain:
        '균형을 잡아 주는 기운(용신)은 「' + EL_KO[yong] + '」 쪽이에요. ' +
        EL_TIP[yong] + '을(를) 생활·일·사람에서 조금 더 의식해 보세요.' +
        (gi
          ? ' 너무 세지면 부담이 되는 기운(기신)은 「' + EL_KO[gi] + '」 쪽입니다.'
          : ''),
      tip:
        '색·방향·활동으로 보면 ' + EL_TIP[yong] + '을(를) 먼저. ' +
        (hee ? '돕는 기운(희신)은 「' + EL_KO[hee] + '」.' : '')
    };
  }

  function pickGeokguk(dayStemIdx, monthBranch, pillars) {
    var hid = HIDDEN[monthBranch] || [];
    var main = hid[2] || hid[0];
    if (!main) {
      return { id: 'unknown', ko: '일반', plain: GEOK_PLAIN.unknown, tutchul: false };
    }
    var mainIdx = stemIndex(main.h);
    var ss = shipSinByStem(dayStemIdx, mainIdx);

    var tutchul = false;
    pillars.forEach(function (p) {
      if (p.key === 'day') return;
      if (elOfStemChar(p.stem) === elOfStemChar(main.h)) tutchul = true;
    });

    return {
      id: ss.id,
      ko: (SHIP_KO[ss.id] || '') + '격',
      shipSin: ss,
      tutchul: tutchul,
      monthMain: main.h,
      plain: (GEOK_PLAIN[ss.id] || GEOK_PLAIN.unknown) +
        (tutchul ? ' 월지 기운이 천간에 드러나 틀이 비교적 또렷한 편이에요.' : ' 월지 본기 기준으로 본 참고 틀이에요.'),
      short: (SHIP_KO[ss.id] || '참고') + (tutchul ? '격' : ' 기운')
    };
  }

  function shipSinSummary(dayStemIdx, pillars) {
    var counts = {};
    Object.keys(SHIP_KO).forEach(function (k) { counts[k] = 0; });
    pillars.forEach(function (p) {
      if (p.key === 'day') return;
      var ss = shipSinByStem(dayStemIdx, p.stemIndex);
      if (ss.id !== 'unknown') counts[ss.id] += 1.2;
      var hid = HIDDEN[p.branch] || [];
      var main = hid[2];
      if (main) {
        var hs = shipSinByStem(dayStemIdx, stemIndex(main.h));
        if (hs.id !== 'unknown') counts[hs.id] += 0.8;
      }
    });
    var ranked = Object.keys(counts)
      .map(function (id) { return { id: id, n: counts[id], ko: SHIP_KO[id], plain: SHIP_PLAIN[id] }; })
      .filter(function (x) { return x.n > 0; })
      .sort(function (a, b) { return b.n - a.n; });
    return ranked.slice(0, 4);
  }

  function natureText(dayStem, dayEl, strength, geok, topShips) {
    var stemPlain = {
      '甲': '곧고 큰 나무처럼 앞장서는 결',
      '乙': '풀·덩굴처럼 유연하게 스며드는 결',
      '丙': '태양처럼 밝게 비추는 결',
      '丁': '촛불처럼 섬세하게 담는 결',
      '戊': '산·제방처럼 묵직하게 지키는 결',
      '己': '논밭처럼 품어 가꾸는 결',
      '庚': '원석·무쇠처럼 단호한 결',
      '辛': '보석·칼처럼 예리한 결',
      '壬': '큰 강처럼 폭넓게 흐르는 결',
      '癸': '이슬처럼 섬세하게 스미는 결'
    };
    var lines = [];
    lines.push((stemPlain[dayStem] || '당신만의 결') + '이 느껴져요. 일간은 ' + dayStem + '(' + EL_KO[dayEl] + ')입니다.');
    lines.push(strength.plain);
    if (geok && geok.plain) lines.push(geok.plain);
    if (topShips && topShips[0]) {
      lines.push('사주에 잘 보이는 기운은 「' + topShips[0].ko + '」 — ' + topShips[0].plain + '.');
    }
    return lines.join(' ');
  }

  /**
   * @param {object} saju SajuEngine.getFullSaju 결과
   */
  function analyze(saju) {
    if (!saju || !saju.day) return null;
    var dayStemIdx = saju.day.stemIndex != null ? saju.day.stemIndex : stemIndex(saju.day.stem);
    var dayEl = saju.day.oheng && saju.day.oheng.type
      ? saju.day.oheng.type
      : elOfStemIndex(dayStemIdx);
    var pillars = collectPillars(saju);
    var counts = countOheng(pillars);
    var strength = scoreStrength(dayEl, dayStemIdx, pillars);
    var monthBranch = saju.month && saju.month.branch;
    var yong = pickYongsin(dayEl, strength, counts, monthBranch);
    var geok = pickGeokguk(dayStemIdx, monthBranch, pillars);
    var ships = shipSinSummary(dayStemIdx, pillars);

    var ohengBars = EL.map(function (e) {
      return {
        id: e,
        ko: EL_KO[e],
        icon: EL_ICON[e],
        value: Math.round((counts[e] || 0) * 10) / 10,
        role: e === yong.yong ? '용신' : e === yong.hee ? '희신' : e === yong.gi ? '기신' : ''
      };
    });

    return {
      dayStem: saju.day.stem,
      dayEl: dayEl,
      pillars: pillars,
      ohengCounts: counts,
      ohengBars: ohengBars,
      strength: strength,
      yongsin: yong,
      geokguk: geok,
      ships: ships,
      nature: natureText(saju.day.stem, dayEl, strength, geok, ships),
      careerHint:
        geok.shipSin && geok.shipSin.group === 'gwanseong'
          ? '조직·자격·책임 있는 자리에서 강점이 나오기 쉬운 편이에요.'
          : geok.shipSin && geok.shipSin.group === 'jaeseong'
            ? '실물·영업·숫자로 결과를 내는 일이 잘 붙는 편이에요.'
            : geok.shipSin && geok.shipSin.group === 'siksang'
              ? '표현·기획·콘텐츠·서비스처럼 “만드는 일”이 잘 맞는 편이에요.'
              : geok.shipSin && geok.shipSin.group === 'inseong'
                ? '교육·연구·상담·전문 지식 쪽이 힘을 받기 쉬운 편이에요.'
                : '사람과 역할을 나누며 가는 길이 편해질 수 있어요.',
      moneyHint:
        yong.yong === nextEl(nextEl(dayEl))
          ? '재물 기운이 용신과 가까워, 성실한 수입·현금 흐름 관리가 특히 중요해요.'
          : strength.level === 'weak'
            ? '벌이보다 “감당 가능한 규모”가 먼저예요. 확장은 천천히.'
            : '기회는 잡되, 검증 안 된 큰 베팅은 한 박자 미루세요.',
      loveHint:
        '배우자·파트너 자리는 일지(하루의 지지) 기운을 함께 봐요. 관계를 볼 때는 합이 오면 인연이 부드러워지고, 충이 오면 변화가 커지는 편이에요.',
      healthHint:
        '건강은 명리 경향일 뿐 진단이 아니에요. 오행이 치우친 쪽(' +
        ohengBars.slice().sort(function (a, b) { return b.value - a.value; })[0].ko +
        ')과 기신운·바쁜 시기에 무리하지 않는 게 좋아요 안내입니다.',
      disclaimer:
        '용신·격국은 자평 통설(억부+조후) 참고값이에요. 유파에 따라 달라질 수 있고, 경향·참고용입니다.'
    };
  }

  /** 세운/대운 글자가 용신·기신인지 */
  function luckTone(analysis, stemChar, branchChar) {
    if (!analysis || !analysis.yongsin) return { tone: 'mid', label: '가꾸는 흐름', plain: '' };
    var y = analysis.yongsin;
    var els = [];
    if (stemChar) els.push(elOfStemChar(stemChar));
    if (branchChar) els.push(BRANCH_EL[branchChar]);
    var hitYong = els.indexOf(y.yong) >= 0 || els.indexOf(y.hee) >= 0;
    var hitGi = y.gi && els.indexOf(y.gi) >= 0;
    if (hitYong && !hitGi) {
      return {
        tone: 'up',
        label: '용신·희신 흐름',
        plain: '필요한 기운이 들어와, 하던 일이 잘 붙을 가능성이 높아요.'
      };
    }
    if (hitGi && !hitYong) {
      return {
        tone: 'down',
        label: '정비·조심 흐름',
        plain: '기신 기운이 강해질 수 있어, 확장보다 정리·회복이 이득인 편이에요.'
      };
    }
    return {
      tone: 'mid',
      label: '섞여 가는 흐름',
      plain: '좋음/조심이 한쪽에 쏠리지 않아요. 기본 루틴을 지키며 한 가지씩 하세요.'
    };
  }

  global.SajuAnalysis = {
    analyze: analyze,
    luckTone: luckTone,
    shipSinByStem: shipSinByStem,
    EL_KO: EL_KO,
    EL_TIP: EL_TIP,
    HIDDEN: HIDDEN
  };
})(typeof window !== 'undefined' ? window : this);

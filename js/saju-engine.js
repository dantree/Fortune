/**
 * 사주 엔진 v1.0 — 결정론적 (Deterministic)
 * 같은 생년월일 → 항상 같은 결과
 * 랜덤·API·Date.now() 계산에 사용하지 않음
 *
 * 기준:
 * - 일주(日柱): 만세력 JDN 공식 (2000-01-01 = 戊午 검증)
 * - 년주(年柱): 입춘(立春) 2월 4일 기준 (간이 절기)
 * - 시주(時柱): 미지원 (태어난 시간 입력 시 v2)
 * - 음력: 미지원 (양력만)
 */
(function (global) {
  'use strict';

  var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

  var OHENG_BY_STEM = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
  var OHENG_META = {
    wood:  { type: 'wood',  labelKo: '목', hanja: '木', icon: '🌳' },
    fire:  { type: 'fire',  labelKo: '화', hanja: '火', icon: '🔥' },
    earth: { type: 'earth', labelKo: '토', hanja: '土', icon: '🌍' },
    metal: { type: 'metal', labelKo: '금', hanja: '金', icon: '⚙️' },
    water: { type: 'water', labelKo: '수', hanja: '水', icon: '💧' }
  };

  /** 입춘 간이 기준: 2월 4일 이전이면 전년도 년주 */
  var LICHUN_MONTH = 2;
  var LICHUN_DAY = 4;

  /** JDN 일주 오프셋 — 2000-01-01 = 戊午(54) 검증됨 */
  var DAY_JDN_OFFSET = 49;

  var ENGINE_VERSION = '1.0.0';

  function parseDate(dateStr) {
    var p = dateStr.split('-').map(Number);
    return { y: p[0], m: p[1], d: p[2] };
  }

  function julianDay(y, m, d) {
    var a = Math.floor((14 - m) / 12);
    var y2 = y + 4800 - a;
    var m2 = m + 12 * a - 3;
    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 +
      Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  }

  function pillarFromIndex(idx) {
    idx = ((idx % 60) + 60) % 60;
    return {
      index: idx,
      stem: STEMS[idx % 10],
      branch: BRANCHES[idx % 12],
      hanja: STEMS[idx % 10] + BRANCHES[idx % 12],
      stemIndex: idx % 10,
      branchIndex: idx % 12
    };
  }

  /** 사주 기준 연도 (입춘 전이면 -1) */
  function getSajuYear(y, m, d) {
    if (m < LICHUN_MONTH || (m === LICHUN_MONTH && d < LICHUN_DAY)) {
      return y - 1;
    }
    return y;
  }

  /** 일주 인덱스 0~59 */
  function getDayPillarIndex(y, m, d) {
    var jdn = julianDay(y, m, d);
    return ((jdn + DAY_JDN_OFFSET) % 60 + 60) % 60;
  }

  /** 년주 인덱스 0~59 */
  function getYearPillarIndex(sajuYear) {
    return ((sajuYear - 4) % 60 + 60) % 60;
  }

  function ohengFromStemIndex(stemIndex) {
    var type = OHENG_BY_STEM[stemIndex];
    return OHENG_META[type];
  }

  function getDayPillar(dateStr) {
    var dt = parseDate(dateStr);
    var idx = getDayPillarIndex(dt.y, dt.m, dt.d);
    var p = pillarFromIndex(idx);
    return {
      pillar: p.hanja,
      stem: p.stem,
      branch: p.branch,
      index: idx,
      oheng: ohengFromStemIndex(p.stemIndex),
      dayMaster: p.stem,
      description: getDayMasterDesc(p.stemIndex)
    };
  }

  function getYearPillar(dateStr) {
    var dt = parseDate(dateStr);
    var sajuYear = getSajuYear(dt.y, dt.m, dt.d);
    var idx = getYearPillarIndex(sajuYear);
    var p = pillarFromIndex(idx);
    return {
      pillar: p.hanja,
      stem: p.stem,
      branch: p.branch,
      index: idx,
      sajuYear: sajuYear,
      oheng: ohengFromStemIndex(p.stemIndex),
      animal: ANIMALS[p.branchIndex],
      animalBranch: p.branch
    };
  }

  function getFullSaju(dateStr) {
    var day = getDayPillar(dateStr);
    var year = getYearPillar(dateStr);
    return {
      birthDate: dateStr,
      year: year,
      day: day,
      meta: {
        engineVersion: ENGINE_VERSION,
        calendar: 'gregorian',
        lichunRule: '2월 4일 간이 입춘',
        hourPillar: false
      }
    };
  }

  var DAY_MASTER_DESC = {
    0: '갑목(甲木) — 큰 나무처럼 성장·개척의 기운',
    1: '을목(乙木) — 풀·덩굴처럼 유연·적응의 기운',
    2: '병화(丙火) — 태양처럼 밝고 열정적인 기운',
    3: '정화(丁火) — 촛불처럼 따뜻하고 섬세한 기운',
    4: '무토(戊土) — 산처럼 든든하고 포용하는 기운',
    5: '기토(己土) — 밭흙처럼 실용적이고 양육하는 기운',
    6: '경금(庚金) — 쇠처럼 결단력 있고 원칙적인 기운',
    7: '신금(辛金) — 보석처럼 세련되고 예리한 기운',
    8: '임수(壬水) — 큰 물처럼 지혜롭고 포용하는 기운',
    9: '계수(癸水) — 이슬처럼 섬세하고 직관적인 기운'
  };

  function getDayMasterDesc(stemIndex) {
    return DAY_MASTER_DESC[stemIndex] || '';
  }

  /** 오행 상생상극 점수 (-20 ~ +25) */
  var OHENG_REL = {
    wood:  { wood: 10, fire: 25, earth: -10, metal: -15, water: 20 },
    fire:  { wood: 20, fire: 10, earth: 25, metal: -10, water: -15 },
    earth: { wood: -10, fire: 20, earth: 10, metal: 25, water: -10 },
    metal: { wood: -15, fire: -10, earth: 20, metal: 10, water: 25 },
    water: { wood: 25, fire: -15, earth: -10, metal: 20, water: 10 }
  };

  var GENERATES = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };

  function getOhengRelation(typeA, typeB) {
    var score = OHENG_REL[typeA][typeB];
    if (score >= 20) return { label: '상생', score: score };
    if (score >= 0) return { label: '비견', score: score };
    return { label: '상극', score: score };
  }

  /** 검증용 고정 테스트 케이스 */
  var VERIFY_CASES = [
    { date: '2000-01-01', day: '戊午', yearAnimal: '토끼', sajuYear: 1999 },
    { date: '2000-02-03', day: '辛卯', yearAnimal: '토끼', sajuYear: 1999 },
    { date: '2000-02-04', day: '壬辰', yearAnimal: '용', sajuYear: 2000 },
    { date: '2000-02-05', day: '癸巳', yearAnimal: '용', sajuYear: 2000 },
    { date: '1990-05-15', day: '庚辰', yearAnimal: '말', sajuYear: 1990 },
    { date: '1995-08-22', day: '乙酉', yearAnimal: '돼지', sajuYear: 1995 }
  ];

  function runSelfTest() {
    var passed = 0;
    var failed = [];
    VERIFY_CASES.forEach(function (tc) {
      var day = getDayPillar(tc.date);
      var year = getYearPillar(tc.date);
      if (day.pillar !== tc.day) {
        failed.push(tc.date + ' 일주: got ' + day.pillar + ' want ' + tc.day);
      } else {
        passed++;
      }
      if (tc.yearAnimal && year.animal !== tc.yearAnimal) {
        failed.push(tc.date + ' 띠: got ' + year.animal + ' want ' + tc.yearAnimal);
      } else if (tc.yearAnimal) {
        passed++;
      }
      if (tc.sajuYear && year.sajuYear !== tc.sajuYear) {
        failed.push(tc.date + ' 사주년: got ' + year.sajuYear + ' want ' + tc.sajuYear);
      } else if (tc.sajuYear) {
        passed++;
      }
    });
    /* 결정론: 같은 입력 2회 */
    var d1 = getDayPillar('1990-05-15');
    var d2 = getDayPillar('1990-05-15');
    if (d1.pillar !== d2.pillar) failed.push('결정론 실패');
    else passed++;

    return { passed: passed, failed: failed, ok: failed.length === 0 };
  }

  global.SajuEngine = {
    VERSION: ENGINE_VERSION,
    STEMS: STEMS,
    BRANCHES: BRANCHES,
    ANIMALS: ANIMALS,
    OHENG_META: OHENG_META,
    OHENG_REL: OHENG_REL,
    GENERATES: GENERATES,
    parseDate: parseDate,
    julianDay: julianDay,
    getSajuYear: getSajuYear,
    getDayPillar: getDayPillar,
    getYearPillar: getYearPillar,
    getFullSaju: getFullSaju,
    getOhengRelation: getOhengRelation,
    ohengFromStemIndex: ohengFromStemIndex,
    pillarFromIndex: pillarFromIndex,
    runSelfTest: runSelfTest,
    VERIFY_CASES: VERIFY_CASES
  };
})(typeof window !== 'undefined' ? window : this);

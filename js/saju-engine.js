/**
 * 사주 엔진 v1.1 — 결정론적 (Deterministic)
 * 같은 생년월일(+시간) → 항상 같은 결과
 *
 * 기준:
 * - 일주(日柱): 만세력 JDN (2000-01-01 = 戊午)
 * - 년주(年柱): 입춘 2월 4일 간이 절기
 * - 시주(時柱): 2시간 시진 + 오서둔(五鼠遁), 23시 이후 자시=다음날 일주
 * - 음력: 미지원
 */
(function (global) {
  'use strict';

  var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  var HOUR_LABELS = [
    '자시(23~01)', '축시(01~03)', '인시(03~05)', '묘시(05~07)',
    '진시(07~09)', '사시(09~11)', '오시(11~13)', '미시(13~15)',
    '신시(15~17)', '유시(17~19)', '술시(19~21)', '해시(21~23)'
  ];

  var OHENG_BY_STEM = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
  var OHENG_META = {
    wood:  { type: 'wood',  labelKo: '목', hanja: '木', icon: '🌳' },
    fire:  { type: 'fire',  labelKo: '화', hanja: '火', icon: '🔥' },
    earth: { type: 'earth', labelKo: '토', hanja: '土', icon: '🌍' },
    metal: { type: 'metal', labelKo: '금', hanja: '金', icon: '⚙️' },
    water: { type: 'water', labelKo: '수', hanja: '水', icon: '💧' }
  };

  var LICHUN_MONTH = 2;
  var LICHUN_DAY = 4;
  var DAY_JDN_OFFSET = 49;
  var ENGINE_VERSION = '1.1.1';

  function parseDate(dateStr) {
    var p = dateStr.split('-').map(Number);
    return { y: p[0], m: p[1], d: p[2] };
  }

  function parseTime(timeStr) {
    if (!timeStr) return null;
    var p = timeStr.split(':').map(Number);
    return { h: p[0] || 0, min: p[1] || 0 };
  }

  function julianDay(y, m, d) {
    var a = Math.floor((14 - m) / 12);
    var y2 = y + 4800 - a;
    var m2 = m + 12 * a - 3;
    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 +
      Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  }

  function addDays(dateStr, delta) {
    var dt = parseDate(dateStr);
    var j = julianDay(dt.y, dt.m, dt.d) + delta;
    /* JDN → Gregorian */
    var a = j + 32044;
    var b = Math.floor((4 * a + 3) / 146097);
    var c = a - Math.floor((146097 * b) / 4);
    var d = Math.floor((4 * c + 3) / 1461);
    var e = c - Math.floor((1461 * d) / 4);
    var m = Math.floor((5 * e + 2) / 153);
    var day = e - Math.floor((153 * m + 2) / 5) + 1;
    var month = m + 3 - 12 * Math.floor(m / 10);
    var year = 100 * b + d - 4800 + Math.floor(m / 10);
    return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  }

  function todayDateStr(now) {
    var d = now || new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
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

  function getSajuYear(y, m, d) {
    if (m < LICHUN_MONTH || (m === LICHUN_MONTH && d < LICHUN_DAY)) return y - 1;
    return y;
  }

  function getDayPillarIndex(y, m, d) {
    var jdn = julianDay(y, m, d);
    return ((jdn + DAY_JDN_OFFSET) % 60 + 60) % 60;
  }

  function getYearPillarIndex(sajuYear) {
    return ((sajuYear - 4) % 60 + 60) % 60;
  }

  function ohengFromStemIndex(stemIndex) {
    return OHENG_META[OHENG_BY_STEM[stemIndex]];
  }

  /** 시각 → 시진 지지 인덱스 (0=子 … 11=亥). 23시=자시 */
  function getHourBranchIndex(h, min) {
    var total = h * 60 + (min || 0);
    if (total >= 23 * 60 || total < 60) return 0; /* 子 */
    return Math.floor((total - 60) / 120) + 1;
  }

  /** 오서둔: 일간 → 시천간 */
  function getHourStemIndex(dayStemIndex, hourBranchIndex) {
    return ((dayStemIndex % 5) * 2 + hourBranchIndex) % 10;
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

  /**
   * 시주 계산
   * @param {string} dateStr YYYY-MM-DD
   * @param {string} timeStr HH:MM
   * @returns {object|null}
   */
  function getHourPillar(dateStr, timeStr) {
    var t = parseTime(timeStr);
    if (!t) return null;

    var effectiveDate = dateStr;
    var ziNextDay = false;
    if (t.h >= 23) {
      effectiveDate = addDays(dateStr, 1);
      ziNextDay = true;
    }

    var day = getDayPillar(effectiveDate);
    var hourBranch = getHourBranchIndex(t.h, t.min);
    var dayStemIdx = STEMS.indexOf(day.stem);
    var hourStem = getHourStemIndex(dayStemIdx, hourBranch);

    var idx = null;
    for (var i = 0; i < 60; i++) {
      if (i % 10 === hourStem && i % 12 === hourBranch) { idx = i; break; }
    }

    return {
      pillar: STEMS[hourStem] + BRANCHES[hourBranch],
      stem: STEMS[hourStem],
      branch: BRANCHES[hourBranch],
      index: idx,
      oheng: ohengFromStemIndex(hourStem),
      label: HOUR_LABELS[hourBranch],
      time: timeStr,
      effectiveDay: effectiveDate,
      ziNextDay: ziNextDay,
      description: HOUR_LABELS[hourBranch] + ' — ' + getDayMasterDesc(hourStem).replace(/^[^—]+—\s*/, '')
    };
  }

  function getFullSaju(dateStr, timeStr) {
    var dayDate = dateStr;
    var t = parseTime(timeStr);
    if (t && t.h >= 23) dayDate = addDays(dateStr, 1);

    var day = getDayPillar(dayDate);
    var year = getYearPillar(dateStr);
    var hour = timeStr ? getHourPillar(dateStr, timeStr) : null;

    return {
      birthDate: dateStr,
      birthTime: timeStr || null,
      year: year,
      day: day,
      hour: hour,
      meta: {
        engineVersion: ENGINE_VERSION,
        calendar: 'gregorian',
        lichunRule: '2월 4일 간이 입춘',
        hourPillar: !!hour,
        ziRule: '23시 이후 자시 → 다음날 일주'
      }
    };
  }

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

  var FORTUNE_BY_REL = {
    '상생': {
      grade: '설레는 날',
      emoji: '✨',
      tip: '오늘은 나를 위해 한 가지를 해보세요.',
      body: '평소보다 말이 잘 통하고, 미뤄 둔 일이 의외로 잘 풀리는 날이에요. 연락하고 싶었던 사람, 사고 싶었던 것, 미뤄 둔 예약—하나만 골라 실행해 보세요. 한꺼번에 욕심내면 피곤하니, “오늘의 한 가지”만 챙기면 충분합니다.'
    },
    '비견': {
      grade: '편안한 날',
      emoji: '🌿',
      tip: '무리하지 말고, 루틴을 지키는 게 이득이에요.',
      body: '드라마틱한 변화보다 잔잔한 정돈이 잘 맞는 날입니다. 집·가방·카톡방처럼 눈에 보이는 작은 정리만 해도 마음이 한결 가벼워져요. 새로운 결심보다 “하던 대로, 조금 더 다정하게”가 오늘의 정답에 가깝습니다.'
    },
    '상극': {
      grade: '조심하는 날',
      emoji: '☕',
      tip: '말·소비·일정은 한 템포 천천히.',
      body: '예민함이 올라오기 쉬운 날이라, 작은 말에도 마음이 흔들릴 수 있어요. 나쁜 날이라기보다 “나를 보호하는 날”에 가깝습니다. 중요한 대화는 짧게, 충동 구매는 장바구니에만 담고, 저녁엔 일찍 쉬는 쪽을 추천해요.'
    }
  };

  var FORTUNE_AREAS = {
    love: [
      '사랑·관계',
      '가까운 사람과 대화가 잘 통해요. 평소 못 했던 고마움 한 마디가 분위기를 부드럽게 바꿔 줍니다.',
      '표현을 아끼지 마세요. 짧은 응원·칭찬 메시지가 오늘만큼은 예상보다 크게 먹힙니다.',
      '오해가 생기기 쉬워요. “왜 저랬을까”보다 “무슨 뜻이었을까”로 한 번만 더 물어보세요.'
    ],
    money: [
      '돈·소비',
      '작은 이득이 보여요. 포인트·할인·환급처럼 티 안 나는 돈을 놓치지 마세요.',
      '기분 소비 주의. 필요한 건 OK, “스트레스 해소용 한 방”은 내일로 미뤄 보세요.',
      '큰 지출은 보류가 이득. 고가 구매·계약은 하루만 더 재면 후회가 줄어듭니다.'
    ],
    work: [
      '일·커리어',
      '집중이 잘 되는 날. 방해되는 알림을 끄고 한 가지만 밀면 진도가 확 납니다.',
      '사람과의 협업이 잘 맞아요. 혼자 끙끙대기보다 짧게 물어보면 길이 열립니다.',
      '일정에 여유를 두세요. 갑작스러운 부탁·변수에 대비해 버퍼 시간을 남겨 두세요.'
    ],
    me: [
      '나 자신',
      '피부·컨디션 챙기기 좋은 날. 물 한 잔, 스트레칭, 일찍 자는 것만으로도 티가 나요.',
      '나를 위한 시간이 보약이에요. 카페 30분, 산책, 좋아하는 드라마—죄책감 없이 가져가세요.',
      '과로는 금물. “조금만 더”를 참는 게 내일의 나를 살리는 선택입니다.'
    ]
  };

  var FORTUNE_MOODS = {
    '상생': [
      '오늘은 마음이 한결 열린 날이에요.',
      '주변 반응이 따뜻한 편—제안·소개에 운이 실려요.',
      '작은 시도가 생각보다 큰 피드백으로 돌아옵니다.'
    ],
    '비견': [
      '오늘은 정돈하면 마음이 편해지는 날이에요.',
      '잔잔한 하루. 루틴을 지키면 저녁이 한결 가벼워집니다.',
      '안정 모드. 새 판보다 지금을 다독이는 게 맞아요.'
    ],
    '상극': [
      '오늘은 속도보다 여유를 선택하세요.',
      '예민할 수 있어요. 말투만 부드럽게 해도 하루가 달라집니다.',
      '감정 소비를 줄이면 저녁이 한결 가벼워집니다.'
    ]
  };

  var LUCKY_COLORS = ['코랄', '아이보리', '라벤더', '세이지 그린', '스카이 블루', '베이지', '로즈 핑크'];
  var LUCKY_ITEMS = ['따뜻한 차', '좋아하는 향', '편한 신발', '예쁜 메모지', '선크림', '이어폰', '작은 꽃'];
  var TODAY_FOCUS = [
    '나를 위한 30분',
    '미뤄 둔 연락 한 통',
    '집 안 구석 정리',
    '피부·수분 챙기기',
    '가벼운 산책',
    '장바구니 비우기',
    '칭찬 한 마디',
    '일찍 자기'
  ];

  /** 결정론 해시 (문자열 → 0~1) */
  function hash01(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 10000) / 10000;
  }

  function seededPick(seed, arr) {
    var i = Math.floor(hash01(seed) * arr.length) % arr.length;
    return arr[i];
  }

  /**
   * 오늘의 운세 — birthDate 필수, todayDate 생략 시 로컬 오늘
   * Date.now는 날짜 키에만 사용 (같은 날이면 동일 결과)
   */
  function getDailyFortune(birthDate, todayDate) {
    var today = todayDate || todayDateStr();
    var me = getDayPillar(birthDate);
    var td = getDayPillar(today);
    var rel = getOhengRelation(me.oheng.type, td.oheng.type);
    var base = FORTUNE_BY_REL[rel.label];
    var score = Math.round(Math.min(95, Math.max(35, 62 + rel.score)));
    var seed = birthDate + '|' + today + '|' + me.pillar + '|' + td.pillar;
    var mood = seededPick(seed + 'mood', FORTUNE_MOODS[rel.label]);
    var luckyColor = seededPick(seed + 'color', LUCKY_COLORS);
    var luckyItem = seededPick(seed + 'item', LUCKY_ITEMS);
    var focus = seededPick(seed + 'focus', TODAY_FOCUS);
    var luckyNumber = 1 + Math.floor(hash01(seed + 'num') * 9);

    var areas = {};
    Object.keys(FORTUNE_AREAS).forEach(function (key) {
      var pack = FORTUNE_AREAS[key];
      var idx = Math.floor(hash01(seed + key) * 3) % 3;
      areas[key] = {
        label: pack[0],
        text: pack[1 + idx],
        score: Math.round(Math.min(96, Math.max(40, score + (hash01(seed + key + 's') - 0.5) * 20)))
      };
    });

    var keywords = [base.grade, luckyColor, focus, '행운 아이템 ' + luckyItem];

    var summary =
      mood + ' ' + base.body + ' ' +
      '오늘 추천: ' + focus + '. 행운색은 ' + luckyColor +
      ', 곁에 두면 기분 좋아지는 아이템은 ' + luckyItem +
      '. 포인트 숫자는 ' + luckyNumber + '.';

    return {
      date: today,
      birthDate: birthDate,
      score: score,
      grade: base.grade,
      emoji: base.emoji,
      relation: rel.label,
      myDay: me,
      todayDay: td,
      summary: summary,
      tip: base.tip,
      mood: mood,
      body: base.body,
      focus: focus,
      luckyItem: luckyItem,
      areas: areas,
      keywords: keywords,
      luckyColor: luckyColor,
      luckyNumber: luckyNumber
    };
  }

  var LOTTO_BAND = {
    low: [
      '시작·씨앗 번호. 작은 움직임이 판을 여는 타입.',
      '초반 기운. “일단 해보기”와 잘 맞아요.',
      '가벼운 발걸음 번호. 부담 없이 붙잡는 게 포인트.'
    ],
    mid: [
      '균형·성장 번호. 흐름을 이어 주는 허리 역할.',
      '중간 다리. 앞뒤 번호를 연결해 주는 케미.',
      '안정 구간. 욕심보다 페이스를 지켜 주는 숫자.'
    ],
    high: [
      '결실·스케일 번호. 판을 키우는 마무리 기운.',
      '하이라이트. 눈에 띄는 타이밍과 잘 맞아요.',
      '큰 그림 번호. “한 방”보다 “한 수”로 쓰세요.'
    ]
  };

  var LOTTO_OHENG_LINE = {
    wood: '목(木) 날—뻗어 나가는 숫자 조합이 잘 어울려요.',
    fire: '화(火) 날—눈에 띄고 뜨거운 리듬의 번호예요.',
    earth: '토(土) 날—단단히 받쳐 주는 안정형 조합이에요.',
    metal: '금(金) 날—깔끔하게 정리된 결단형 번호예요.',
    water: '수(水) 날—흐르듯 이어지는 유연한 조합이에요.'
  };

  function lottoBandKey(n) {
    if (n <= 15) return 'low';
    if (n <= 30) return 'mid';
    return 'high';
  }

  function describeLottoNumber(n, seed, idx) {
    var band = lottoBandKey(n);
    var vibe = seededPick(seed + 'n' + n + idx, LOTTO_BAND[band]);
    var extras = [
      n + '은(는) 오늘 당신의 ‘타이밍 스위치’ 역할.',
      n + '은(는) 생일·오늘 일주의 해시에서 뽑힌 케미 숫자.',
      n + '은(는) 다른 번호들과 간격이 잘 맞는 자리.',
      n + '은(는) 오늘의 흐름을 붙잡아 주는 앵커.'
    ];
    return { number: n, text: vibe + ' ' + seededPick(seed + 'x' + n, extras) };
  }

  /**
   * 오늘의 추천 로또 번호 (1~45 중 6개, 오름차순)
   * 시드: 날짜(+선택 생년월일) — 같은 날·같은 생일이면 항상 동일
   * 오락용 · 당첨 보장 없음
   */
  function getLottoNumbers(todayDate, birthDate) {
    var today = todayDate || todayDateStr();
    var seed = 'lotto|' + today + '|' + (birthDate || 'anon');
    var pool = [];
    for (var n = 1; n <= 45; n++) pool.push(n);

    /* Fisher–Yates with deterministic hash swaps */
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(hash01(seed + '#' + i) * (i + 1));
      var tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    var picks = pool.slice(0, 6).sort(function (a, b) { return a - b; });
    var bonus = pool[6];

    var td = getDayPillar(today);
    var why = [];
    var headline;
    var story;

    if (birthDate) {
      var me = getDayPillar(birthDate);
      var rel = getOhengRelation(me.oheng.type, td.oheng.type);
      headline = '오늘, 당신 일주와 케미 좋은 번호';
      story =
        '오늘 일주 ' + td.pillar + '(' + td.oheng.icon + td.oheng.labelKo + ')와 내 일간 ' +
        me.stem + '(' + me.oheng.icon + me.oheng.labelKo + ')는 ' + rel.label + ' 관계. ' +
        LOTTO_OHENG_LINE[td.oheng.type] + ' ' +
        '이 번호는 ‘오늘 날짜 + 내 생일’로 고정된 시드에서 뽑혀, 같은 날이면 항상 같아요. ' +
        (rel.label === '상생'
          ? '상생 날이라 흐름을 타는 조합을 조금 더 밀어 봤어요.'
          : rel.label === '상극'
            ? '상극 날이라 자극을 완충해 줄 균형 번호를 섞었어요.'
            : '비견 날이라 무리 없이 안정적인 간격의 번호를 골랐어요.');
      why.push({
        label: '왜 오늘?',
        text: '내 일주 ' + me.pillar + ' × 오늘 ' + td.pillar + '의 ' + rel.label +
          ' 기운을 시드에 녹였기 때문이에요.'
      });
    } else {
      headline = '오늘의 공통 추천 번호';
      story =
        '생일을 넣지 않아 ‘오늘’만으로 뽑은 공통 번호예요. ' +
        '오늘 일주 ' + td.pillar + '(' + td.oheng.icon + td.oheng.labelKo + ') 기준으로, ' +
        LOTTO_OHENG_LINE[td.oheng.type] + ' 생일을 넣으면 나만의 번호로 바뀝니다.';
      why.push({
        label: '왜 오늘?',
        text: '오늘 날짜 시드만으로 고정된 조합이에요. 같은 날이면 누구나 같은 번호.'
      });
    }

    var numberNotes = picks.map(function (num, idx) {
      return describeLottoNumber(num, seed, idx);
    });
    var bonusNote = describeLottoNumber(bonus, seed, 'b');
    bonusNote.text = '보너스 ' + bonusNote.text;

    var sum = picks.reduce(function (a, b) { return a + b; }, 0);
    why.push({
      label: '번호 합',
      text: '여섯 개 합이 ' + sum + '. ' +
        (sum < 120 ? '가벼운 편—부담 없이 굴려 보기 좋은 조합.' :
          sum < 160 ? '중간 무게—밸런스가 괜찮은 편.' :
            '묵직한 편—한 방에 욕심내기보다 여유 있게.')
    });
    why.push({
      label: '보너스 ' + bonus,
      text: bonusNote.text
    });

    return {
      date: today,
      birthDate: birthDate || null,
      numbers: picks,
      bonus: bonus,
      headline: headline,
      story: story,
      why: why,
      numberNotes: numberNotes,
      disclaimer: '오락·참고용입니다. 당첨을 보장하지 않으며, 실제 구매·당첨과 무관합니다.'
    };
  }

  var VERIFY_CASES = [
    { date: '2000-01-01', day: '戊午', yearAnimal: '토끼', sajuYear: 1999 },
    { date: '2000-02-03', day: '辛卯', yearAnimal: '토끼', sajuYear: 1999 },
    { date: '2000-02-04', day: '壬辰', yearAnimal: '용', sajuYear: 2000 },
    { date: '2000-02-05', day: '癸巳', yearAnimal: '용', sajuYear: 2000 },
    { date: '1990-05-15', day: '庚辰', yearAnimal: '말', sajuYear: 1990 },
    { date: '1995-08-22', day: '乙酉', yearAnimal: '돼지', sajuYear: 1995 },
    { date: '1990-05-15', time: '11:30', hour: '壬午' },
    { date: '1990-05-15', time: '23:30', hour: '戊子', ziNextDay: true }
  ];

  function runSelfTest() {
    var passed = 0;
    var failed = [];
    VERIFY_CASES.forEach(function (tc) {
      if (tc.hour) {
        var h = getHourPillar(tc.date, tc.time);
        if (!h || h.pillar !== tc.hour) {
          failed.push(tc.date + ' ' + tc.time + ' 시주: got ' + (h && h.pillar) + ' want ' + tc.hour);
        } else {
          passed++;
        }
        if (tc.ziNextDay != null && h && h.ziNextDay !== tc.ziNextDay) {
          failed.push(tc.date + ' 자시 규칙 불일치');
        } else if (tc.ziNextDay != null) {
          passed++;
        }
        return;
      }
      var day = getDayPillar(tc.date);
      var year = getYearPillar(tc.date);
      if (day.pillar !== tc.day) failed.push(tc.date + ' 일주: got ' + day.pillar + ' want ' + tc.day);
      else passed++;
      if (tc.yearAnimal && year.animal !== tc.yearAnimal) {
        failed.push(tc.date + ' 띠: got ' + year.animal + ' want ' + tc.yearAnimal);
      } else if (tc.yearAnimal) passed++;
      if (tc.sajuYear && year.sajuYear !== tc.sajuYear) {
        failed.push(tc.date + ' 사주년: got ' + year.sajuYear + ' want ' + tc.sajuYear);
      } else if (tc.sajuYear) passed++;
    });

    var d1 = getDayPillar('1990-05-15');
    var d2 = getDayPillar('1990-05-15');
    if (d1.pillar !== d2.pillar) failed.push('결정론 실패');
    else passed++;

    var f1 = getDailyFortune('1990-05-15', '2026-07-10');
    var f2 = getDailyFortune('1990-05-15', '2026-07-10');
    if (f1.score !== f2.score || f1.summary !== f2.summary) failed.push('운세 결정론 실패');
    else passed++;

    var l1 = getLottoNumbers('2026-07-10', '1990-05-15');
    var l2 = getLottoNumbers('2026-07-10', '1990-05-15');
    if (l1.numbers.join(',') !== l2.numbers.join(',') || l1.story !== l2.story) {
      failed.push('로또 결정론 실패');
    } else passed++;
    if (!l1.story || !l1.numberNotes || l1.numberNotes.length !== 6) {
      failed.push('로또 해설 누락');
    } else passed++;

    return { passed: passed, failed: failed, ok: failed.length === 0 };
  }

  global.SajuEngine = {
    VERSION: ENGINE_VERSION,
    STEMS: STEMS,
    BRANCHES: BRANCHES,
    ANIMALS: ANIMALS,
    HOUR_LABELS: HOUR_LABELS,
    OHENG_META: OHENG_META,
    OHENG_REL: OHENG_REL,
    GENERATES: GENERATES,
    parseDate: parseDate,
    julianDay: julianDay,
    addDays: addDays,
    todayDateStr: todayDateStr,
    getSajuYear: getSajuYear,
    getDayPillar: getDayPillar,
    getYearPillar: getYearPillar,
    getHourPillar: getHourPillar,
    getFullSaju: getFullSaju,
    getOhengRelation: getOhengRelation,
    getDailyFortune: getDailyFortune,
    getLottoNumbers: getLottoNumbers,
    ohengFromStemIndex: ohengFromStemIndex,
    pillarFromIndex: pillarFromIndex,
    getHourBranchIndex: getHourBranchIndex,
    runSelfTest: runSelfTest,
    VERIFY_CASES: VERIFY_CASES
  };
})(typeof window !== 'undefined' ? window : this);

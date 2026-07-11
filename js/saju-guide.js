/**
 * 풀사주 생활 가이드 — 현재 나이·대운·세운·방위·보완 (결정론)
 * 십신: 일간 천간 대비 (비견/겁재·식신/상관·정편 구분)
 */
(function (global) {
  'use strict';

  var LABELS = {
    wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
  };

  var BRANCH_NAME = {
    '子': '자(쥐)', '丑': '축(소)', '寅': '인(호랑이)', '卯': '묘(토끼)',
    '辰': '진(용)', '巳': '사(뱀)', '午': '오(말)', '未': '미(양)',
    '申': '신(원숭이)', '酉': '유(닭)', '戌': '술(개)', '亥': '해(돼지)'
  };

  /** 지지가 더하는 생활 테마 */
  var BRANCH_THEME = {
    '子': { short: '이동·직관·밤의 일', tip: '무리한 밤샘보다, 생각 정리와 짧은 여행·학습이 약이 됩니다.' },
    '丑': { short: '저축·인내·마무리', tip: '쌓아 둔 것을 정리·저축하고, 급한 승부보다 지구전이 이득입니다.' },
    '寅': { short: '시작·도전·개척', tip: '새 프로젝트·이직·도전을 열기 좋습니다. 다만 혼자 돌진은 금물입니다.' },
    '卯': { short: '관계·감성·유연', tip: '사람·협업·디자인·소통이 열쇠입니다. 고집을 풀면 문이 열립니다.' },
    '辰': { short: '전환·정리·변동', tip: '이사·이직·정리의 해/구간. 미련을 비워야 다음이 옵니다.' },
    '巳': { short: '열정·문서·표현', tip: '발표·계약서·콘텐츠가 운을 가릅니다. 말은 짧게, 기록은 정확히.' },
    '午': { short: '주목·이벤트·심장', tip: '드러나는 자리·행사에 기회가 있습니다. 과열·말실수만 조심하세요.' },
    '未': { short: '돌봄·가족·실무', tip: '집·돌봄·실무 안정이 점수입니다. 사람을 챙기되 짐은 나누세요.' },
    '申': { short: '결단·기술·이동', tip: '칼 같은 결정·기술 연마·출장이 주제. 성급한 칼날은 독이 됩니다.' },
    '酉': { short: '완성·미감·수확', tip: '마감·품질·외모를 다듬는 때. 완벽주의로 시작을 막지 마세요.' },
    '戌': { short: '책임·보관·경계', tip: '맡은 것을 지키면 신용이 자산이 됩니다. 쓸데없는 싸움은 패스.' },
    '亥': { short: '휴식·치유·숨고르기', tip: '회복·상담·물가·조용한 공부가 길을 엽니다. 과한 음주는 피하세요.' }
  };

  /**
   * 일간 천간 vs 대상 천간 → 십신
   * diff: 0동오행 1아생 2아극 3극아 4생아
   */
  function shipSinByStem(dayStemIndex, otherStemIndex) {
    if (dayStemIndex == null || otherStemIndex == null) {
      return { id: 'unknown', ko: '참고', tone: 'neutral', group: 'unknown' };
    }
    var d = ((dayStemIndex % 10) + 10) % 10;
    var o = ((otherStemIndex % 10) + 10) % 10;
    var dEl = Math.floor(d / 2);
    var oEl = Math.floor(o / 2);
    var samePol = (d % 2) === (o % 2);
    var diff = (oEl - dEl + 5) % 5;
    var table = [
      [ // 0 비겁
        { id: 'bigyeon', ko: '비견(나·동료)', tone: 'mixed', group: 'bijian' },
        { id: 'geopjae', ko: '겁재(경쟁·쟁탈)', tone: 'mixed', group: 'bijian' }
      ],
      [ // 1 식상
        { id: 'siksin', ko: '식신(복·재능)', tone: 'good', group: 'siksang' },
        { id: 'sanggwan', ko: '상관(표현·파격)', tone: 'care', group: 'siksang' }
      ],
      [ // 2 재성
        { id: 'pyeonjae', ko: '편재(활동 재물)', tone: 'good', group: 'jaeseong' },
        { id: 'jeongjae', ko: '정재(안정 재물)', tone: 'good', group: 'jaeseong' }
      ],
      [ // 3 관성
        { id: 'pyeongwan', ko: '편관(압박·도전)', tone: 'care', group: 'gwanseong' },
        { id: 'jeonggwan', ko: '정관(명예·책임)', tone: 'care', group: 'gwanseong' }
      ],
      [ // 4 인성
        { id: 'pyeonin', ko: '편인(특수 배움)', tone: 'mixed', group: 'inseong' },
        { id: 'jeongin', ko: '정인(귀인·학업)', tone: 'good', group: 'inseong' }
      ]
    ];
    return table[diff][samePol ? 0 : 1];
  }

  function stemIndexOf(hanja) {
    var SE = global.SajuEngine;
    if (!SE) return null;
    var i = SE.STEMS.indexOf(hanja);
    return i >= 0 ? i : null;
  }

  function dayStemIndex(saju) {
    if (saju.day.stemIndex != null) return saju.day.stemIndex;
    return stemIndexOf(saju.day.stem);
  }

  var DIR = {
    wood: {
      good: ['동쪽', '남동쪽'],
      avoid: ['서쪽', '남서쪽'],
      seat: '책상·소파는 동쪽·남동쪽이 편합니다.',
      bed: '머리 방향을 동쪽으로 두면 기운이 잘 돕습니다.',
      move: '아침 산책·출근길은 동쪽을 의식해 보세요.'
    },
    fire: {
      good: ['남쪽', '남동쪽'],
      avoid: ['북쪽', '북서쪽'],
      seat: '밝은 남향 자리, 창가 쪽이 힘이 납니다.',
      bed: '머리 방향을 남쪽으로 두면 활력이 돕습니다.',
      move: '낮 시간 활동·남쪽 약속을 우선해 보세요.'
    },
    earth: {
      good: ['중앙', '남서쪽', '북동쪽'],
      avoid: ['정북·정남의 극단'],
      seat: '집·사무실의 가운데·안정된 구역이 중심을 잡아 줍니다.',
      bed: '흔들림 적은 방, 남서·북동 배치가 무난합니다.',
      move: '무리한 이동보다 “내 거점”을 단단히 하는 해가 이득입니다.'
    },
    metal: {
      good: ['서쪽', '북서쪽'],
      avoid: ['동쪽', '남동쪽'],
      seat: '서쪽·정리된 공간이 판단력을 살립니다.',
      bed: '머리 방향을 서쪽·북서쪽으로 두면 마무리가 돕습니다.',
      move: '저녁 루틴·서쪽 방향 정리가 운을 바꿉니다.'
    },
    water: {
      good: ['북쪽', '북서쪽'],
      avoid: ['남쪽', '남동쪽'],
      seat: '북쪽·조용한 코너가 직관과 휴식을 줍니다.',
      bed: '머리 방향을 북쪽으로 두면 회복이 돕습니다.',
      move: '물가·북쪽 산책, 밤의 정돈이 약이 됩니다.'
    }
  };

  var FAVOR = {
    wood: {
      colors: ['초록', '청록', '연두'],
      items: ['식물', '나무 소품', '노트·플래너'],
      food: '신선 채소, 신맛 과일, 차',
      habit: '아침 스트레칭·산책, 주간 목표 1개',
      career: '기획·교육·콘텐츠·신규 사업',
      people: '응원해 주는 사람, 함께 성장하는 동료'
    },
    fire: {
      colors: ['빨강', '주황', '분홍'],
      items: ['조명', '향초', '따뜻한 패브릭'],
      food: '따뜻한 음식, 쓴맛·매운맛은 적당히',
      habit: '낮에 사람 만나기, 밤엔 불 끄기',
      career: '발표·영업·브랜딩·공연·교육',
      people: '리액션 좋은 사람, 함께 웃는 자리'
    },
    earth: {
      colors: ['노랑', '베이지', '브라운'],
      items: ['도자기', '쿠션', '안정감 있는 가구'],
      food: '규칙적 식사, 담백·따뜻한 주식',
      habit: '루틴 지키기, 주 1회 내려놓기',
      career: '운영·관리·서비스·실무·교육',
      people: '신뢰할 수 있는 사람, 오래 가는 인연'
    },
    metal: {
      colors: ['흰색', '실버', '네이비'],
      items: ['금속 소품', '정리함', '미니멀 데스크'],
      food: '담백한 단백질, 매끈한 식감의 음식',
      habit: '할 일 정리·마감, 깊은 호흡',
      career: '전문직·품질·전략·재무·기술',
      people: '말이 분명한 사람, 원칙 있는 파트너'
    },
    water: {
      colors: ['검정', '네이비', '회색'],
      items: ['물병', '가습기', '잔잔한 음악'],
      food: '수분·해산물·검은콩·따뜻한 국물',
      habit: '수면 지키기, 일기·메모로 생각 정리',
      career: '전략·연구·상담·투자·네트워크',
      people: '깊이 통하는 대화 상대, 여유 있는 사람'
    }
  };

  var REMEDY = {
    bigyeon: {
      title: '비슷한 사람과 일이 겹칠 때',
      text: '역할을 나누고, 운동·취미로 힘을 밖으로 빼 주세요. 혼자 다 쥐려 하면 기운이 셉니다.'
    },
    geopjae: {
      title: '비교·쟁탈이 커질 때',
      text: '돈·인정 욕심을 한 칸 낮추고 “내 페이스”를 지키세요. 공동 명의·큰 보증은 피하세요.'
    },
    siksin: {
      title: '재능이 잘 풀릴 때',
      text: '취미·작품·말을 밖으로 내되, 즐기기만 하다 흐르지 않게 작은 결과물을 남기세요.'
    },
    sanggwan: {
      title: '말이 날을 세울 때',
      text: '창의는 살리되, 상사·계약·SNS 발언은 한 번 더 거르세요.'
    },
    pyeonjae: {
      title: '돈이 움직일 때',
      text: '기회는 잡되 올인·검증 안 된 투자는 거르세요.'
    },
    jeongjae: {
      title: '안정 수입을 키울 때',
      text: '월급·저축·장부를 손보면 집이 단단해집니다. 허영 소비만 줄여도 운이 돕습니다.'
    },
    pyeongwan: {
      title: '압박이 올 때',
      text: '건강·말투·서류를 지키면 오히려 실력이 드러납니다.'
    },
    jeonggwan: {
      title: '책임·직책이 커질 때',
      text: '약속은 적게 하고 지키세요. 야근·술자리는 조절이 약입니다.'
    },
    pyeonin: {
      title: '독특한 길이 열릴 때',
      text: '공부·취미·직관을 쓰되, 고집을 유연함으로 다듬으면 사람이 붙습니다.'
    },
    jeongin: {
      title: '귀인·배움이 도울 때',
      text: '자격·상담·도움을 요청하는 입이 곧 운입니다.'
    }
  };

  var PERIOD_TONE = {
    good: { label: '문이 열리는 운', emoji: '✨', tip: '시도·제안·관계 확장을 우선하세요.' },
    care: { label: '조심하며 가는 운', emoji: '🕯️', tip: '큰 결정보다 정비·회복·문서 확인이 이득입니다.' },
    mixed: { label: '태도에 따라 갈리는 운', emoji: '🌿', tip: '비교·독주보다 역할 분담이 성과를 냅니다.' },
    neutral: { label: '가꾸는 운', emoji: '🌤️', tip: '루틴을 지키며 한 가지씩 쌓으세요.' }
  };

  var SHIP_BODY = {
    bigyeon: '나와 같은 결의 사람·동료가 많아집니다. 연대하면 힘이 되고, 지분 싸움이 되면 기운이 셉니다.',
    geopjae: '경쟁·비교·쟁탈 공기가 짙어집니다. 돈·인정 욕심을 한 칸 낮추고 “내 일”에 집중하세요.',
    siksin: '재능·여유·표현의 복이 따릅니다. 결과물을 밖으로 내되, 즐기기만 하다 흐르지 않게 하세요.',
    sanggwan: '말·아이디어가 날을 세웁니다. 창의는 쓰되 상위·규칙과의 마찰은 줄이세요.',
    pyeonjae: '움직이는 재물·사업·기회가 보입니다. 속도는 기회, 검증 없는 베팅은 독입니다.',
    jeongjae: '안정 수입·저축·현실 과제가 선명합니다. 허영보다 장부가 운을 지킵니다.',
    pyeongwan: '갑작스런 책임·경쟁·압박이 올 수 있습니다. 몸과 서류를 지키면 실력이 남습니다.',
    jeonggwan: '명예·직책·의무의 무게가 커집니다. 약속을 줄이고, 지킨 약속이 자산이 됩니다.',
    pyeonin: '독특한 배움·직관·외골수 길이 열립니다. 고집을 유연함으로 다듬으면 귀인이 붙습니다.',
    jeongin: '귀인·학업·자격·조언이 길을 엽니다. 도움을 청하고, 배움을 미루지 마세요.'
  };

  function parseDate(dateStr) {
    var p = dateStr.split('-').map(Number);
    return { y: p[0], m: p[1], d: p[2] };
  }

  function getManAge(birthStr, todayStr) {
    var b = parseDate(birthStr);
    var t = parseDate(todayStr);
    var age = t.y - b.y;
    if (t.m < b.m || (t.m === b.m && t.d < b.d)) age -= 1;
    return age < 0 ? 0 : age;
  }

  function yearPillarOf(year) {
    var SE = global.SajuEngine;
    if (!SE) return null;
    return SE.pillarFromIndex(((year - 4) % 60 + 60) % 60);
  }

  function findCurrentDaeun(periods, age) {
    if (!periods || !periods.length) return null;
    var cur = null;
    var next = null;
    var prev = null;
    for (var i = 0; i < periods.length; i++) {
      var p = periods[i];
      if (age >= p.ageFrom && age <= p.ageTo) {
        cur = p;
        next = periods[i + 1] || null;
        prev = i > 0 ? periods[i - 1] : null;
        break;
      }
      if (age < p.ageFrom) {
        next = p;
        prev = i > 0 ? periods[i - 1] : null;
        break;
      }
    }
    if (!cur && age > periods[periods.length - 1].ageTo) {
      cur = periods[periods.length - 1];
      prev = periods[periods.length - 2] || null;
    }
    return { current: cur, next: next, prev: prev };
  }

  function describePeriod(dayStemIdx, period, call, age, opts) {
    if (!period) return null;
    opts = opts || {};
    var otherStem = stemIndexOf(period.stem);
    var ss = shipSinByStem(dayStemIdx, otherStem);
    var tone = PERIOD_TONE[ss.tone] || PERIOD_TONE.neutral;
    var br = BRANCH_THEME[period.branch] || { short: '변화', tip: '기본을 지키며 한 걸음씩 가세요.' };
    var brName = BRANCH_NAME[period.branch] || period.branch;
    var left = age != null && period.ageTo >= age ? (period.ageTo - age) : null;
    var scores = scoreDomains(ss, period.branch);

    var body;
    if (opts.mode === 'short') {
      body =
        period.label + ' · ' + period.pillar + ' → ' + ss.ko +
        '. 지지 ' + brName + '은(는) ' + br.short + ' 테마.';
    } else if (opts.mode === 'next') {
      body = '다음(' + period.label + ')에는 ' + plainShip(ss) + '예요.';
    } else {
      body =
        '지금은 ' + period.label + '입니다. ' + plainShip(ss) + '.';
      if (left != null && left >= 0) {
        body += ' 앞으로 약 ' + left + '년 남았습니다.';
      }
    }

    return {
      period: period,
      shipSin: ss,
      tone: tone,
      branchTheme: br,
      text: body,
      tip: tone.tip,
      summary: period.pillar + ' · ' + ss.ko + ' · ' + br.short,
      scores: scores,
      leftYears: left
    };
  }

  /** 영역별 운 점수 1~5 — 직장·사업·애정·건강 */
  function scoreDomains(ss, branch) {
    var base = {
      bigyeon:  { career: 3, venture: 3, health: 3, love: 3 },
      geopjae:  { career: 3, venture: 2, health: 2, love: 2 },
      siksin:   { career: 3, venture: 4, health: 4, love: 4 },
      sanggwan: { career: 3, venture: 4, health: 2, love: 3 },
      pyeonjae: { career: 3, venture: 5, health: 3, love: 3 },
      jeongjae: { career: 4, venture: 4, health: 3, love: 4 },
      pyeongwan:{ career: 3, venture: 2, health: 2, love: 2 },
      jeonggwan:{ career: 5, venture: 3, health: 2, love: 3 },
      pyeonin:  { career: 3, venture: 3, health: 4, love: 3 },
      jeongin:  { career: 3, venture: 3, health: 4, love: 4 }
    };
    var s = Object.assign({ career: 3, venture: 3, health: 3, love: 3 }, base[ss.id] || {});
    if (branch === '午' || branch === '巳') {
      s.health = Math.max(1, s.health - 1);
      s.career = Math.min(5, s.career + 1);
      s.venture = Math.min(5, s.venture + 1);
    }
    if (branch === '亥' || branch === '子') { s.health = Math.min(5, s.health + 1); }
    if (branch === '寅' || branch === '申') {
      s.venture = Math.min(5, s.venture + 1);
      s.health = Math.max(1, s.health - 1);
    }
    if (branch === '酉' || branch === '戌') { s.career = Math.min(5, s.career + 1); }
    if (branch === '卯' || branch === '未') { s.love = Math.min(5, s.love + 1); }
    if (branch === '辰') { s.venture = Math.min(5, s.venture + 1); }
    var total = s.career + s.venture + s.health + s.love;
    return {
      career: s.career,
      venture: s.venture,
      health: s.health,
      love: s.love,
      /* 하위 호환 */
      business: s.career,
      money: s.venture,
      total: total,
      grade: total >= 16 ? '길' : total <= 10 ? '주의' : '보통'
    };
  }

  function gradeLabel(n) {
    if (n >= 5) return { ko: '활짝', pct: 96, tone: 'up' };
    if (n === 4) return { ko: '좋은 편', pct: 78, tone: 'up' };
    if (n === 3) return { ko: '보통', pct: 56, tone: 'mid' };
    if (n === 2) return { ko: '조심', pct: 34, tone: 'down' };
    return { ko: '숨 고르기', pct: 18, tone: 'down' };
  }

  var PLAIN_SHIP = {
    bigyeon: '나와 비슷한 사람·동료가 많아지는 때',
    geopjae: '비교·경쟁이 커지기 쉬운 때',
    siksin: '재능·표현이 잘 풀리는 때',
    sanggwan: '말·아이디어가 날을 세우기 쉬운 때',
    pyeonjae: '돈이 움직이고 기회가 보이는 때',
    jeongjae: '월급·저축 같은 안정 돈이 중요한 때',
    pyeongwan: '갑자기 일이 몰리고 압박이 오는 때',
    jeonggwan: '직책·책임이 커지는 때',
    pyeonin: '독특한 공부·길이 열리는 때',
    jeongin: '사람·배움이 도와주는 때'
  };

  var CHAPTER_ONE = {
    bigyeon: '함께 일하거나 지분을 나누면 편해집니다.',
    geopjae: '큰 보증·큰 베팅은 피하고, 내 페이스를 지키세요.',
    siksin: '결과물을 밖으로 내보세요. 숨기면 운이 셉니다.',
    sanggwan: '말은 짧게, 중요한 건 적어서 보내세요.',
    pyeonjae: '기회는 잡되, 검증 안 된 투자는 거르세요.',
    jeongjae: '수입·지출을 숫자로 보면 마음이 안정됩니다.',
    pyeongwan: '속도보다 정확도가 남는 때입니다.',
    jeonggwan: '약속은 적게, 지킨 약속이 자산이 됩니다.',
    pyeonin: '고집을 조금 풀면 도와주는 사람이 붙습니다.',
    jeongin: '자격·상담·도움을 요청해 보세요.'
  };

  function plainShip(ss) {
    return (ss && PLAIN_SHIP[ss.id]) || '흐름이 바뀌는 때';
  }

  function buildDomainReading(desc, call, yearBlend) {
    if (!desc || !desc.scores) return null;
    var ss = desc.shipSin;
    var sc = desc.scores;
    var left = desc.leftYears;

    /* 올해 세운을 살짝 섞으면 ‘지금’이 더 설득력 있음 */
    if (yearBlend && yearBlend.career) {
      sc = {
        career: Math.round((sc.career * 2 + yearBlend.career) / 3),
        venture: Math.round((sc.venture * 2 + yearBlend.venture) / 3),
        health: Math.round((sc.health * 2 + yearBlend.health) / 3),
        love: Math.round((sc.love * 2 + yearBlend.love) / 3)
      };
      sc.total = sc.career + sc.venture + sc.health + sc.love;
      sc.grade = sc.total >= 16 ? '길' : sc.total <= 10 ? '주의' : '보통';
      sc.business = sc.career;
      sc.money = sc.venture;
    }

    var copy = {
      career: {
        5: '평가·직책이 붙기 쉬운 때. 성과를 숫자로 남기세요.',
        4: '맡은 일에서 인정받기 괜찮은 흐름입니다.',
        3: '새 자리보다 지금 자리를 탄탄히 하는 쪽.',
        2: '승진·이직은 미루고 기본 업무에 집중하세요.',
        1: '무리한 어필보다 실수 방지·마감이 먼저입니다.'
      },
      venture: {
        5: '창업·부업·확장이 붙기 쉬운 때. 검증된 한 가지만.',
        4: '사이드·제안을 꺼내보기 좋은 흐름입니다.',
        3: '확장보다 현금·고객 관리가 이득입니다.',
        2: '새 판은 작게, 큰 베팅은 참으세요.',
        1: '투기·보증은 피하고 본업 안정이 우선입니다.'
      },
      health: {
        5: '회복·운동이 잘 붙습니다. 검진을 미루지 마세요.',
        4: '몸을 돌보면 금방 반응이 옵니다.',
        3: '수면·식사만 지켜도 컨디션이 버팁니다.',
        2: '과로·스트레스를 먼저 줄이세요.',
        1: '무리한 일정·큰 시술은 미루세요.'
      },
      love: {
        5: '사람 복이 붙습니다. 연락·소개를 해보세요.',
        4: '관계 회복·협업이 잘 됩니다.',
        3: '가까운 사람만 잘 챙겨도 충분합니다.',
        2: '말다툼을 피하고 한 박자 쉬세요.',
        1: '독주·비교는 인연을 상하게 합니다.'
      }
    };

    function line(key, title) {
      var n = Math.max(1, Math.min(5, sc[key]));
      var g = gradeLabel(n);
      return {
        key: key,
        title: title,
        score: n,
        pct: g.pct,
        tone: g.tone,
        grade: g.ko,
        text: copy[key][n] || copy[key][3]
      };
    }

    var items = [
      line('career', '직장운'),
      line('venture', '사업운'),
      line('love', '애정운'),
      line('health', '건강운')
    ];

    var top = items.slice().sort(function (a, b) { return b.score - a.score; })[0];
    var low = items.slice().sort(function (a, b) { return a.score - b.score; })[0];

    var feel =
      sc.grade === '주의' ? '힘을 아끼며 가는 편이 이득인 구간입니다.'
        : sc.grade === '길' ? '문이 열린 쪽에 가까운 구간입니다.'
          : '크게 튀기보다 차근히 가꾸는 구간입니다.';

    var period = desc.period;
    var br = desc.branchTheme || {};
    var body = SHIP_BODY[ss.id] || '';

    var summary = '';
    if (period && period.label) {
      summary = '지금 ' + period.label + ' 흐름 안에 있습니다. ';
    }
    summary += feel;
    if (body) summary += ' ' + body;
    if (br.short) {
      summary += ' 이 구간의 분위기는 「' + br.short + '」에 가깝습니다.';
    }
    if (left != null && left >= 0) {
      summary += ' 앞으로 약 ' + left + '년 더 이어집니다.';
    }

    var highlights = [];
    if (top && top.score >= 4) {
      highlights.push(top.title + '이 상대적으로 잘 붙는 때예요.');
    }
    if (low && low.score <= 2) {
      highlights.push(low.title + '은 속도를 줄이면 덜 흔들립니다.');
    }

    return {
      summary: summary,
      items: items,
      scores: sc,
      highlights: highlights,
      top: top,
      low: low
    };
  }

  function enrichPeriod(dayStemIdx, period) {
    var ss = shipSinByStem(dayStemIdx, stemIndexOf(period.stem));
    var scores = scoreDomains(ss, period.branch);
    var br = BRANCH_THEME[period.branch] || { short: '변화' };
    return {
      period: period,
      shipSin: ss,
      scores: scores,
      branchShort: br.short,
      label: period.label,
      pillar: period.pillar,
      ageFrom: period.ageFrom,
      ageTo: period.ageTo,
      headline: period.label + ' · ' + period.pillar + ' · ' + ss.ko
    };
  }

  /** 만나이 A세가 되는 해 ≈ 출생연도 + A */
  function yearAtAge(birthStr, ageNum) {
    return parseDate(birthStr).y + ageNum;
  }

  function domainYearBoost(ss, key) {
    var n = 0;
    if (key === 'career' || key === 'business') {
      if (ss.id === 'jeonggwan') n += 3;
      if (ss.id === 'pyeongwan') n += 1;
      if (ss.id === 'jeongin') n += 1;
      if (ss.id === 'sanggwan' || ss.id === 'geopjae') n -= 2;
    } else if (key === 'venture' || key === 'money') {
      if (ss.group === 'jaeseong') n += 2;
      if (ss.id === 'siksin') n += 2;
      if (ss.id === 'pyeonjae') n += 1;
      if (ss.id === 'geopjae' || ss.group === 'gwanseong') n -= 2;
    } else if (key === 'health') {
      if (ss.group === 'inseong' || ss.id === 'siksin') n += 2;
      if (ss.group === 'gwanseong' || ss.id === 'sanggwan') n -= 2;
    } else if (key === 'love') {
      if (ss.id === 'siksin' || ss.id === 'jeongin' || ss.id === 'jeongjae') n += 2;
      if (ss.id === 'geopjae' || ss.id === 'pyeongwan') n -= 1;
    }
    if (ss.tone === 'good') n += 1;
    return n;
  }

  /**
   * 대운 10년 안을 세운(해)으로 쪼개 핵심 연도 고르기
   * @returns {{ years: number[], rows: object[], thirds: object, label: string }}
   */
  function pinpointInDaeun(dayStemIdx, birthStr, periodRow, age, todayYear, domainKey) {
    if (!periodRow || !birthStr) return null;
    var p = periodRow.period || periodRow;
    var ageFrom = Math.max(p.ageFrom, age);
    var ageTo = p.ageTo;
    var rows = [];
    for (var a = ageFrom; a <= ageTo; a++) {
      var y = yearAtAge(birthStr, a);
      if (y < todayYear) continue;
      var yp = yearPillarOf(y);
      if (!yp) continue;
      var ss = shipSinByStem(dayStemIdx, yp.stemIndex);
      var br = BRANCH_THEME[yp.branch] || { short: '변화' };
      var score = 3 + domainYearBoost(ss, domainKey || 'career');
      if (yp.branch === '寅' || yp.branch === '申') {
        if (domainKey === 'venture' || domainKey === 'business' || domainKey === 'money') score += 1;
        if (domainKey === 'health') score -= 1;
      }
      if (yp.branch === '酉' || yp.branch === '戌') {
        if (domainKey === 'career' || domainKey === 'business') score += 1;
      }
      if (yp.branch === '亥' || yp.branch === '子') {
        if (domainKey === 'health') score += 1;
      }
      if (yp.branch === '卯' || yp.branch === '未') {
        if (domainKey === 'love') score += 1;
      }
      rows.push({
        year: y,
        age: a,
        pillar: yp.hanja,
        shipSin: ss,
        branchShort: br.short,
        score: score,
        text: y + '년(' + a + '세, ' + yp.hanja + ') · ' + ss.ko
      });
    }
    if (!rows.length) return null;

    var ranked = rows.slice().sort(function (a, b) { return b.score - a.score || a.year - b.year; });
    var top = ranked.filter(function (r) { return r.score >= 4; }).slice(0, 3);
    if (!top.length) top = ranked.slice(0, 2);
    top = top.slice().sort(function (a, b) { return a.year - b.year; });
    var care = ranked.filter(function (r) { return r.score <= 2; })
      .sort(function (a, b) { return a.score - b.score || a.year - b.year; })
      .slice(0, 2);
    care = care.slice().sort(function (a, b) { return a.year - b.year; });

    /* 전반·중반·후반 (남은 해 기준) */
    var n = rows.length;
    var t1 = rows.slice(0, Math.ceil(n / 3));
    var t2 = rows.slice(Math.ceil(n / 3), Math.ceil((2 * n) / 3));
    var t3 = rows.slice(Math.ceil((2 * n) / 3));
    function avg(arr) {
      if (!arr.length) return 0;
      var s = 0;
      for (var i = 0; i < arr.length; i++) s += arr[i].score;
      return s / arr.length;
    }
    var thirds = [
      { name: '전반', rows: t1, avg: avg(t1) },
      { name: '중반', rows: t2, avg: avg(t2) },
      { name: '후반', rows: t3, avg: avg(t3) }
    ].filter(function (t) { return t.rows.length; })
      .sort(function (a, b) { return b.avg - a.avg; });

    var bestThird = thirds[0];
    var yearLabel = top.map(function (r) { return r.year + '년'; }).join(', ');
    var ageLabel = top.map(function (r) { return r.age + '세'; }).join(', ');

    return {
      top: top,
      care: care,
      rows: rows,
      bestThird: bestThird,
      yearLabel: yearLabel,
      ageLabel: ageLabel,
      spanLabel: rows[0].year + '~' + rows[rows.length - 1].year + '년'
    };
  }

  function formatPinpointText(pin, theme) {
    if (!pin || !pin.top.length) return '';
    var t =
      '그중에서도 ' + pin.yearLabel + '(' + pin.ageLabel + ')을 특히 ' + theme + ' 타이밍으로 보세요. ';
    if (pin.bestThird && pin.rows.length >= 4) {
      t += '10년으로 보면 ' + pin.bestThird.name + '(' +
        pin.bestThird.rows[0].year + '~' +
        pin.bestThird.rows[pin.bestThird.rows.length - 1].year + '년)이 상대적으로 낫습니다. ';
    }
    if (pin.care.length) {
      t += '같은 대운 안에서도 ' +
        pin.care.map(function (r) { return r.year + '년'; }).join(', ') +
        '은 속도를 줄이는 편이 좋습니다.';
    }
    return t;
  }

  /** 앞으로의 운대만 — 좋은 나이대 / 조심 나이대 (실질 나이대 위주) */
  function buildUndaeMap(periods, dayStemIdx, age, call, birthStr, todayYear) {
    if (!periods || !periods.length) return null;
    var horizon = Math.max(age + 40, 75);
    var future = [];
    var far = [];
    for (var i = 0; i < periods.length; i++) {
      var p = periods[i];
      if (p.ageTo < age) continue;
      var row = enrichPeriod(dayStemIdx, p);
      if (p.ageFrom <= horizon) future.push(row);
      else far.push(row);
    }
    if (!future.length && far.length) future = far.slice(0, 2);
    if (!future.length) return null;

    var ranked = future.slice().sort(function (a, b) { return b.scores.total - a.scores.total; });
    var best = ranked.filter(function (x) { return x.scores.total >= 14; }).slice(0, 3);
    if (!best.length) best = ranked.slice(0, 2);
    var careful = ranked.filter(function (x) { return x.scores.total <= 11; })
      .sort(function (a, b) { return a.scores.total - b.scores.total; })
      .slice(0, 2);

    function peakScore(row, key) {
      var n = row.scores[key];
      if (row.shipSin.tone === 'care') n -= 1.5;
      if (row.shipSin.id === 'geopjae' && (key === 'venture' || key === 'career')) n -= 1;
      if (row.shipSin.group === 'jaeseong' && key === 'venture') n += 0.5;
      if (row.shipSin.id === 'jeonggwan' && key === 'career') n += 0.5;
      if (row.shipSin.group === 'inseong' && key === 'health') n += 0.5;
      return n;
    }
    var bestCareer = future.slice().sort(function (a, b) {
      return peakScore(b, 'career') - peakScore(a, 'career') || a.ageFrom - b.ageFrom;
    })[0];
    var bestHealth = future.slice().sort(function (a, b) {
      return peakScore(b, 'health') - peakScore(a, 'health') || a.ageFrom - b.ageFrom;
    })[0];
    var bestVenture = future.slice().sort(function (a, b) {
      return peakScore(b, 'venture') - peakScore(a, 'venture') || a.ageFrom - b.ageFrom;
    })[0];
    var bestLove = future.slice().sort(function (a, b) {
      return peakScore(b, 'love') - peakScore(a, 'love') || a.ageFrom - b.ageFrom;
    })[0];

    /* 각 피크 대운을 세운으로 쪼갬 */
    function withPin(row, key) {
      if (!row) return null;
      var pin = pinpointInDaeun(dayStemIdx, birthStr, row, age, todayYear, key);
      return Object.assign({}, row, { pinpoint: pin });
    }
    bestCareer = withPin(bestCareer, 'career');
    bestVenture = withPin(bestVenture, 'venture');
    bestHealth = withPin(bestHealth, 'health');
    bestLove = withPin(bestLove, 'love');
    best = best.map(function (b) {
      return Object.assign({}, b, {
        pinpoint: pinpointInDaeun(dayStemIdx, birthStr, b, age, todayYear, 'career')
      });
    });
    careful = careful.map(function (c) {
      return Object.assign({}, c, {
        pinpoint: pinpointInDaeun(dayStemIdx, birthStr, c, age, todayYear, 'career')
      });
    });

    var summary = '';
    var nearBest = best.filter(function (x) { return x.ageFrom <= age + 20; });
    var nearCare = careful.filter(function (x) { return x.ageFrom <= age + 20; });
    if (!nearCare.length && careful.length) {
      nearCare = careful.filter(function (x) {
        return x.ageFrom <= age + 5 || (age >= x.ageFrom && age <= x.ageTo);
      }).slice(0, 1);
    }

    var inCareNow = nearCare.some(function (x) {
      return age >= x.ageFrom && age <= x.ageTo;
    });
    if (inCareNow) {
      var curCare = nearCare.filter(function (x) {
        return age >= x.ageFrom && age <= x.ageTo;
      })[0] || nearCare[0];
      var cPin = curCare.pinpoint && curCare.pinpoint.care && curCare.pinpoint.care.length
        ? curCare.pinpoint.care.map(function (r) { return r.year + '년'; }).join(', ')
        : '';
      /* 2장에서 이미 “지금”을 말했으니, 여기선 연도만 */
      summary = cPin
        ? '가까운 해로는 ' + cPin + '을 달력에 표시해 두세요.'
        : '가까운 몇 해는 속도를 줄이는 편이 낫습니다.';
    } else if (nearBest.length) {
      var nb = nearBest[0];
      var bPin = nb.pinpoint && nb.pinpoint.yearLabel ? nb.pinpoint.yearLabel : '';
      summary =
        '앞으로 힘이 붙는 시기는 ' + nb.label + '입니다.' +
        (bPin ? ' 그중 ' + bPin + '을 눈여겨보세요.' : '');
    } else {
      summary = '가까운 몇 해는 아래 “언제가 좋을까”를 기준으로 보시면 됩니다.';
    }

    /* 먼 미래 피크는 참고만 — 카드로만 보여 주고 본문엔 짧게 */
    var farBest = best.filter(function (x) { return x.ageFrom > age + 20; });
    if (farBest.length && !nearBest.length) {
      summary += ' (먼 참고: ' + farBest[0].label + ')';
    }

    return {
      summary: summary,
      best: nearBest.slice(0, 2),
      careful: (function () {
        var list = careful.filter(function (x) {
          var isCurrent = age >= x.ageFrom && age <= x.ageTo;
          if (isCurrent) return false; /* 지금은 본문에 이미 씀 */
          return x.ageFrom <= age + 25;
        });
        return list.slice(0, 2);
      })(),
      farBest: farBest.slice(0, 1),
      allFuture: future,
      horizon: horizon,
      peaks: {
        career: bestCareer,
        venture: bestVenture,
        love: bestLove,
        health: bestHealth,
        business: bestCareer,
        money: bestVenture
      }
    };
  }

  function buildTiming(undae, years, age, call) {
    if (!undae) return null;
    var items = [];
    var career = undae.peaks.career;
    var venture = undae.peaks.venture;
    var hel = undae.peaks.health;
    var love = undae.peaks.love;

    if (career) {
      var cWhen = career.pinpoint && career.pinpoint.yearLabel
        ? career.pinpoint.yearLabel
        : career.label;
      items.push({
        title: '직장·인정 타이밍',
        when: cWhen,
        text:
          '큰 공기는 ' + career.label + '입니다. ' +
          (career.pinpoint
            ? formatPinpointText(career.pinpoint, '직장·평가')
            : '성과를 드러내기 좋은 때입니다.')
      });
    }
    if (venture) {
      var vWhen = venture.pinpoint && venture.pinpoint.yearLabel
        ? venture.pinpoint.yearLabel
        : venture.label;
      items.push({
        title: '사업·확장 타이밍',
        when: vWhen,
        text:
          '사업 공기의 큰 줄기는 ' + venture.label + '입니다. ' +
          (venture.pinpoint
            ? formatPinpointText(venture.pinpoint, '사업·확장')
            : '') +
          (venture.scores.venture >= 4
            ? '사이드·창업은 검증된 한 가지만.'
            : '큰 베팅보다 현금·고객 관리가 이득입니다.')
      });
    }
    if (love) {
      var lWhen = love.pinpoint && love.pinpoint.yearLabel
        ? love.pinpoint.yearLabel
        : love.label;
      items.push({
        title: '애정·인연 타이밍',
        when: lWhen,
        text:
          '사람 복이 붙기 쉬운 큰 줄기는 ' + love.label + '입니다. ' +
          (love.pinpoint ? formatPinpointText(love.pinpoint, '인연') : '')
      });
    }
    if (hel) {
      var helWhen = hel.pinpoint && hel.pinpoint.yearLabel
        ? hel.pinpoint.yearLabel
        : hel.label;
      items.push({
        title: '건강·회복 타이밍',
        when: helWhen,
        text:
          '회복·검진이 잘 붙는 큰 줄기는 ' + hel.label + '입니다. ' +
          (hel.pinpoint ? formatPinpointText(hel.pinpoint, '건강') : '')
      });
    }

    var lead = call + '의 가까운 타이밍만 골랐습니다.';
    return { lead: lead, items: items };
  }

  function buildYearOutlook(dayStemIdx, fromYear, count) {
    var list = [];
    for (var i = 0; i < count; i++) {
      var y = fromYear + i;
      var yp = yearPillarOf(y);
      if (!yp) continue;
      var ss = shipSinByStem(dayStemIdx, yp.stemIndex);
      var tone = PERIOD_TONE[ss.tone] || PERIOD_TONE.neutral;
      var br = BRANCH_THEME[yp.branch] || { short: '변화', tip: '' };
      var brName = BRANCH_NAME[yp.branch] || yp.branch;
      var action =
        ss.group === 'jaeseong' ? '돈·계약·부업을 손보기 좋습니다.'
          : ss.group === 'siksang' ? '발표·작품·영업 등 밖으로 내는 일이 좋습니다.'
            : ss.group === 'gwanseong' ? '직장·서류·건강을 우선하고 확장은 미루세요.'
              : ss.group === 'inseong' ? '공부·자격·상담·귀인을 쓰세요.'
                : '사람·지분·비교를 정리하고 팀을 만드세요.';
      var short =
        y + '년(' + yp.hanja + ') · ' + ss.ko + ' · ' + br.short + '. ' + action;

      list.push({
        year: y,
        pillar: yp.hanja,
        shipSin: ss,
        tone: tone,
        label: tone.label,
        text: short,
        summary: ss.ko + ' · ' + br.short,
        highlight: ss.tone === 'good' || ss.tone === 'care'
      });
    }
    return list;
  }

  function buildRemedies(dayType, currentSs) {
    var fav = FAVOR[dayType];
    var dir = DIR[dayType];
    var items = [];
    if (currentSs && REMEDY[currentSs.id]) {
      items.push(REMEDY[currentSs.id]);
    }
    items.push({
      title: '기운을 북돋우는 생활',
      text: fav.habit + '. 색은 ' + fav.colors.join('·') + '을 옷·소품에 조금씩 섞어 보세요. ' + fav.food + '도 도움이 됩니다.'
    });
    items.push({
      title: '집·자리 방위',
      text: '좋은 방향: ' + dir.good.join('·') + '. 가급적 피하면 좋은 쪽: ' + dir.avoid.join('·') + '. ' + dir.seat + ' ' + dir.bed
    });
    items.push({
      title: '안 좋은 흐름을 바꿀 때',
      text: '운이 막힐수록 “더 빨리”가 아니라 “더 깨끗이”입니다. 방 정리, 미룬 연락, 수면, 감사 인사—작은 정돈이 기운의 물길을 바꿉니다.'
    });
    return items;
  }

  function getLifeGuide(opts) {
    var SE = global.SajuEngine;
    if (!SE || !opts || !opts.saju || !opts.solarDate) return null;

    var today = opts.todayDate || SE.todayDateStr();
    var call = (opts.name || '').trim() ? opts.name.trim() + '님' : '당신';
    var dayType = opts.saju.day.oheng.type;
    var dayStemIdx = dayStemIndex(opts.saju);
    var age = getManAge(opts.solarDate, today);
    var fav = FAVOR[dayType];
    var dir = DIR[dayType];

    var daeunInfo = null;
    var nowDesc = null;
    var nextDesc = null;
    var undae = null;
    var domains = null;
    var timing = null;

    if (opts.daeun && opts.daeun.periods) {
      daeunInfo = findCurrentDaeun(opts.daeun.periods, age);
      nowDesc = describePeriod(dayStemIdx, daeunInfo.current, call, age, { mode: 'full' });
      nextDesc = describePeriod(dayStemIdx, daeunInfo.next, call, null, { mode: 'next' });
      undae = buildUndaeMap(opts.daeun.periods, dayStemIdx, age, call, opts.solarDate, parseDate(today).y);
      var todayY = parseDate(today).y;
      var ypNow = yearPillarOf(todayY);
      var yearBlend = null;
      if (ypNow) {
        yearBlend = scoreDomains(shipSinByStem(dayStemIdx, ypNow.stemIndex), ypNow.branch);
      }
      domains = buildDomainReading(nowDesc, call, yearBlend);
    }

    var calYear = parseDate(today).y;
    var years = buildYearOutlook(dayStemIdx, calYear, 10);
    timing = buildTiming(undae, years, age, call);
    var faq = buildLifeFAQ({
      dayStemIdx: dayStemIdx,
      birthStr: opts.solarDate,
      age: age,
      todayYear: calYear,
      undae: undae,
      nowDesc: nowDesc,
      call: call
    });

    var headline = faq && faq.blurb
      ? faq.blurb
      : (call + '은 만나이 ' + age + '세입니다.');

    var nowText = domains
      ? domains.summary
      : (nowDesc ? nowDesc.text : '성별을 선택하면 지금 대운의 사업·재물·건강운을 나눠 보여 드립니다.');

    var goodFor =
      call + '에게 잘 맞는 일은 ' + fav.career + ' 쪽입니다. 귀인이 되기 쉬운 사람은 ' + fav.people +
      '입니다. 집·자리에서는 ' + dir.good.join('·') + '이 길합니다. ' + dir.move;

    var caution =
      '운이 무거울 때는 말·계약·과로·큰 지출을 한 박자 늦추세요. ' +
      (undae && undae.careful.length
        ? '특히 ' + undae.careful.map(function (x) {
          var y = x.pinpoint && x.pinpoint.care && x.pinpoint.care.length
            ? x.pinpoint.care.map(function (r) { return r.year + '년'; }).join(', ')
            : x.label;
          return y;
        }).join(' / ') + '을 달력에 표시해 두세요. '
        : '') +
      '집에서는 ' + dir.avoid.join('·') + '보다 ' + dir.good.join('·') + '을 의식하면 마음이 덜 흔들립니다.';

    var currentSs = nowDesc ? nowDesc.shipSin : null;
    var remedies = buildRemedies(dayType, currentSs);

    var story = buildReadingStory({
      call: call,
      age: age,
      saju: opts.saju,
      nowDesc: nowDesc,
      nextDesc: nextDesc,
      domains: domains,
      undae: undae,
      faq: faq,
      fav: fav,
      dir: dir,
      goodFor: goodFor,
      caution: caution,
      remedies: remedies,
      daeun: opts.daeun,
      periods: opts.daeun && opts.daeun.periods,
      dayStemIdx: dayStemIdx
    });

    return {
      age: age,
      today: today,
      headline: headline,
      story: story,
      faq: faq,
      undae: undae,
      domains: domains,
      timing: timing,
      now: {
        title: '지금 내 운',
        text: nowText,
        period: nowDesc && nowDesc.period,
        tone: nowDesc && nowDesc.tone,
        summary: nowDesc && nowDesc.summary
      },
      next: nextDesc ? { title: '다음 흐름', text: nextDesc.text, period: nextDesc.period, summary: nextDesc.summary } : null,
      roadmap: [],
      years: {
        title: '가까운 해',
        summary: '가까운 해별 참고입니다.',
        list: years
      },
      favors: {
        title: '일상에 좋은 것',
        text: goodFor,
        colors: fav.colors,
        directions: dir.good,
        avoidDirections: dir.avoid,
        career: fav.career,
        items: fav.items
      },
      caution: {
        title: '조심하면 좋은 때',
        text: caution
      },
      remedies: {
        title: '일상에서 기운 돋우기',
        items: remedies
      },
      home: {
        title: '집·자리',
        good: dir.good,
        avoid: dir.avoid,
        seat: dir.seat,
        bed: dir.bed,
        move: dir.move,
        text: '편해지는 방향은 ' + dir.good.join('·') + '입니다. ' + dir.seat + ' ' + dir.bed + ' ' + dir.move
      }
    };
  }

  /** 풀이 전체를 이어지는 이야기로 — 짧고, 반복 없이 */
  function buildReadingStory(ctx) {
    var call = ctx.call;
    var age = ctx.age;
    var saju = ctx.saju;
    var chapters = [];

    var prologue =
      call + ', 만나이 ' + age + '세 · ' + saju.year.animal + '띠입니다.';
    if (ctx.faq && ctx.faq.thisYear) {
      prologue += ' ' + ctx.faq.thisYear;
    }

    chapters.push({ id: 'prologue', title: '시작', text: prologue });

    if (ctx.nowDesc && ctx.domains) {
      var nowBody =
        ctx.domains.summary + ' ' +
        (ctx.nextDesc ? ctx.nextDesc.text : '');
      chapters.push({
        id: 'now',
        title: '지금은',
        text: nowBody,
        domains: ctx.domains.items,
        highlights: ctx.domains.highlights || []
      });
    } else {
      chapters.push({
        id: 'now',
        title: '지금은',
        text: '성별을 선택하면 지금 운을 이어서 읽어 드립니다.'
      });
    }

    if (ctx.undae) {
      chapters.push({
        id: 'luck',
        title: '타이밍',
        text: ctx.undae.summary,
        best: ctx.undae.best,
        careful: ctx.undae.careful,
        farBest: ctx.undae.farBest
      });
    }

    chapters.push({
      id: 'faq',
      title: '이럴 때 움직이세요',
      text: '사람들이 가장 많이 묻는 네 가지만.',
      items: ctx.faq && ctx.faq.items
    });

    var lifeChapters = [];
    if (ctx.periods && ctx.nowDesc) {
      var startIdx = 0;
      for (var i = 0; i < ctx.periods.length; i++) {
        if (ctx.periods[i].order === ctx.nowDesc.period.order) {
          startIdx = i;
          break;
        }
      }
      for (var j = startIdx + 1; j < Math.min(startIdx + 4, ctx.periods.length); j++) {
        var p = ctx.periods[j];
        var en = enrichPeriod(ctx.dayStemIdx, p);
        lifeChapters.push({
          label: p.label,
          pillar: p.pillar,
          isNow: false,
          title: p.label,
          text: plainShip(en.shipSin) + '. ' + (CHAPTER_ONE[en.shipSin.id] || '')
        });
      }
    }

    chapters.push({
      id: 'chapters',
      title: '앞으로의 흐름',
      text: '10년 단위로만 짧게.',
      lifeChapters: lifeChapters
    });

    chapters.push({
      id: 'daily',
      title: '생활 팁',
      text:
        '잘 맞는 일: ' + ctx.fav.career + '. ' +
        '편해지는 방향: ' + ctx.dir.good.join('·') + '. ' +
        ctx.dir.move,
      colors: ctx.fav.colors,
      directions: ctx.dir.good,
      remedies: (ctx.remedies && ctx.remedies.length) ? ctx.remedies.slice(0, 1) : []
    });

    return {
      prologue: prologue,
      chapters: chapters,
      lifeChapters: lifeChapters
    };
  }

  /**
   * 사람들이 자주 묻는 것 — 짧은 Q&A
   */
  function buildLifeFAQ(ctx) {
    var dayStemIdx = ctx.dayStemIdx;
    var birthStr = ctx.birthStr;
    var age = ctx.age;
    var todayYear = ctx.todayYear;
    var call = ctx.call;
    var birthYear = parseDate(birthStr).y;

    function scanYears(scoreFn, count) {
      var rows = [];
      for (var y = todayYear; y < todayYear + 12; y++) {
        var yp = yearPillarOf(y);
        if (!yp) continue;
        var ss = shipSinByStem(dayStemIdx, yp.stemIndex);
        var sc = scoreFn(ss, yp.branch);
        rows.push({
          year: y,
          age: y - birthYear,
          pillar: yp.hanja,
          shipSin: ss,
          score: sc
        });
      }
      rows.sort(function (a, b) { return b.score - a.score || a.year - b.year; });
      var top = rows.filter(function (r) { return r.score >= 3; }).slice(0, count || 2);
      if (!top.length) top = rows.slice(0, 2);
      top.sort(function (a, b) { return a.year - b.year; });
      var low = rows.filter(function (r) { return r.score <= 0; })
        .sort(function (a, b) { return a.score - b.score || a.year - b.year; })
        .slice(0, 2);
      low.sort(function (a, b) { return a.year - b.year; });
      return { top: top, low: low, label: top.map(function (r) { return r.year + '년'; }).join(', ') };
    }

    var promo = scanYears(function (ss) {
      var n = 0;
      if (ss.id === 'jeonggwan') n += 4;
      if (ss.id === 'pyeongwan') n += 2;
      if (ss.id === 'jeongin') n += 2;
      if (ss.id === 'jeongjae') n += 1;
      if (ss.id === 'sanggwan' || ss.id === 'geopjae') n -= 2;
      return n;
    }, 2);

    var jobChange = scanYears(function (ss, br) {
      var n = 0;
      if (ss.id === 'siksin' || ss.id === 'sanggwan') n += 3;
      if (ss.id === 'pyeonjae' || ss.id === 'pyeonin') n += 2;
      if (ss.id === 'jeongin') n += 1;
      if (br === '寅' || br === '辰' || br === '申') n += 1;
      if (ss.id === 'jeonggwan') n -= 1; /* 자리 지키기 */
      return n;
    }, 2);

    var startup = scanYears(function (ss, br) {
      var n = 0;
      if (ss.group === 'jaeseong') n += 3;
      if (ss.id === 'siksin') n += 2;
      if (ss.id === 'pyeongwan') n += 1;
      if (br === '寅' || br === '巳' || br === '申') n += 1;
      if (ss.id === 'geopjae') n -= 2;
      return n;
    }, 2);

    var money = scanYears(function (ss, br) {
      var n = 0;
      if (ss.group === 'jaeseong') n += 4;
      if (ss.id === 'siksin') n += 2;
      if (br === '酉' || br === '戌' || br === '丑') n += 1;
      if (ss.id === 'geopjae' || ss.group === 'gwanseong') n -= 2;
      return n;
    }, 2);

    var love = scanYears(function (ss, br) {
      var n = 0;
      if (ss.id === 'siksin' || ss.id === 'jeongjae' || ss.id === 'jeongin') n += 3;
      if (ss.id === 'pyeonjae') n += 1;
      if (br === '卯' || br === '午' || br === '未') n += 1;
      if (ss.id === 'geopjae' || ss.id === 'pyeongwan') n -= 1;
      return n;
    }, 2);

    var health = scanYears(function (ss, br) {
      var n = 0;
      if (ss.group === 'inseong' || ss.id === 'siksin') n += 3;
      if (br === '亥' || br === '子') n += 1;
      if (ss.group === 'gwanseong' || ss.id === 'sanggwan') n -= 3;
      if (br === '午' || br === '巳') n -= 1;
      return n;
    }, 2);

    var move = scanYears(function (ss, br) {
      var n = 0;
      if (br === '辰' || br === '戌' || br === '寅' || br === '申') n += 3;
      if (ss.group === 'jaeseong' || ss.id === 'siksin') n += 1;
      if (ss.id === 'jeonggwan') n -= 1;
      return n;
    }, 2);

    function card(icon, q, pack, tip) {
      var when = pack.label || '가까운 몇 해';
      var care = pack.low && pack.low.length
        ? ' (조심: ' + pack.low.map(function (r) { return r.year; }).join(', ') + '년)'
        : '';
      return { icon: icon, q: q, when: when, tip: tip + care };
    }

    var items = [
      card('💼', '직장·승진은 언제?', promo, '평가·직책이 붙기 쉬운 해예요. 성과를 남겨 두세요.'),
      card('🚀', '사업·부업은 언제?', startup, '사이드·창업을 시작하기 괜찮은 해예요. 한 가지만.'),
      card('💕', '애정·인연은 언제?', love, '소개·연락·관계 회복을 미루지 마세요.'),
      card('🏥', '건강은 언제 챙길까?', health, '검진·운동을 시작하기 좋은 해예요.')
    ];

    var thisY = yearPillarOf(todayYear);
    var thisSs = thisY ? shipSinByStem(dayStemIdx, thisY.stemIndex) : null;
    var thisLine = thisSs
      ? todayYear + '년은 ' + plainShip(thisSs) + '. ' +
        (thisSs.tone === 'care'
          ? '말·계약·건강을 먼저 챙기세요.'
          : thisSs.tone === 'good'
            ? '기회에 손을 뻗어 보세요.'
            : '차분히 가꾸는 해입니다.')
      : '';

    return {
      blurb: call + ', 만나이 ' + age + '세. ' + thisLine,
      thisYear: thisLine,
      items: items
    };
  }

  function shipSin(dayType, otherType) {
    var map = { wood: 0, fire: 2, earth: 4, metal: 6, water: 8 };
    return shipSinByStem(map[dayType], map[otherType]);
  }

  global.SajuGuide = {
    getLifeGuide: getLifeGuide,
    getManAge: getManAge,
    shipSin: shipSin,
    shipSinByStem: shipSinByStem,
    DIR: DIR,
    FAVOR: FAVOR
  };
})(typeof window !== 'undefined' ? window : this);

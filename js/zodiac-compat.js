/**
 * 12띠 궁합 — 삼합·육합·충·형·해 기반 정량·정성 해설
 * 같은 띠 쌍 → 항상 같은 결과 (결정론)
 */
(function (global) {
  'use strict';

  var ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var OHENG = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];
  var OHENG_ICON = { 목: '🌳', 화: '🔥', 토: '🌍', 금: '⚙️', 수: '💧' };

  /** 삼합: 申子辰(수), 亥卯未(목), 寅午戌(화), 巳酉丑(금) */
  var SAMHAP = [
    { members: [8, 0, 4], name: '신자진', element: '수', vibe: '지혜·흐름·전략' },
    { members: [11, 3, 7], name: '해묘미', element: '목', vibe: '성장·감성·돌봄' },
    { members: [2, 6, 10], name: '인오술', element: '화', vibe: '열정·추진·표현' },
    { members: [5, 9, 1], name: '사유축', element: '금', vibe: '결단·완성·원칙' }
  ];
  var YUKHAP = { 0: 1, 1: 0, 2: 11, 3: 10, 4: 9, 5: 8, 6: 7, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2 };
  var YUKHAP_NAME = {
    '0-1': '자수합토', '2-11': '인해합목', '3-10': '묘술합화',
    '4-9': '진유합금', '5-8': '사신합수', '6-7': '오미합토'
  };
  var CHUNG = { 0: 6, 6: 0, 1: 7, 7: 1, 2: 8, 8: 2, 3: 9, 9: 3, 4: 10, 10: 4, 5: 11, 11: 5 };
  /** 해(害) */
  var HAE = { 0: 7, 7: 0, 1: 6, 6: 1, 2: 5, 5: 2, 3: 4, 4: 3, 8: 11, 11: 8, 9: 10, 10: 9 };
  /** 삼형 그룹 */
  var HYUNG_GROUPS = [[2, 5, 8], [1, 10, 7]];
  var HYUNG_PAIR = { 0: 3, 3: 0 }; // 子卯 무례지형

  var ANIMAL_PROFILE = {
    쥐: {
      nick: '영민한 전략가',
      nature: '눈치와 순발력이 빠르고, 기회를 놓치지 않습니다. 겉은 부드러워도 속셈은 분명한 편.',
      strength: '상황 판단, 재치, 생존력',
      shadow: '의심·계산이 과하면 관계가 차가워질 수 있음',
      keywords: ['영리', '기민', '야심', '적응력']
    },
    소: {
      nick: '묵묵한 기둥',
      nature: '성실과 인내로 신뢰를 쌓습니다. 말보다 행동으로 증명하는 타입.',
      strength: '책임감, 꾸준함, 현실감각',
      shadow: '고집이 세지면 변화를 놓칠 수 있음',
      keywords: ['성실', '안정', '인내', '신뢰']
    },
    호랑이: {
      nick: '앞장서는 개척자',
      nature: '기운이 크고 정의감이 강합니다. 답답한 틀을 깨고 새 길을 내는 힘이 있어요.',
      strength: '리더십, 추진력, 용기',
      shadow: '성급함·독단이 마찰을 부를 수 있음',
      keywords: ['용기', '카리스마', '직진', '정의']
    },
    토끼: {
      nick: '온화한 조율자',
      nature: '분위기와 사람의 마음을 잘 읽습니다. 갈등을 피하기보다 부드럽게 풀어요.',
      strength: '공감, 미감, 외교력',
      shadow: '결정을 미루거나 속마음을 감출 수 있음',
      keywords: ['온화', '섬세', '매력', '평화']
    },
    용: {
      nick: '스케일 큰 비전가',
      nature: '큰 그림을 그리고, 존재감이 분명합니다. 평범함보다 특별함을 추구해요.',
      strength: '야망, 카리스마, 기획력',
      shadow: '자존심이 세면 타협이 어려울 수 있음',
      keywords: ['비전', '자존감', '스케일', '카리스마']
    },
    뱀: {
      nick: '깊은 통찰의 전략가',
      nature: '겉은 차분해도 속은 예리합니다. 본질을 보고, 타이밍을 재는 힘이 있어요.',
      strength: '직관, 집중, 분석력',
      shadow: '비밀주의·집착이 관계를 무겁게 할 수 있음',
      keywords: ['통찰', '신중', '매력', '집중']
    },
    말: {
      nick: '자유로운 열정가',
      nature: '움직임과 표현이 활발합니다. 구속보다 호흡이 맞는 관계를 원해요.',
      strength: '활력, 사교성, 순발력',
      shadow: '변덕·성급함이 신뢰를 흔들 수 있음',
      keywords: ['자유', '열정', '사교', '속도']
    },
    양: {
      nick: '따뜻한 감성가',
      nature: '배려와 취향이 섬세합니다. 편안한 분위기 속에서 재능이 피어나요.',
      strength: '공감, 예술성, 온기',
      shadow: '의존·우유부단이 결정을 늦출 수 있음',
      keywords: ['감성', '배려', '취향', '온기']
    },
    원숭이: {
      nick: '재치 있는 해결사',
      nature: '아이디어와 말솜씨가 뛰어납니다. 막힌 판을 유머와 기지로 열어 줘요.',
      strength: '창의, 순발력, 사교',
      shadow: '가벼운 태도가 진지함을 가릴 수 있음',
      keywords: ['재치', '창의', '유연', '사교']
    },
    닭: {
      nick: '예리한 완성주의자',
      nature: '기준이 분명하고 디테일에 강합니다. 대충을 싫어하고 퀄리티를 지킵니다.',
      strength: '정확성, 미감, 자기관리',
      shadow: '비판·완벽주의가 상대를 위축시킬 수 있음',
      keywords: ['예리', '완성도', '자존감', '정리']
    },
    개: {
      nick: '의리의 수호자',
      nature: '한번 마음을 주면 끝까지 지킵니다. 정의와 신뢰를 관계의 중심에 둡니다.',
      strength: '충성, 정의감, 보호본능',
      shadow: '경계심·걱정이 과하면 분위기가 무거워짐',
      keywords: ['의리', '신뢰', '정의', '보호']
    },
    돼지: {
      nick: '포용력 있는 낙천가',
      nature: '너그럽고 정이 많습니다. 사람을 편하게 만들고, 풍요로운 기운을 나눕니다.',
      strength: '포용, 낙천, 인덕',
      shadow: '경계가 느슨하면 손해를 볼 수 있음',
      keywords: ['포용', '여유', '인덕', '낙천']
    }
  };

  var REL_META = {
    '육합': {
      grade: '천생연분형',
      emoji: '💞',
      classical: '육합(六合)',
      oneLiner: '서로가 서로를 보완하는, 고전에서 말하는 합(合)의 관계입니다.',
      tone: '철학관에서 흔히 “잘 맞는 배필·동반자”로 꼽는 자리입니다.'
    },
    '삼합': {
      grade: '동행 시너지형',
      emoji: '🤝',
      classical: '삼합(三合)',
      oneLiner: '같은 방향으로 기운이 모이는 협력·동업·장기 동행에 강한 관계입니다.',
      tone: '혼자보다 함께일 때 판이 커지는 조합으로 봅니다.'
    },
    '충': {
      grade: '자극·성장형',
      emoji: '⚡',
      classical: '충(沖)',
      oneLiner: '기운이 정면으로 마주칩니다. 끌림과 마찰이 동시에 오기 쉽습니다.',
      tone: '나쁜 인연이라기보다, 다루지 않으면 소모되고 다루면 성장하는 자리입니다.'
    },
    '해': {
      grade: '미묘한 긴장형',
      emoji: '🌫️',
      classical: '해(害)',
      oneLiner: '겉으로는 평온해 보여도 속으로는 서운함·오해가 쌓이기 쉬운 관계입니다.',
      tone: '말보다 분위기, 표현보다 해석이 어긋나기 쉬운 자리로 봅니다.'
    },
    '형': {
      grade: '단련·마찰형',
      emoji: '🔥',
      classical: '형(刑)',
      oneLiner: '서로를 단련시키지만, 말과 태도가 날카로워지기 쉬운 관계입니다.',
      tone: '예의와 경계를 지키면 약이 되고, 무시하면 독이 되는 자리입니다.'
    },
    '동일': {
      grade: '거울 공감형',
      emoji: '🪞',
      classical: '동지(同支)',
      oneLiner: '같은 띠라 공감은 빠르지만, 같은 약점도 서로에게 잘 보입니다.',
      tone: '편한 동료이자, 때로는 너무 닮아 답답해질 수 있는 관계입니다.'
    },
    '보통': {
      grade: '가꾸는 인연형',
      emoji: '🌱',
      classical: '중화(中和)',
      oneLiner: '극단의 합·충은 아니나, 태도와 시간에 따라 얼마든지 깊어질 수 있습니다.',
      tone: '운보다 사람의 선택이 더 크게 작용하는 자리로 봅니다.'
    }
  };

  function hash01(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 10000) / 10000;
  }

  function clamp(n, lo, hi) {
    return Math.round(Math.min(hi, Math.max(lo, n)));
  }

  function pairKey(a, b) {
    return Math.min(a, b) + '-' + Math.max(a, b);
  }

  function findSamhap(a, b) {
    for (var i = 0; i < SAMHAP.length; i++) {
      var g = SAMHAP[i];
      if (g.members.indexOf(a) >= 0 && g.members.indexOf(b) >= 0 && a !== b) return g;
    }
    return null;
  }

  function hasHyung(a, b) {
    if (a === b) return false;
    if (HYUNG_PAIR[a] === b) return true;
    return HYUNG_GROUPS.some(function (g) {
      return g.indexOf(a) >= 0 && g.indexOf(b) >= 0;
    });
  }

  function getBaseRelation(a, b) {
    if (a === b) return { type: '동일', score: 72 };
    if (YUKHAP[a] === b) return { type: '육합', score: 92 };
    var sam = findSamhap(a, b);
    if (sam) return { type: '삼합', score: 86, samhap: sam };
    if (CHUNG[a] === b) return { type: '충', score: 46 };
    if (hasHyung(a, b)) return { type: '형', score: 52 };
    if (HAE[a] === b) return { type: '해', score: 54 };
    return { type: '보통', score: 66 };
  }

  function dimensionScores(type, seed) {
    var base = {
      '육합': { love: 90, marriage: 88, friendship: 86, work: 84, talk: 88, longevity: 90 },
      '삼합': { love: 82, marriage: 80, friendship: 90, work: 88, talk: 84, longevity: 86 },
      '충': { love: 58, marriage: 48, friendship: 52, work: 55, talk: 42, longevity: 50 },
      '해': { love: 55, marriage: 52, friendship: 58, work: 60, talk: 48, longevity: 54 },
      '형': { love: 50, marriage: 46, friendship: 55, work: 58, talk: 40, longevity: 52 },
      '동일': { love: 70, marriage: 68, friendship: 78, work: 72, talk: 74, longevity: 70 },
      '보통': { love: 64, marriage: 62, friendship: 68, work: 66, talk: 65, longevity: 64 }
    }[type];
    var out = {};
    Object.keys(base).forEach(function (k) {
      var wobble = (hash01(seed + k) - 0.5) * 8;
      out[k] = clamp(base[k] + wobble, 35, 96);
    });
    return out;
  }

  function overallFromDims(dims, baseScore, seed) {
    var avg = (dims.love + dims.marriage + dims.friendship + dims.work + dims.talk + dims.longevity) / 6;
    return clamp(avg * 0.7 + baseScore * 0.3 + (hash01(seed + 'all') - 0.5) * 4, 38, 96);
  }

  function expertReading(ctx) {
    var a = ctx.animalA;
    var b = ctx.animalB;
    var pa = ANIMAL_PROFILE[a];
    var pb = ANIMAL_PROFILE[b];
    var meta = REL_META[ctx.type];
    var ohA = OHENG[ctx.indexA];
    var ohB = OHENG[ctx.indexB];

    var opening =
      '두 분의 띠를 펼쳐 보면, ' + a + '띠(' + BRANCHES[ctx.indexA] + ')와 ' +
      b + '띠(' + BRANCHES[ctx.indexB] + ')입니다. ' +
      a + '는 "' + pa.nick + '"의 기운, ' + b + '는 "' + pb.nick + '"의 기운을 지닙니다. ' +
      meta.tone;

    var classical = '';
    if (ctx.type === '육합') {
      classical =
        '고전에서는 이를 ' + (YUKHAP_NAME[pairKey(ctx.indexA, ctx.indexB)] || '육합') +
        '이라 하여, 서로 다른 성질이 한 덩어리로 어울리는 합으로 봅니다. ' +
        '끌림이 자연스럽고, 오래 갈수록 “왜 편한지”가 설명되는 관계입니다.';
    } else if (ctx.type === '삼합' && ctx.samhap) {
      classical =
        '두 띠는 ' + ctx.samhap.name + ' 삼합에 속하며, ' +
        ctx.samhap.element + ' 기운(' + ctx.samhap.vibe + ')으로 묶입니다. ' +
        '연애뿐 아니라 우정·동업·가족처럼 “함께 무언가를 이룰 때” 힘이 커집니다.';
    } else if (ctx.type === '충') {
      classical =
        '충은 정반대 자리에서 기운이 부딪히는 상입니다. ' +
        '만남 초반의 강렬함, 가치관의 차이, 말투의 날카로움이 동시에 나타날 수 있습니다. ' +
        '서로를 “고치려” 하기보다 “리듬을 맞추려” 할 때 관계가 살아납니다.';
    } else if (ctx.type === '해') {
      classical =
        '해는 눈에 띄는 싸움보다, 서운함·오해·미묘한 거리감으로 나타나는 경우가 많습니다. ' +
        '표현을 아끼지 말고, 추측으로 마음을 닫지 않는 것이 핵심입니다.';
    } else if (ctx.type === '형') {
      classical =
        '형은 서로를 단련하는 불같은 자리입니다. 지적과 잔소리가 늘기 쉽고, ' +
        '예의·존중이 무너지면 상처가 깊어집니다. 반대로 기준을 나누면 함께 성장합니다.';
    } else if (ctx.type === '동일') {
      classical =
        '같은 띠는 거울과 같습니다. 공감은 빠르지만 같은 고집·같은 약점도 겹칩니다. ' +
        '역할을 나누고, “누가 맞느냐”보다 “무엇이 필요한가”로 대화하세요.';
    } else {
      classical =
        '합도 충도 극단이 아닌 중화의 자리입니다. 운명의 강제력보다 선택과 태도가 결과를 가릅니다. ' +
        '작은 배려가 쌓이면 합에 가까운 편안함으로, 방치하면 거리감으로 흐릅니다.';
    }

    var chemistry =
      '오행으로 보면 ' + a + '는 ' + OHENG_ICON[ohA] + ohA + ', ' + b + '는 ' +
      OHENG_ICON[ohB] + ohB + ' 기운입니다. ' +
      (ohA === ohB
        ? '같은 오행이라 말없이도 통하는 면이 있으나, 시야가 비슷해 자극이 부족할 수 있습니다.'
        : '서로 다른 빛깔이라 보완이 가능합니다. 차이를 “틀림”이 아니라 “다른 재능”으로 읽으세요.');

    var love =
      '연애·정으로 보면, ' +
      (ctx.dims.love >= 80
        ? '정이 잘 통하고 끌림이 자연스럽습니다. 표현만 꾸준히 하면 관계가 안정됩니다.'
        : ctx.dims.love >= 60
          ? '호감은 있으나 속도 조절이 필요합니다. 서두르기보다 신뢰의 층을 쌓으세요.'
          : '감정 기복이 생기기 쉽습니다. 다툼 뒤 화해의 규칙을 미리 정해 두면 좋습니다.');

    var marriage =
      '혼인·장기 동행에서는 ' +
      (ctx.dims.marriage >= 80
        ? '살림·가치관·생활 리듬이 맞물리기 쉬운 편입니다.'
        : ctx.dims.marriage >= 60
          ? '가능하나, 돈·가사·가족 문제는 초기에 합의를 문서처럼 분명히 하세요.'
          : '충동적인 결정은 금물입니다. 갈등 패턴을 먼저 관찰한 뒤 약속을 키우세요.');

    var work =
      '일·협력에서는 ' +
      (ctx.dims.work >= 80
        ? '역할 분담이 잘 되고 성과로 이어지기 쉽습니다.'
        : ctx.dims.work >= 60
          ? '목표는 공유하되, 방식의 차이를 존중해야 합니다.'
          : '같은 프로젝트보다 각자의 영역을 지키는 협업이 더 안전합니다.');

    var caution =
      '주의할 점: ' + a + ' 쪽은 "' + pa.shadow + '" 경향이, ' +
      b + ' 쪽은 "' + pb.shadow + '" 경향이 관계에서 도드라질 수 있습니다. ' +
      (ctx.type === '충' || ctx.type === '형' || ctx.type === '해'
        ? '말의 온도를 한 단계 낮추고, 중요한 이야기는 감정이 가라앉은 뒤에 하세요.'
        : '편안함에 안주해 감사를 잊으면 정이 식습니다. 작은 인정 한마디가 보약입니다.');

    var advice =
      '오늘의 처방: ' +
      (ctx.type === '육합' || ctx.type === '삼합'
        ? '이미 흐름이 좋습니다. “함께 할 작은 목표” 하나를 정해 동행의 맛을 키우세요.'
        : ctx.type === '충' || ctx.type === '형'
          ? '다투지 않는 날이 아니라, 잘 화해하는 규칙을 만드세요. 거리와 존중이 약입니다.'
          : '일주일에 한 번, 서로에게 고마웠던 점을 말해 보세요. 중화의 인연은 말로 자랍니다.');

    return {
      opening: opening,
      classical: classical,
      chemistry: chemistry,
      love: love,
      marriage: marriage,
      work: work,
      caution: caution,
      advice: advice,
      full: [opening, classical, chemistry, love, marriage, work, caution, advice].join(' ')
    };
  }

  function strengthsAndRisks(type, animalA, animalB) {
    var map = {
      '육합': {
        strengths: ['자연스러운 끌림과 편안함', '서로의 부족함을 메워 주는 보완', '오래 갈수록 정이 깊어짐'],
        risks: ['너무 편해져 노력을 멈출 수 있음', '외부 시련보다 내부 나태가 적']
      },
      '삼합': {
        strengths: ['같은 방향의 시너지', '우정·동업·팀워크에 강함', '위기 때 서로 밀어 줌'],
        risks: ['목표가 어긋나면 동력이 급감', '개인 감정 돌봄을 소홀히 하기 쉬움']
      },
      '충': {
        strengths: ['강한 자극과 성장 동력', '서로 다른 세계를 배우 줌', '권태가 잘 안 옴'],
        risks: ['말다툼·자존심 대결', '감정 소모가 큼', '고치려는 태도가 독이 됨']
      },
      '해': {
        strengths: ['겉으로는 무난해 관계 유지가 가능', '시간이 지나면 이해의 폭이 넓어질 수 있음'],
        risks: ['서운함 누적', '추측성 오해', '표현 부족으로 거리감']
      },
      '형': {
        strengths: ['서로를 단련시키는 성장', '기준이 높아져 결과물이 좋아질 수 있음'],
        risks: ['잔소리·지적 과다', '예의 붕괴 시 깊은 상처']
      },
      '동일': {
        strengths: ['빠른 공감', '취향·리듬 공유', '동료애'],
        risks: ['같은 약점 증폭', '경쟁·비교 심리']
      },
      '보통': {
        strengths: ['운에 덜 묶여 선택이 자유로움', '노력의 결과가 잘 보임'],
        risks: ['무관심으로 흐르면 무연해짐', '자극이 적어 권태가 올 수 있음']
      }
    };
    return map[type];
  }

  function getCompat(branchIndexA, branchIndexB) {
    var a = branchIndexA;
    var b = branchIndexB;
    var base = getBaseRelation(a, b);
    var seed = 'ddi|' + a + '|' + b;
    var dims = dimensionScores(base.type, seed);
    var score = overallFromDims(dims, base.score, seed);
    var animalA = ANIMALS[a];
    var animalB = ANIMALS[b];
    var meta = REL_META[base.type];
    var reading = expertReading({
      indexA: a,
      indexB: b,
      animalA: animalA,
      animalB: animalB,
      type: base.type,
      samhap: base.samhap || null,
      dims: dims
    });
    var sr = strengthsAndRisks(base.type, animalA, animalB);

    return {
      type: base.type,
      label: meta.classical,
      grade: meta.grade,
      emoji: meta.emoji,
      oneLiner: meta.oneLiner,
      score: score,
      baseScore: base.score,
      dimensions: [
        { key: 'love', label: '연애·정', score: dims.love },
        { key: 'marriage', label: '혼인·동행', score: dims.marriage },
        { key: 'friendship', label: '우정·의리', score: dims.friendship },
        { key: 'work', label: '일·협력', score: dims.work },
        { key: 'talk', label: '대화·소통', score: dims.talk },
        { key: 'longevity', label: '오래감', score: dims.longevity }
      ],
      animalA: {
        name: animalA,
        branch: BRANCHES[a],
        oheng: OHENG[a],
        profile: ANIMAL_PROFILE[animalA]
      },
      animalB: {
        name: animalB,
        branch: BRANCHES[b],
        oheng: OHENG[b],
        profile: ANIMAL_PROFILE[animalB]
      },
      samhap: base.samhap || null,
      yukhapName: base.type === '육합' ? (YUKHAP_NAME[pairKey(a, b)] || '육합') : null,
      reading: reading,
      strengths: sr.strengths,
      risks: sr.risks
    };
  }

  function getCompatByAnimal(animalA, animalB) {
    var a = ANIMALS.indexOf(animalA);
    var b = ANIMALS.indexOf(animalB);
    if (a < 0 || b < 0) return null;
    return getCompat(a, b);
  }

  function getAnimalProfileReading(animalName) {
    var p = ANIMAL_PROFILE[animalName];
    if (!p) return null;
    var idx = ANIMALS.indexOf(animalName);
    return {
      animal: animalName,
      branch: BRANCHES[idx],
      oheng: OHENG[idx],
      profile: p,
      reading: {
        opening:
          animalName + '띠(' + BRANCHES[idx] + ')는 "' + p.nick + '"의 기운입니다. ' +
          '지지 오행은 ' + OHENG[idx] + '에 가깝게 읽습니다.',
        nature: p.nature,
        strength: '강점으로 보면 ' + p.strength + '이(가) 두드러집니다. 이 힘을 의식적으로 쓰면 관계가 편해집니다.',
        shadow: '그늘은 "' + p.shadow + '" 쪽입니다. 미리 알면 싸움이 아니라 조율이 됩니다.',
        life:
          '일상에서는 키워드 ' + p.keywords.join('·') + '를 나침반으로 두세요. ' +
          '선택이 흔들릴 때 "지금 내 띠의 강점을 쓰는가, 그늘에 빠졌는가"만 물어봐도 방향이 선명해집니다.',
        love:
          animalName + '띠의 정은 ' + p.keywords[0] + '와 ' + p.keywords[1] +
          ' 사이에서 움직입니다. 상대에게 강점을 보여주고, 그늘은 스스로 먼저 관리할 때 연애가 깊어집니다.',
        work:
          '일터에서는 ' + p.strength + '이(가) 성과로 이어지기 쉽습니다. 반대로 그늘이 커지면 협업 점수가 떨어지니, 피드백을 방어가 아니라 데이터로 받으세요.'
      }
    };
  }

  function getDailyAnimalFortune(animalIndex, todayDate) {
    var today = todayDate;
    if (!today && global.SajuEngine) today = global.SajuEngine.todayDateStr();
    var td = global.SajuEngine ? global.SajuEngine.getDayPillar(today) : null;
    var todayBranch = td ? BRANCHES.indexOf(td.branch) : 0;
    var rel = getBaseRelation(animalIndex, todayBranch);
    var seed = 'ddi-day|' + animalIndex + '|' + today;
    var animal = ANIMALS[animalIndex];
    var p = ANIMAL_PROFILE[animal];
    var meta = REL_META[rel.type];
    var score = clamp(rel.score + (hash01(seed) - 0.5) * 10, 40, 95);
    var body =
      '오늘 일지(' + (td ? td.branch : '?') + ')와 내 띠(' + animal + ')는 ' + meta.classical + ' 흐름입니다. ' +
      meta.tone + ' ' +
      animal + '띠 "' + p.nick + '"에게 오늘은 ' +
      (rel.type === '육합' || rel.type === '삼합'
        ? '사람을 만나고 제안을 꺼내기에 좋은 기운입니다. 미뤄 둔 연락을 해보세요.'
        : rel.type === '충' || rel.type === '형'
          ? '말과 일정에서 마찰이 나기 쉽습니다. 중요한 결정은 한 템포 늦추세요.'
          : rel.type === '해'
            ? '서운함·오해가 쌓이기 쉬운 공기입니다. 추측 대신 확인 질문을 하세요.'
            : '극단은 없는 날. 루틴을 지키며 작은 성과를 쌓는 편이 이득입니다.');
    var tip =
      (rel.type === '육합' || rel.type === '삼합')
        ? '처방: 함께할 일 하나를 정해 동행의 맛을 보세요.'
        : (rel.type === '충' || rel.type === '형')
          ? '처방: 말의 온도를 낮추고, 일정에 여유를 두세요.'
          : '처방: 나를 위한 30분과 감사 한마디를 챙기세요.';
    return {
      animal: animal,
      todayBranch: td ? td.branch : null,
      todayPillar: td ? td.pillar : null,
      relation: rel.type,
      label: meta.classical,
      grade: meta.grade,
      emoji: meta.emoji,
      score: score,
      summary: body + ' ' + tip,
      tip: tip,
      profile: p
    };
  }

  /** 하위 호환: 단순 행렬 (type/label/score) */
  function buildMatrix() {
    var matrix = [];
    for (var i = 0; i < 12; i++) {
      matrix[i] = [];
      for (var j = 0; j < 12; j++) {
        var c = getCompat(i, j);
        matrix[i][j] = { type: c.type, label: c.label, score: c.score };
      }
    }
    return matrix;
  }

  global.ZodiacCompat = {
    ANIMALS: ANIMALS,
    BRANCHES: BRANCHES,
    ANIMAL_PROFILE: ANIMAL_PROFILE,
    REL_META: REL_META,
    MATRIX: buildMatrix(),
    getCompat: getCompat,
    getCompatByAnimal: getCompatByAnimal,
    getAnimalProfileReading: getAnimalProfileReading,
    getDailyAnimalFortune: getDailyAnimalFortune
  };
})(typeof window !== 'undefined' ? window : this);

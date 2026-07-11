/**
 * 일주 해설 — 재미·궁합·상생 (결정론 고정 문구)
 */
(function (global) {
  'use strict';

  var GENERATES = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
  var GENERATED_BY = { fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal', wood: 'water' };
  var CONTROLS = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };
  var CONTROLLED_BY = { earth: 'wood', metal: 'fire', water: 'earth', wood: 'metal', fire: 'water' };

  var OHENG_KO = {
    wood: { ko: '목(木)', icon: '🌳', people: '목 기운 사람' },
    fire: { ko: '화(火)', icon: '🔥', people: '화 기운 사람' },
    earth: { ko: '토(土)', icon: '🌍', people: '토 기운 사람' },
    metal: { ko: '금(金)', icon: '⚙️', people: '금 기운 사람' },
    water: { ko: '수(水)', icon: '💧', people: '수 기운 사람' }
  };

  /** 일간(천간)별 캐릭터 */
  var STEM_STORY = {
    甲: {
      nick: '큰 나무형 리더',
      vibe: '우뚝 선 나무',
      story: '당신은 방향을 정하면 밀어붙이는 타입. 새 판을 깔고, 사람을 이끄는 힘이 있어요. 답답한 틀 안에선 숨이 막히죠.',
      love: '밀당보다 솔직한 고백이 잘 통해요. 함께 미래를 그릴 수 있는 사람에게 끌립니다.',
      work: '기획·창업·리더 역할에서 빛나요. “왜?”를 먼저 묻는 편.',
      caution: '고집이 세지면 주변이 지쳐요. 가끔은 굽히는 게 더 큰 나무입니다.',
      keywords: ['개척', '추진', '정의감', '직진']
    },
    乙: {
      nick: '유연한 덩굴형',
      vibe: '바람에 흔들려도 안 꺾이는 풀',
      story: '세게 부딪히기보다 돌아가며 목표에 닿는 스타일. 눈치와 적응력으로 판을 읽어요. 겉은 부드럽고 속은 질깁니다.',
      love: '다정한 케어에 약해요. 강압보다 공감해 주는 사람과 오래갑니다.',
      work: '조율·디자인·상담·콘텐츠처럼 “연결”하는 일에 강점.',
      caution: '결정을 미루다 기회를 놓칠 수 있어요. 작은 선택부터 해보세요.',
      keywords: ['유연', '감각', '적응력', '섬세']
    },
    丙: {
      nick: '태양형 분위기메이커',
      vibe: '낮의 태양',
      story: '있으면 공간이 밝아지는 사람. 열정과 표현력이 무기예요. 관심받는 걸 즐기고, 관심 주는 데도 인색하지 않아요.',
      love: '설렘과 이벤트를 좋아해요. 리액션 좋은 상대와 케미가 폭발합니다.',
      work: '발표·영업·크리에이티브·무대처럼 드러나는 자리에서 강함.',
      caution: '번아웃 주의. 쉬는 날도 “성과”로 채우지 마세요.',
      keywords: ['열정', '카리스마', '표현', '낙천']
    },
    丁: {
      nick: '촛불형 섬세파',
      vibe: '밤을 밝히는 촛불',
      story: '작아 보여도 따뜻한 집중력이 있어요. 디테일과 취향이 분명하고, 진심을 가리는 걸 싫어합니다.',
      love: '깊은 대화와 취향 공유가 연애의 핵심. 겉만 화려한 관계는 금방 식어요.',
      work: '연구·편집·요리·케어처럼 정성이 쌓이는 일에서 빛나요.',
      caution: '예민함이 과하면 스스로를 태워요. 경계를 정해 두세요.',
      keywords: ['섬세', '집중', '취향', '진정성']
    },
    戊: {
      nick: '산처럼 든든한 타입',
      vibe: '꿈쩍 않는 산',
      story: '믿음직함이 무기. 약속과 책임을 중요하게 여기고, 주변의 기둥이 되는 경우가 많아요.',
      love: '안정적인 관계에서 힘이 나요. 극적인 밀당보다 꾸준함이 통합니다.',
      work: '운영·관리·부동산·조직의 중심 역할에 잘 맞아요.',
      caution: '변화를 너무 미루면 기회가 지나가요. 가끔은 산을 내려오세요.',
      keywords: ['신뢰', '안정', '책임', '포용']
    },
    己: {
      nick: '밭을 가꾸는 실무형',
      vibe: '비옥한 흙',
      story: '거창한 말보다 손으로 증명하는 타입. 사람을 챙기고, 일상을 매끄럽게 만드는 데 재능이 있어요.',
      love: '챙겨주는 연애를 잘해요. 고마움을 표현해 주는 상대와 잘 맞습니다.',
      work: 'HR·교육·서비스·살림·프로젝트 실무에서 강점.',
      caution: '남을 챙기다 나를 놓치기 쉬워요. “거절”도 배려입니다.',
      keywords: ['실무', '돌봄', '현실감각', '성실']
    },
    庚: {
      nick: '강철 같은 원칙파',
      vibe: '벼려진 쇠',
      story: '명확한 기준과 결단이 강점. 애매한 걸 못 참고, 깔끔하게 정리하는 힘이 있어요.',
      love: '솔직·단호한 커뮤니케이션을 선호. 돌려 말하는 상대와는 답답할 수 있어요.',
      work: '법률·재무·엔지니어·수술·결단이 필요한 자리에서 빛나요.',
      caution: '날카로움이 상처가 될 수 있어요. 말 Soft 모드를 켜 두세요.',
      keywords: ['원칙', '결단', '정의', '정리']
    },
    辛: {
      nick: '보석처럼 예리한 감각파',
      vibe: '빛나는 보석',
      story: '미감과 품격에 민감해요. 대충을 싫어하고, 완성도 높은 결과물에 집착하는 편입니다.',
      love: '센스 있는 배려와 취향 케미가 중요. 무심한 상대는 금방 식어요.',
      work: '브랜드·패션·분석·전문직처럼 “퀄리티”가 보이는 일.',
      caution: '완벽주의가 시작을 막을 수 있어요. 70점으로 먼저 내보내세요.',
      keywords: ['세련', '예리', '자존감', '완성도']
    },
    壬: {
      nick: '큰 강물형 지혜파',
      vibe: '도도히 흐르는 강',
      story: '시야가 넓고 포용력이 커요. 막히면 돌아가고, 흐름을 읽어 판을 바꿉니다. 속마음은 생각보다 깊어요.',
      love: '지적 대화와 자유로운 호흡이 중요. 구속하는 관계는 숨이 막혀요.',
      work: '전략·투자·여행·미디어·네트워크형 일에 강점.',
      caution: '너무 많은 선택지에 표류할 수 있어요. 기준점 하나를 정해 두세요.',
      keywords: ['지혜', '포용', '유연', '스케일']
    },
    癸: {
      nick: '이슬처럼 직관적인 타입',
      vibe: '새벽 이슬',
      story: '작은 신호도 잘 느껴요. 직관이 빠르고, 분위기·감정 읽기에 능합니다. 겉은 조용해도 속은 풍부해요.',
      love: '정서적 안정과 섬세한 케어가 핵심. 거친 말투엔 오래 상처받아요.',
      work: '치유·예술·리서치·상담·야간/집중형 업무에 잘 맞아요.',
      caution: '감정에 휩쓸리면 결정이 흔들려요. 기록해 두면 중심이 잡힙니다.',
      keywords: ['직관', '감성', '통찰', '섬세']
    }
  };

  /** 일지(지지) 한 줄 맛 */
  var BRANCH_FLAVOR = {
    子: '밤의 지혜·재시작 기운이 일주에도 스며 있어요.',
    丑: '묵묵히 쌓는 힘이 더해져, 느리지만 단단합니다.',
    寅: '호랑이 기운처럼 시작과 모험 욕구가 커요.',
    卯: '봄바람처럼 관계·매력이 부드럽게 흐릅니다.',
    辰: '용의 스케일—큰 그림과 변화를 좋아해요.',
    巳: '뱀처럼 전략적·집중력이 날카로워집니다.',
    午: '한낮의 열정, 드러나고 싶은 에너지가 강해요.',
    未: '양처럼 온화하지만 속은 고집 있는 편.',
    申: '원숭이형 순발력·재치가 일주에 붙어요.',
    酉: '닭처럼 결·완성도·자기관리에 예민해요.',
    戌: '개처럼 의리·경계심·보호 본능이 있어요.',
    亥: '돼지·물의 포용, 감성과 여유를 품습니다.'
  };

  var SAMHAP = {
    0: [0, 4, 8],   // 申子辰 → indices of 子辰申? 子0 辰4 申8
    4: [0, 4, 8],
    8: [0, 4, 8],
    11: [11, 3, 7], // 亥卯未
    3: [11, 3, 7],
    7: [11, 3, 7],
    2: [2, 6, 10],  // 寅午戌
    6: [2, 6, 10],
    10: [2, 6, 10],
    5: [5, 9, 1],   // 巳酉丑
    9: [5, 9, 1],
    1: [5, 9, 1]
  };

  var YUKHAP = { 0: 1, 1: 0, 2: 11, 3: 10, 4: 9, 5: 8, 6: 7, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2 };
  var CHUNG = { 0: 6, 6: 0, 1: 7, 7: 1, 2: 8, 8: 2, 3: 9, 9: 3, 4: 10, 10: 4, 5: 11, 11: 5 };

  var ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

  function stemsOfOheng(type) {
    var out = [];
    var map = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
    for (var i = 0; i < 10; i++) if (map[i] === type) out.push(STEMS[i]);
    return out;
  }

  function getIljuStory(saju) {
    var day = saju.day;
    var year = saju.year;
    var stem = day.stem;
    var branch = day.branch;
    var oh = day.oheng.type;
    var base = STEM_STORY[stem];
    var bi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(branch);

    var meGen = GENERATES[oh];
    var genMe = GENERATED_BY[oh];
    var meCtrl = CONTROLS[oh];
    var ctrlMe = CONTROLLED_BY[oh];

    var sam = (SAMHAP[bi] || []).filter(function (i) { return i !== bi; }).map(function (i) { return ANIMALS[i]; });
    var yuk = ANIMALS[YUKHAP[bi]];
    var chung = ANIMALS[CHUNG[bi]];

    var yearAnimal = year.animal;
    var yearRel = '보통';
    if (yearAnimal === yuk) yearRel = '육합(잘 맞는 편)';
    else if (sam.indexOf(yearAnimal) >= 0) yearRel = '삼합(시너지)';
    else if (yearAnimal === chung) yearRel = '충(긴장·자극)';
    else if (yearAnimal === ANIMALS[bi]) yearRel = '같은 지지 기운';

    return {
      nick: base.nick,
      vibe: base.vibe,
      headline: day.pillar + ' · ' + base.nick,
      story: base.story + ' ' + (BRANCH_FLAVOR[branch] || ''),
      love: base.love,
      work: base.work,
      caution: base.caution,
      keywords: base.keywords,
      oheng: oh,
      relations: {
        generates: {
          type: meGen,
          title: '내가 살려 주는 기운',
          text: '나는 ' + OHENG_KO[meGen].icon + OHENG_KO[meGen].ko + '를 생(生)해요. ' +
            OHENG_KO[meGen].people + '과 있으면 에너지가 자연스럽게 이어지는 편.'
        },
        generatedBy: {
          type: genMe,
          title: '나를 살려 주는 기운',
          text: OHENG_KO[genMe].icon + OHENG_KO[genMe].ko + '가 나를 생해 줘요. ' +
            '이 기운 사람과는 든든한 상생 케미가 나기 쉽습니다.'
        },
        controls: {
          type: meCtrl,
          title: '내가 누르는 기운',
          text: '나는 ' + OHENG_KO[meCtrl].ko + '를 극(剋)해요. 잘 쓰면 추진력이지만, 과하면 마찰.'
        },
        controlledBy: {
          type: ctrlMe,
          title: '나를 긴장시키는 기운',
          text: OHENG_KO[ctrlMe].ko + '와는 상극 긴장. 끌리기도 하지만 배려가 필수.'
        }
      },
      match: {
        bestOheng: OHENG_KO[genMe],
        bestOhengLabel: OHENG_KO[genMe].ko + ' · ' + OHENG_KO[meGen].ko,
        bestStems: stemsOfOheng(genMe).concat(stemsOfOheng(meGen)),
        bestAnimals: [yuk].concat(sam),
        cautionAnimal: chung,
        dayBranchAnimal: ANIMALS[bi],
        yearNote: '내 띠(' + yearAnimal + ')와 일지(' + ANIMALS[bi] + '): ' + yearRel
      },
      curiosities: [
        { q: '연애·궁합, 한 줄로?', a: base.love },
        { q: '일·공부 스타일은?', a: base.work },
        { q: '특히 잘 맞는 오행은?', a: '상생 기준으론 ' + OHENG_KO[genMe].ko + '(나를 생함) · ' + OHENG_KO[meGen].ko + '(내가 생함) 쪽이 편해요.' },
        { q: '띠로 보면?', a: '일지 기준 육합은 ' + yuk + '띠, 삼합은 ' + sam.join('·') + '띠. 충은 ' + chung + '띠—자극적이지만 조심.' },
        { q: '조심할 포인트는?', a: base.caution }
      ]
    };
  }

  global.IljuStory = {
    getIljuStory: getIljuStory,
    OHENG_KO: OHENG_KO,
    STEM_STORY: STEM_STORY
  };
})(typeof window !== 'undefined' ? window : this);

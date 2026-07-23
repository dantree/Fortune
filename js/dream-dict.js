/**
 * 꿈해몽 — 키워드 사전 (결정론, AI 없음)
 * 같은 입력 → 같은 결과
 */
(function (global) {
  'use strict';

  /**
   * tone: good | care | mixed
   * aliases: 검색용 추가 키워드
   */
  var ENTRIES = [
    { key: '뱀', aliases: ['뱀꿈', '구렁이'], emoji: '🐍', tone: 'mixed',
      title: '뱀 꿈',
      short: '변화·각성이 다가온다는 신호로 많이 읽습니다.',
      tip: '미뤄 둔 결정을 정리해 보세요. 건강·계약은 한 번 더 확인.',
      luck: '변화운' },
    { key: '물', aliases: ['바다', '강', '호수', '홍수', '수영', '비'], emoji: '🌊', tone: 'mixed',
      title: '물·바다 꿈',
      short: '감정·흐름·재물이 움직이는 꿈으로 봅니다.',
      tip: '맑은 물이면 기회, 탁하거나 넘치면 감정을 정리할 때.',
      luck: '감정·재물' },
    { key: '불', aliases: ['화재', '불꽃', '타다'], emoji: '🔥', tone: 'care',
      title: '불 꿈',
      short: '열정·분노·급한 변화가 겹친 공기로 읽습니다.',
      tip: '말·충동 소비를 줄이고, 에너지는 한 가지에만 쓰세요.',
      luck: '열정·주의' },
    { key: '이', aliases: ['이빨', '치아', '이빠지', '이 빠'], emoji: '🦷', tone: 'care',
      title: '이(치아) 꿈',
      short: '말·체면·가족 걱정이 나온다는 고전 해석이 많습니다.',
      tip: '중요한 말은 적어서 보내고, 가족·건강을 챙기세요.',
      luck: '말·관계' },
    { key: '피', aliases: ['피나', '출혈'], emoji: '🩸', tone: 'care',
      title: '피 꿈',
      short: '기운 소모·스트레스 해소 욕구로 자주 읽습니다.',
      tip: '무리한 일정은 줄이고, 회복·수면을 우선하세요.',
      luck: '건강' },
    { key: '똥', aliases: ['대변', '소변', '화장실'], emoji: '💩', tone: 'good',
      title: '똥·화장실 꿈',
      short: '재물·해소·정리를 뜻하는 길몽으로 많이 봅니다.',
      tip: '쌓아 둔 일을 비우면 돈이든 마음이든 공간이 생깁니다.',
      luck: '재물·정리' },
    { key: '돈', aliases: ['지폐', '동전', '월급', '금', '보석'], emoji: '💰', tone: 'good',
      title: '돈·재물 꿈',
      short: '기회·가치 인식이 커지는 때로 읽습니다.',
      tip: '큰 베팅보다 수입·저축 구조를 손보는 쪽이 이득.',
      luck: '재물' },
    { key: '귀신', aliases: ['유령', '원귀', '혼령'], emoji: '👻', tone: 'care',
      title: '귀신 꿈',
      short: '억눌린 감정·미해결 과제가 드러난다고 봅니다.',
      tip: '미룬 연락·후회를 정리하면 마음이 가벼워집니다.',
      luck: '마음·정리' },
    { key: '죽은', aliases: ['죽음', '장례', '시체', '돌아가'], emoji: '🕯️', tone: 'mixed',
      title: '죽음·장례 꿈',
      short: '끝이 아니라 전환·마무리의 상징으로 많이 읽습니다.',
      tip: '한 챕터를 정리하고 다음을 준비하는 때로 보세요.',
      luck: '전환' },
    { key: '임신', aliases: ['출산', '아기', '임신했'], emoji: '🤰', tone: 'good',
      title: '임신·아기 꿈',
      short: '새 시작·아이디어·책임이 싹튼다는 뜻으로 봅니다.',
      tip: '새 프로젝트·배움을 시작해 보기 좋은 신호.',
      luck: '시작·창조' },
    { key: '개', aliases: ['강아지', '멍멍'], emoji: '🐕', tone: 'good',
      title: '개 꿈',
      short: '충실한 인연·보호·경계심을 동시에 봅니다.',
      tip: '믿을 사람과의 약속을 지키면 운이 돕습니다.',
      luck: '인연' },
    { key: '고양이', aliases: ['야옹', '냥이'], emoji: '🐱', tone: 'mixed',
      title: '고양이 꿈',
      short: '직관·독립·예민한 감각이 깨어난 꿈.',
      tip: '혼자만의 시간을 확보하되, 소통은 끊지 마세요.',
      luck: '직관' },
    { key: '쥐', aliases: ['생쥐', '들쥐'], emoji: '🐭', tone: 'mixed',
      title: '쥐 꿈',
      short: '작은 걱정·이득·재빠른 기회를 뜻하기도 합니다.',
      tip: '사소한 누수를 막고, 작은 기회를 기록하세요.',
      luck: '세심·기회' },
    { key: '거미', aliases: ['거미줄'], emoji: '🕷️', tone: 'care',
      title: '거미 꿈',
      short: '얽힌 관계·계획의 그물로 읽습니다.',
      tip: '복잡하게 꼬인 일을 하나씩 풀면 길이 납니다.',
      luck: '관계·계획' },
    { key: '벌레', aliases: ['바퀴', '구더기', '개미'], emoji: '🐛', tone: 'care',
      title: '벌레 꿈',
      short: '짜증·사소한 방해가 쌓인 상태로 봅니다.',
      tip: '미룬 잡무를 처리하면 기분이 한결 가벼워집니다.',
      luck: '정리' },
    { key: '비행기', aliases: ['비행', '공항'], emoji: '✈️', tone: 'good',
      title: '비행기 꿈',
      short: '시야 확장·이동·도약의 꿈으로 읽습니다.',
      tip: '멀리 보고 준비한 일을 꺼내 보세요.',
      luck: '도약' },
    { key: '추락', aliases: ['떨어지', '낙하', '떨어졌'], emoji: '⬇️', tone: 'care',
      title: '추락 꿈',
      short: '통제감 상실·불안이 표현된 꿈이 많습니다.',
      tip: '한꺼번에 잡지 말고, 발을 디딜 곳부터 확인하세요.',
      luck: '안정' },
    { key: '날다', aliases: ['날아', '비행하', '공중'], emoji: '🕊️', tone: 'good',
      title: '나는 꿈',
      short: '자유·해방·자신감이 올라온 신호로 봅니다.',
      tip: '하고 싶었던 표현·도전을 작게라도 시작해 보세요.',
      luck: '자유·도전' },
    { key: '쫓기', aliases: ['도망', '쫓아', '도망치'], emoji: '🏃', tone: 'care',
      title: '쫓기는 꿈',
      short: '회피하고 싶은 과제·압박을 뜻합니다.',
      tip: '피하던 일 하나를 작게 마주하면 압박이 줄어요.',
      luck: '과제' },
    { key: '시험', aliases: ['면접', '발표', '성적'], emoji: '📝', tone: 'mixed',
      title: '시험·면접 꿈',
      short: '평가·준비 상태가 꿈에 투영된 경우입니다.',
      tip: '완벽보다 “준비된 것”을 드러내는 데 집중하세요.',
      luck: '평가' },
    { key: '결혼', aliases: ['결혼식', '웨딩', '신랑', '신부'], emoji: '💒', tone: 'good',
      title: '결혼 꿈',
      short: '결합·약속·새로운 역할의 시작으로 읽습니다.',
      tip: '약속·협업·관계를 진지하게 다뤄볼 타이밍.',
      luck: '인연·약속' },
    { key: '이별', aliases: ['헤어지', '이혼', '차임'], emoji: '💔', tone: 'care',
      title: '이별 꿈',
      short: '관계 재정비·감정 정리가 필요하다는 신호.',
      tip: '말다툼보다 한 박자 쉬고, 진짜 원하는 걸 적으세요.',
      luck: '관계' },
    { key: '집', aliases: ['아파트', '방', '이사', '집꿈'], emoji: '🏠', tone: 'mixed',
      title: '집·방 꿈',
      short: '자아·안정·생활 기반을 상징합니다.',
      tip: '정리된 공간·루틴이 운을 받쳐 줍니다.',
      luck: '기반' },
    { key: '차', aliases: ['자동차', '운전', '버스', '지하철', '기차'], emoji: '🚗', tone: 'mixed',
      title: '차·운전 꿈',
      short: '인생 방향·통제권을 뜻하는 꿈입니다.',
      tip: '핸들을 쥐고 있는지, 남에게 맡겼는지 점검해 보세요.',
      luck: '방향' },
    { key: '학교', aliases: ['교실', '선생님', '동창'], emoji: '🏫', tone: 'mixed',
      title: '학교 꿈',
      short: '배움·비교·과거의 나를 다시 만나는 꿈.',
      tip: '배우려는 태도만 유지해도 귀인이 붙습니다.',
      luck: '배움' },
    { key: '직장', aliases: ['회사', '상사', '출근', '퇴사'], emoji: '💼', tone: 'mixed',
      title: '직장 꿈',
      short: '역할·압박·인정 욕구가 드러난 꿈.',
      tip: '성과는 숫자로, 감정은 짧게 정리하세요.',
      luck: '직장' },
    { key: '전화', aliases: ['통화', '문자', '카톡'], emoji: '📱', tone: 'mixed',
      title: '전화·연락 꿈',
      short: '소통·소식·미해결 대화의 신호.',
      tip: '미룬 연락 하나를 보내면 흐름이 풀릴 수 있어요.',
      luck: '소통' },
    { key: '옷', aliases: ['옷입', '알몸', '벗은'], emoji: '👔', tone: 'mixed',
      title: '옷·알몸 꿈',
      short: '자기 표현·노출 불안·이미지 관리와 연결됩니다.',
      tip: '있는 그대로 나서되, 보여줄 선은 스스로 정하세요.',
      luck: '표현' },
    { key: '열쇠', aliases: ['자물쇠', '문열'], emoji: '🔑', tone: 'good',
      title: '열쇠 꿈',
      short: '해결책·권한이 손에 들어온다는 뜻으로 봅니다.',
      tip: '막혀 있던 문제의 “열쇠”가 가까운 곳에 있을 수 있어요.',
      luck: '해결' },
    { key: '다리', aliases: ['교량', '다리건너'], emoji: '🌉', tone: 'good',
      title: '다리 꿈',
      short: '연결·전환·다음 단계로 가는 통로.',
      tip: '망설이던 연결(사람·일)을 이어 보세요.',
      luck: '연결' },
    { key: '산', aliases: ['등산', '정상', '산꼭대기'], emoji: '⛰️', tone: 'good',
      title: '산 꿈',
      short: '목표·인내·성취 과정의 상징입니다.',
      tip: '한 걸음씩이면 충분합니다. 정상을 서두르지 마세요.',
      luck: '목표' },
    { key: '꽃', aliases: ['꽃다발', '벚꽃', '장미'], emoji: '🌸', tone: 'good',
      title: '꽃 꿈',
      short: '기쁨·인정·관계의 꽃이 핀다는 길몽 쪽.',
      tip: '칭찬·감사·작은 선물이 운을 키웁니다.',
      luck: '기쁨·관계' },
    { key: '나무', aliases: ['숲', '나무꿈'], emoji: '🌳', tone: 'good',
      title: '나무 꿈',
      short: '성장·뿌리·지속 가능한 힘을 뜻합니다.',
      tip: '당장 결과보다 뿌리를 깊게 두는 선택이 이득.',
      luck: '성장' },
    { key: '비', aliases: ['장마', '폭우'], emoji: '🌧️', tone: 'mixed',
      title: '비 꿈',
      short: '감정 정화·휴식·재충전으로 읽습니다.',
      tip: '억지로 밝히지 말고, 잠깐 쉬어 가도 됩니다.',
      luck: '정화' },
    { key: '눈', aliases: ['폭설', '눈오'], emoji: '❄️', tone: 'mixed',
      title: '눈 꿈',
      short: '순수·정체·새로운 덮개의 상징.',
      tip: '서두르지 말고, 판이 깨끗해질 때를 기다리세요.',
      luck: '대기' },
    { key: '거울', aliases: ['거울보'], emoji: '🪞', tone: 'mixed',
      title: '거울 꿈',
      short: '자기 인식·솔직한 자기 평가의 꿈.',
      tip: '남의 시선보다 “내가 나를 어떻게 보는지”가 핵심.',
      luck: '자아' },
    { key: '시계', aliases: ['시간', '늦잠', '지각'], emoji: '⏰', tone: 'care',
      title: '시계·시간 꿈',
      short: '타이밍 압박·놓칠까 봐 하는 불안.',
      tip: '마감은 지키되, 서두른 실수는 줄이세요.',
      luck: '타이밍' },
    { key: '음식', aliases: ['밥', '먹이', '만찬', '과일'], emoji: '🍚', tone: 'good',
      title: '음식 꿈',
      short: '충족·양분·관계의 나눔으로 봅니다.',
      tip: '몸과 마음을 채우는 선택을 우선하세요.',
      luck: '충족' },
    { key: '노래', aliases: ['가수', '공연', '춤'], emoji: '🎤', tone: 'good',
      title: '노래·공연 꿈',
      short: '표현·인정·재능이 밖으로 나가려는 꿈.',
      tip: '숨긴 재능을 작게라도 드러내 보세요.',
      luck: '표현' },
    { key: '전쟁', aliases: ['싸움', '총', '칼싸움'], emoji: '⚔️', tone: 'care',
      title: '싸움·전쟁 꿈',
      short: '내면 갈등·외부 대립이 커진 상태.',
      tip: '이길 싸움만 고르고, 말은 짧게.',
      luck: '갈등' },
    { key: '왕', aliases: ['여왕', '왕자', '공주', '황제'], emoji: '👑', tone: 'good',
      title: '왕·공주 꿈',
      short: '자존감·리더십·대우에 대한 바람.',
      tip: '책임을 받아들일수록 자리가 따라옵니다.',
      luck: '지위' },
    { key: '병원', aliases: ['의사', '약', '수술'], emoji: '🏥', tone: 'care',
      title: '병원 꿈',
      short: '치유·점검이 필요하다는 몸의 메시지일 수 있어요.',
      tip: '미룬 검진·휴식을 달력에 넣으세요.',
      luck: '건강' },
    { key: '감옥', aliases: ['갇히', '감금', '철창'], emoji: '🔒', tone: 'care',
      title: '갇힌 꿈',
      short: '제약·의무·스스로 만든 한계의 표현.',
      tip: '꼭 지켜야 할 것과 버려도 될 것을 나누세요.',
      luck: '자유' },
    { key: '엘리베이터', aliases: ['승강기', '에스컬레이터'], emoji: '🛗', tone: 'mixed',
      title: '엘리베이터 꿈',
      short: '빠른 상승·하강, 상황의 급변.',
      tip: '올라갈 때일수록 안전벨트(기본)를 확인하세요.',
      luck: '변동' },
    { key: '지갑', aliases: ['분실', '잃어버'], emoji: '👛', tone: 'care',
      title: '지갑·분실 꿈',
      short: '정체성·자원·통제감 상실 불안.',
      tip: '비밀번호·계약·중요 물건을 한 번 점검하세요.',
      luck: '관리' },
    { key: '친구', aliases: ['옛친구', '동창'], emoji: '🤝', tone: 'good',
      title: '친구 꿈',
      short: '지지·비교·과거 나와의 대화.',
      tip: '편해지는 사람에게 먼저 연락해 보세요.',
      luck: '인맥' },
    { key: '부모', aliases: ['엄마', '아빠', '어머니', '아버지'], emoji: '👪', tone: 'mixed',
      title: '부모 꿈',
      short: '보호·기대·뿌리와의 연결.',
      tip: '감사나 경계를 분명히 하면 마음이 편해집니다.',
      luck: '가족' },
    { key: '연예인', aliases: ['아이돌', '배우', '유명인'], emoji: '🌟', tone: 'mixed',
      title: '연예인 꿈',
      short: '인정 욕구·이상적 이미지 투영.',
      tip: '동경을 “내가 키울 한 가지”로 바꿔 보세요.',
      luck: '인정' }
  ];

  var TONE = {
    good: { label: '길한 편', color: '#0d9488' },
    care: { label: '조심·정리', color: '#c2410c' },
    mixed: { label: '상황에 따라', color: '#6b4eff' }
  };

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[.,!?'"~…]/g, '');
  }

  function findMatches(text) {
    var n = normalize(text);
    if (!n) return [];
    var hits = [];
    for (var i = 0; i < ENTRIES.length; i++) {
      var e = ENTRIES[i];
      var keys = [e.key].concat(e.aliases || []);
      /* 한 글자 키(특히 '이')는 조사와 섞이므로 긴 별칭만 */
      if (e.key.length <= 1 || e.key === '이') {
        keys = (e.aliases || []).filter(function (a) {
          return normalize(a).length >= 2;
        });
      }
      for (var k = 0; k < keys.length; k++) {
        if (n.indexOf(normalize(keys[k])) !== -1) {
          hits.push(e);
          break;
        }
      }
    }
    return hits;
  }

  function interpret(text) {
    var raw = String(text || '').trim();
    var matches = findMatches(raw);
    if (!matches.length) {
      return {
        ok: false,
        matches: [],
        summary: '키워드를 찾지 못했어요. 예: 뱀, 물, 이, 돈, 똥, 비행기, 쫓기는 꿈',
        tips: ['꿈에 나온 사물·동물·행동을 한두 단어로 적어 보세요.'],
        chips: ENTRIES.slice(0, 12).map(function (e) { return e.key; })
      };
    }

    var toneScore = { good: 0, care: 0, mixed: 0 };
    matches.forEach(function (m) { toneScore[m.tone] = (toneScore[m.tone] || 0) + 1; });
    var overall =
      toneScore.care >= toneScore.good ? 'care'
        : toneScore.good > 0 ? 'good' : 'mixed';

    var summary =
      matches.length === 1
        ? matches[0].emoji + ' ' + matches[0].title + ' — ' + matches[0].short
        : '꿈에서 ' + matches.map(function (m) { return m.key; }).join('·') +
          '이(가) 보였어요. 여러 상징이 겹치면, 그중 가장 강한 감정 쪽을 우선으로 읽습니다.';

    var tips = matches.map(function (m) { return m.tip; });
    var uniqTips = [];
    tips.forEach(function (t) {
      if (uniqTips.indexOf(t) === -1) uniqTips.push(t);
    });

    return {
      ok: true,
      matches: matches,
      overall: overall,
      overallLabel: TONE[overall].label,
      summary: summary,
      tips: uniqTips.slice(0, 3),
      chips: ENTRIES.slice(0, 12).map(function (e) { return e.key; })
    };
  }

  function listPopular(n) {
    return ENTRIES.slice(0, n || 16).map(function (e) {
      return { key: e.key, emoji: e.emoji, title: e.title };
    });
  }

  global.DreamDict = {
    interpret: interpret,
    listPopular: listPopular,
    ENTRIES: ENTRIES,
    TONE: TONE
  };
})(typeof window !== 'undefined' ? window : this);

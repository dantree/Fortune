/**
 * 이름 풀이 — 한글(간이) + 한자 획수(성명학 참고)
 * AI 없음 · 같은 선택 = 같은 결과
 *
 * 한자 획수: 옥편(강희자전)식 획수 기준의 흔한 표기
 * ※ 작명소마다 원획/옥편 차이로 1~2획 다를 수 있음
 */
(function (global) {
  'use strict';

  var CHO_STROKE = [2, 4, 2, 3, 6, 5, 4, 4, 8, 2, 4, 1, 3, 6, 4, 3, 4, 4, 3];
  var JUNG_STROKE = [2, 3, 3, 4, 2, 3, 3, 4, 2, 4, 5, 3, 3, 2, 4, 5, 3, 3, 1, 2, 1];
  var JONG_STROKE = [0, 2, 4, 4, 2, 5, 5, 3, 5, 7, 9, 9, 7, 9, 9, 3, 4, 4, 2, 4, 1, 3, 4, 3, 4, 2, 4, 3];

  var OHENG = {
    wood: { id: 'wood', ko: '목', icon: '🌳', tip: '성장·시작·기획에 힘이 실립니다.' },
    fire: { id: 'fire', ko: '화', icon: '🔥', tip: '표현·열정·대외 활동이 잘 붙습니다.' },
    earth: { id: 'earth', ko: '토', icon: '🪨', tip: '신뢰·실무·중심 잡기가 강점입니다.' },
    metal: { id: 'metal', ko: '금', icon: '⚙️', tip: '결단·완성·기준이 분명해집니다.' },
    water: { id: 'water', ko: '수', icon: '💧', tip: '지혜·흐름·유연함이 길을 엽니다.' }
  };

  function strokeToOheng(n) {
    var d = ((n % 10) + 10) % 10;
    if (d === 1 || d === 2) return OHENG.wood;
    if (d === 3 || d === 4) return OHENG.fire;
    if (d === 5 || d === 6) return OHENG.earth;
    if (d === 7 || d === 8) return OHENG.metal;
    return OHENG.water;
  }

  var CHO_SOUND = [
    'wood', 'wood', 'fire', 'fire', 'fire', 'fire', 'water', 'water', 'water',
    'metal', 'metal', 'earth', 'metal', 'metal', 'metal', 'wood', 'fire', 'water', 'earth'
  ];

  /**
   * 한글 음 → 흔한 이름용 한자 후보
   * stroke: 옥편 획수, el: 자원·의미상 오행(참고)
   */
  var HANJA = {
    /* 성씨 */
    '김': [{ h: '金', s: 8, m: '쇠·김', el: 'metal' }],
    '이': [{ h: '李', s: 7, m: '오얏나무', el: 'wood' }, { h: '異', s: 12, m: '다를', el: 'wood' }],
    '박': [{ h: '朴', s: 6, m: '순박할', el: 'wood' }],
    '최': [{ h: '崔', s: 11, m: '높을', el: 'earth' }],
    '정': [
      { h: '鄭', s: 19, m: '나라 이름', el: 'fire' },
      { h: '丁', s: 2, m: '고무래', el: 'fire' },
      { h: '正', s: 5, m: '바를', el: 'fire' },
      { h: '貞', s: 9, m: '곧을', el: 'fire' }
    ],
    '강': [{ h: '姜', s: 9, m: '성씨', el: 'wood' }, { h: '康', s: 11, m: '편안할', el: 'wood' }],
    '조': [{ h: '趙', s: 14, m: '나라 이름', el: 'fire' }, { h: '曺', s: 11, m: '성씨', el: 'fire' }],
    '윤': [{ h: '尹', s: 4, m: '다스릴', el: 'earth' }],
    '장': [{ h: '張', s: 11, m: '베풀', el: 'fire' }, { h: '章', s: 11, m: '글월', el: 'fire' }],
    '임': [{ h: '林', s: 8, m: '수풀', el: 'wood' }, { h: '任', s: 6, m: '맡길', el: 'water' }],
    '한': [{ h: '韓', s: 17, m: '나라 이름', el: 'water' }, { h: '漢', s: 14, m: '한수', el: 'water' }],
    '오': [{ h: '吳', s: 7, m: '성씨', el: 'wood' }, { h: '五', s: 4, m: '다섯', el: 'earth' }],
    '신': [{ h: '申', s: 5, m: '필', el: 'earth' }, { h: '辛', s: 7, m: '매울', el: 'metal' }],
    '서': [{ h: '徐', s: 10, m: '천천히', el: 'wood' }, { h: '西', s: 6, m: '서쪽', el: 'metal' }],
    '권': [{ h: '權', s: 22, m: '권세', el: 'wood' }],
    '황': [{ h: '黃', s: 12, m: '누를', el: 'earth' }],
    '안': [{ h: '安', s: 6, m: '편안할', el: 'earth' }],
    '송': [{ h: '宋', s: 7, m: '나라이름', el: 'metal' }, { h: '松', s: 8, m: '소나무', el: 'wood' }],
    '전': [{ h: '全', s: 6, m: '온전할', el: 'metal' }, { h: '田', s: 5, m: '밭', el: 'earth' }],
    '홍': [{ h: '洪', s: 9, m: '넓을', el: 'water' }],
    '유': [
      { h: '柳', s: 9, m: '버들', el: 'wood' },
      { h: '劉', s: 15, m: '성씨', el: 'metal' },
      { h: '兪', s: 9, m: '응할', el: 'water' }
    ],
    '고': [{ h: '高', s: 10, m: '높을', el: 'wood' }],
    '문': [{ h: '文', s: 4, m: '글월', el: 'water' }, { h: '門', s: 8, m: '문', el: 'water' }],
    '양': [{ h: '梁', s: 11, m: '들보', el: 'fire' }, { h: '楊', s: 13, m: '버들', el: 'wood' }],
    '손': [{ h: '孫', s: 10, m: '손자', el: 'metal' }],
    '배': [{ h: '裵', s: 15, m: '성씨', el: 'water' }],
    '백': [{ h: '白', s: 5, m: '흰', el: 'metal' }],
    '허': [{ h: '許', s: 11, m: '허락할', el: 'wood' }],
    '남': [{ h: '南', s: 9, m: '남쪽', el: 'fire' }],
    '심': [{ h: '沈', s: 7, m: '잠길', el: 'water' }],
    '노': [{ h: '盧', s: 16, m: '성씨', el: 'fire' }, { h: '魯', s: 15, m: '노나라', el: 'fire' }],
    '하': [{ h: '河', s: 8, m: '물', el: 'water' }, { h: '夏', s: 10, m: '여름', el: 'fire' }],
    '곽': [{ h: '郭', s: 11, m: '둘레', el: 'wood' }],
    '성': [{ h: '成', s: 6, m: '이룰', el: 'earth' }, { h: '星', s: 9, m: '별', el: 'earth' }],
    '차': [{ h: '車', s: 7, m: '수레', el: 'earth' }],
    '주': [{ h: '朱', s: 6, m: '붉을', el: 'wood' }, { h: '周', s: 8, m: '두루', el: 'earth' }],
    '우': [{ h: '禹', s: 9, m: '임금', el: 'earth' }, { h: '于', s: 3, m: '어조사', el: 'earth' }],
    '구': [{ h: '具', s: 8, m: '갖출', el: 'wood' }, { h: '丘', s: 5, m: '언덕', el: 'earth' }],
    '민': [{ h: '閔', s: 12, m: '민망할', el: 'water' }],
    '류': [{ h: '柳', s: 9, m: '버들', el: 'wood' }, { h: '劉', s: 15, m: '성씨', el: 'metal' }],
    '나': [{ h: '羅', s: 19, m: '그물', el: 'fire' }],
    '진': [{ h: '陳', s: 11, m: '베풀', el: 'fire' }, { h: '秦', s: 10, m: '나라이름', el: 'earth' }],
    '엄': [{ h: '嚴', s: 20, m: '엄할', el: 'wood' }],
    '원': [{ h: '元', s: 4, m: '으뜸', el: 'wood' }, { h: '袁', s: 10, m: '옷', el: 'earth' }],
    '천': [{ h: '千', s: 3, m: '일천', el: 'metal' }],
    '방': [{ h: '方', s: 4, m: '모', el: 'water' }, { h: '房', s: 8, m: '방', el: 'water' }],
    '공': [{ h: '孔', s: 4, m: '구멍', el: 'wood' }],
    '현': [{ h: '玄', s: 5, m: '검을', el: 'water' }],
    '함': [{ h: '咸', s: 9, m: '다', el: 'water' }],
    '표': [{ h: '表', s: 8, m: '겉', el: 'wood' }],
    '변': [{ h: '卞', s: 4, m: '법', el: 'water' }, { h: '邊', s: 19, m: '가', el: 'water' }],

    /* 이름에 자주 쓰는 글자 */
    '민': [
      { h: '敏', s: 11, m: '민첩할', el: 'water' },
      { h: '珉', s: 9, m: '옥돌', el: 'earth' },
      { h: '旻', s: 8, m: '하늘', el: 'water' },
      { h: '慜', s: 15, m: '총명할', el: 'water' }
    ],
    '수': [
      { h: '秀', s: 7, m: '빼어날', el: 'wood' },
      { h: '洙', s: 9, m: '물이름', el: 'water' },
      { h: '守', s: 6, m: '지킬', el: 'earth' },
      { h: '壽', s: 14, m: '목숨', el: 'metal' },
      { h: '修', s: 10, m: '닦을', el: 'metal' }
    ],
    '지': [
      { h: '智', s: 12, m: '지혜', el: 'fire' },
      { h: '志', s: 7, m: '뜻', el: 'fire' },
      { h: '知', s: 8, m: '알', el: 'fire' },
      { h: '芝', s: 7, m: '지초', el: 'wood' },
      { h: '趾', s: 11, m: '발', el: 'fire' }
    ],
    '현': [
      { h: '賢', s: 15, m: '어질', el: 'wood' },
      { h: '玄', s: 5, m: '검을', el: 'water' },
      { h: '炫', s: 9, m: '빛날', el: 'fire' },
      { h: '現', s: 11, m: '나타날', el: 'wood' },
      { h: '泫', s: 8, m: '빛나는 물', el: 'water' }
    ],
    '준': [
      { h: '俊', s: 9, m: '준걸', el: 'wood' },
      { h: '峻', s: 10, m: '높을', el: 'earth' },
      { h: '濬', s: 17, m: '깊을', el: 'water' },
      { h: '準', s: 13, m: '준할', el: 'water' }
    ],
    '서': [
      { h: '瑞', s: 13, m: '상서', el: 'earth' },
      { h: '徐', s: 10, m: '천천히', el: 'wood' },
      { h: '序', s: 7, m: '차례', el: 'wood' },
      { h: '西', s: 6, m: '서쪽', el: 'metal' }
    ],
    '윤': [
      { h: '尹', s: 4, m: '다스릴', el: 'earth' },
      { h: '潤', s: 15, m: '윤택할', el: 'water' },
      { h: '允', s: 4, m: '옳을', el: 'earth' },
      { h: '玧', s: 8, m: '옥', el: 'earth' }
    ],
    '하': [
      { h: '夏', s: 10, m: '여름', el: 'fire' },
      { h: '河', s: 8, m: '물', el: 'water' },
      { h: '荷', s: 11, m: '연꽃', el: 'wood' },
      { h: '霞', s: 17, m: '놀', el: 'fire' }
    ],
    '은': [
      { h: '恩', s: 10, m: '은혜', el: 'earth' },
      { h: '銀', s: 14, m: '은', el: 'metal' },
      { h: '殷', s: 10, m: '성할', el: 'earth' },
      { h: '誾', s: 15, m: '화평할', el: 'wood' }
    ],
    '아': [
      { h: '雅', s: 12, m: '우아할', el: 'earth' },
      { h: '娥', s: 10, m: '예쁠', el: 'earth' },
      { h: '亞', s: 8, m: '버금', el: 'earth' }
    ],
    '영': [
      { h: '英', s: 9, m: '꽃부리', el: 'wood' },
      { h: '永', s: 5, m: '길', el: 'water' },
      { h: '榮', s: 14, m: '영화', el: 'wood' },
      { h: '映', s: 9, m: '비칠', el: 'fire' }
    ],
    '진': [
      { h: '珍', s: 9, m: '보배', el: 'earth' },
      { h: '眞', s: 10, m: '참', el: 'metal' },
      { h: '振', s: 10, m: '떨칠', el: 'fire' },
      { h: '進', s: 12, m: '나아갈', el: 'metal' }
    ],
    '우': [
      { h: '雨', s: 8, m: '비', el: 'water' },
      { h: '佑', s: 7, m: '도울', el: 'wood' },
      { h: '宇', s: 6, m: '집', el: 'earth' },
      { h: '優', s: 17, m: '뛰어날', el: 'earth' },
      { h: '友', s: 4, m: '벗', el: 'earth' }
    ],
    '빈': [
      { h: '彬', s: 11, m: '빛날', el: 'wood' },
      { h: '斌', s: 12, m: '빛날', el: 'water' },
      { h: '賓', s: 14, m: '손님', el: 'water' }
    ],
    '호': [
      { h: '浩', s: 10, m: '넓을', el: 'water' },
      { h: '昊', s: 8, m: '하늘', el: 'water' },
      { h: '鎬', s: 18, m: '호경', el: 'metal' },
      { h: '虎', s: 8, m: '범', el: 'earth' }
    ],
    '성': [
      { h: '成', s: 6, m: '이룰', el: 'earth' },
      { h: '聖', s: 13, m: '성인', el: 'earth' },
      { h: '星', s: 9, m: '별', el: 'earth' },
      { h: '誠', s: 13, m: '정성', el: 'earth' }
    ],
    '연': [
      { h: '娟', s: 10, m: '예쁠', el: 'earth' },
      { h: '延', s: 7, m: '늘일', el: 'earth' },
      { h: '淵', s: 12, m: '못', el: 'water' },
      { h: '緣', s: 15, m: '인연', el: 'earth' }
    ],
    '희': [
      { h: '喜', s: 12, m: '기쁠', el: 'wood' },
      { h: '熙', s: 13, m: '빛날', el: 'water' },
      { h: '姬', s: 10, m: '여자', el: 'wood' },
      { h: '希', s: 7, m: '바랄', el: 'wood' }
    ],
    '정': [
      { h: '正', s: 5, m: '바를', el: 'fire' },
      { h: '貞', s: 9, m: '곧을', el: 'fire' },
      { h: '靜', s: 16, m: '고요할', el: 'metal' },
      { h: '婷', s: 12, m: '예쁠', el: 'fire' },
      { h: '情', s: 11, m: '마음', el: 'metal' }
    ],
    '혜': [
      { h: '惠', s: 12, m: '은혜', el: 'earth' },
      { h: '慧', s: 15, m: '슬기로울', el: 'water' },
      { h: '蕙', s: 16, m: '혜초', el: 'wood' }
    ],
    '나': [
      { h: '娜', s: 10, m: '아리따울', el: 'fire' },
      { h: '羅', s: 19, m: '그물', el: 'fire' },
      { h: '奈', s: 8, m: '어찌', el: 'fire' }
    ],
    '라': [
      { h: '羅', s: 19, m: '그물', el: 'fire' },
      { h: '剌', s: 9, m: '발랄할', el: 'fire' }
    ],
    '리': [
      { h: '利', s: 7, m: '이로울', el: 'fire' },
      { h: '李', s: 7, m: '오얏', el: 'wood' },
      { h: '俐', s: 9, m: '영리할', el: 'fire' }
    ],
    '미': [
      { h: '美', s: 9, m: '아름다울', el: 'water' },
      { h: '米', s: 6, m: '쌀', el: 'water' },
      { h: '薇', s: 17, m: '장미', el: 'wood' }
    ],
    '경': [
      { h: '京', s: 8, m: '서울', el: 'wood' },
      { h: '慶', s: 15, m: '경사', el: 'wood' },
      { h: '景', s: 12, m: '볕', el: 'wood' },
      { h: '敬', s: 13, m: '공경', el: 'wood' }
    ],
    '원': [
      { h: '原', s: 10, m: '근본', el: 'earth' },
      { h: '元', s: 4, m: '으뜸', el: 'wood' },
      { h: '媛', s: 12, m: '아름다울', el: 'earth' },
      { h: '圓', s: 13, m: '둥글', el: 'earth' }
    ],
    '재': [
      { h: '在', s: 6, m: '있을', el: 'earth' },
      { h: '宰', s: 10, m: '재상', el: 'metal' },
      { h: '才', s: 3, m: '재주', el: 'metal' },
      { h: '栽', s: 10, m: '심을', el: 'metal' }
    ],
    '석': [
      { h: '錫', s: 16, m: '주석', el: 'metal' },
      { h: '石', s: 5, m: '돌', el: 'earth' },
      { h: '碩', s: 14, m: '클', el: 'earth' }
    ],
    '훈': [
      { h: '勳', s: 16, m: '공', el: 'wood' },
      { h: '熏', s: 14, m: '불길', el: 'wood' },
      { h: '訓', s: 10, m: '가르칠', el: 'wood' }
    ],
    '동': [
      { h: '東', s: 8, m: '동녘', el: 'wood' },
      { h: '同', s: 6, m: '한가지', el: 'earth' },
      { h: '童', s: 12, m: '아이', el: 'earth' }
    ],
    '길': [{ h: '吉', s: 6, m: '길할', el: 'wood' }],
    '철': [{ h: '哲', s: 10, m: '밝을', el: 'fire' }, { h: '鐵', s: 21, m: '쇠', el: 'metal' }],
    '상': [
      { h: '相', s: 9, m: '서로', el: 'wood' },
      { h: '尙', s: 8, m: '오히려', el: 'earth' },
      { h: '祥', s: 11, m: '상서', el: 'metal' }
    ],
    '태': [
      { h: '泰', s: 10, m: '클', el: 'earth' },
      { h: '太', s: 4, m: '클', el: 'fire' },
      { h: '兌', s: 7, m: '기쁠', el: 'metal' }
    ],
    '승': [
      { h: '承', s: 8, m: '이을', el: 'metal' },
      { h: '昇', s: 8, m: '오를', el: 'earth' },
      { h: '勝', s: 12, m: '이길', el: 'earth' }
    ],
    '혁': [{ h: '赫', s: 14, m: '빛날', el: 'wood' }, { h: '奕', s: 9, m: '클', el: 'wood' }],
    '규': [
      { h: '奎', s: 9, m: '별', el: 'earth' },
      { h: '圭', s: 6, m: '홀', el: 'earth' },
      { h: '揆', s: 12, m: '헤아릴', el: 'wood' }
    ],
    '찬': [
      { h: '燦', s: 17, m: '빛날', el: 'fire' },
      { h: '贊', s: 19, m: '도울', el: 'metal' },
      { h: '瓚', s: 23, m: '옥잔', el: 'earth' }
    ],
    '솔': [{ h: '率', s: 11, m: '거느릴', el: 'metal' }],
    '온': [{ h: '溫', s: 13, m: '따뜻할', el: 'water' }, { h: '穩', s: 19, m: '편안할', el: 'earth' }],
    '예': [
      { h: '禮', s: 18, m: '예도', el: 'fire' },
      { h: '叡', s: 16, m: '밝을', el: 'metal' },
      { h: '藝', s: 19, m: '재주', el: 'wood' }
    ],
    '린': [{ h: '麟', s: 23, m: '기린', el: 'fire' }, { h: '璘', s: 16, m: '옥빛', el: 'fire' }],
    '율': [{ h: '律', s: 9, m: '법칙', el: 'fire' }, { h: '栗', s: 10, m: '밤', el: 'wood' }],
    '시': [
      { h: '時', s: 10, m: '때', el: 'earth' },
      { h: '詩', s: 13, m: '시', el: 'metal' },
      { h: '施', s: 9, m: '베풀', el: 'earth' }
    ],
    '유': [
      { h: '有', s: 6, m: '있을', el: 'earth' },
      { h: '柔', s: 9, m: '부드러울', el: 'wood' },
      { h: '裕', s: 12, m: '넉넉할', el: 'earth' },
      { h: '柚', s: 9, m: '유자', el: 'wood' }
    ],
    '이': [
      { h: '李', s: 7, m: '오얏', el: 'wood' },
      { h: '利', s: 7, m: '이로울', el: 'fire' },
      { h: '怡', s: 8, m: '기쁠', el: 'earth' }
    ],
    '새': [{ h: '賽', s: 17, m: '잔치', el: 'metal' }],
    '봄': [],
    '결': [{ h: '潔', s: 15, m: '깨끗할', el: 'water' }, { h: '杰', s: 8, m: '뛰어날', el: 'wood' }]
  };

  /* 성·이름에서 같은 음이 겹치면 후보를 합침 (뒤 정의가 앞을 덮어쓴 것 보정) */
  var SURNAME_EXTRA = {
    '김': [{ h: '金', s: 8, m: '쇠·김', el: 'metal' }],
    '이': [{ h: '李', s: 7, m: '오얏나무', el: 'wood' }, { h: '異', s: 12, m: '다를', el: 'wood' }],
    '박': [{ h: '朴', s: 6, m: '순박할', el: 'wood' }],
    '최': [{ h: '崔', s: 11, m: '높을', el: 'earth' }],
    '정': [
      { h: '鄭', s: 19, m: '나라 이름', el: 'fire' },
      { h: '丁', s: 2, m: '고무래', el: 'fire' }
    ],
    '강': [{ h: '姜', s: 9, m: '성씨', el: 'wood' }, { h: '康', s: 11, m: '편안할', el: 'wood' }],
    '조': [{ h: '趙', s: 14, m: '나라 이름', el: 'fire' }, { h: '曺', s: 11, m: '성씨', el: 'fire' }],
    '윤': [{ h: '尹', s: 4, m: '다스릴', el: 'earth' }],
    '장': [{ h: '張', s: 11, m: '베풀', el: 'fire' }, { h: '章', s: 11, m: '글월', el: 'fire' }],
    '임': [{ h: '林', s: 8, m: '수풀', el: 'wood' }, { h: '任', s: 6, m: '맡길', el: 'water' }],
    '한': [{ h: '韓', s: 17, m: '나라 이름', el: 'water' }, { h: '漢', s: 14, m: '한수', el: 'water' }],
    '오': [{ h: '吳', s: 7, m: '성씨', el: 'wood' }],
    '신': [{ h: '申', s: 5, m: '필', el: 'earth' }, { h: '辛', s: 7, m: '매울', el: 'metal' }],
    '서': [{ h: '徐', s: 10, m: '천천히', el: 'wood' }],
    '권': [{ h: '權', s: 22, m: '권세', el: 'wood' }],
    '황': [{ h: '黃', s: 12, m: '누를', el: 'earth' }],
    '안': [{ h: '安', s: 6, m: '편안할', el: 'earth' }],
    '송': [{ h: '宋', s: 7, m: '나라이름', el: 'metal' }],
    '전': [{ h: '全', s: 6, m: '온전할', el: 'metal' }, { h: '田', s: 5, m: '밭', el: 'earth' }],
    '홍': [{ h: '洪', s: 9, m: '넓을', el: 'water' }],
    '유': [{ h: '柳', s: 9, m: '버들', el: 'wood' }, { h: '劉', s: 15, m: '성씨', el: 'metal' }],
    '고': [{ h: '高', s: 10, m: '높을', el: 'wood' }],
    '문': [{ h: '文', s: 4, m: '글월', el: 'water' }],
    '양': [{ h: '梁', s: 11, m: '들보', el: 'fire' }, { h: '楊', s: 13, m: '버들', el: 'wood' }],
    '손': [{ h: '孫', s: 10, m: '손자', el: 'metal' }],
    '배': [{ h: '裵', s: 15, m: '성씨', el: 'water' }],
    '백': [{ h: '白', s: 5, m: '흰', el: 'metal' }],
    '허': [{ h: '許', s: 11, m: '허락할', el: 'wood' }],
    '남': [{ h: '南', s: 9, m: '남쪽', el: 'fire' }],
    '심': [{ h: '沈', s: 7, m: '잠길', el: 'water' }],
    '노': [{ h: '盧', s: 16, m: '성씨', el: 'fire' }],
    '하': [{ h: '河', s: 8, m: '물', el: 'water' }],
    '곽': [{ h: '郭', s: 11, m: '둘레', el: 'wood' }],
    '성': [{ h: '成', s: 6, m: '이룰', el: 'earth' }],
    '차': [{ h: '車', s: 7, m: '수레', el: 'earth' }],
    '주': [{ h: '朱', s: 6, m: '붉을', el: 'wood' }, { h: '周', s: 8, m: '두루', el: 'earth' }],
    '우': [{ h: '禹', s: 9, m: '임금', el: 'earth' }],
    '구': [{ h: '具', s: 8, m: '갖출', el: 'wood' }],
    '민': [{ h: '閔', s: 12, m: '민망할·성씨', el: 'water' }],
    '류': [{ h: '柳', s: 9, m: '버들', el: 'wood' }, { h: '劉', s: 15, m: '성씨', el: 'metal' }],
    '나': [{ h: '羅', s: 19, m: '그물', el: 'fire' }],
    '진': [{ h: '陳', s: 11, m: '베풀', el: 'fire' }],
    '엄': [{ h: '嚴', s: 20, m: '엄할', el: 'wood' }],
    '원': [{ h: '元', s: 4, m: '으뜸', el: 'wood' }, { h: '袁', s: 10, m: '옷', el: 'earth' }],
    '천': [{ h: '千', s: 3, m: '일천', el: 'metal' }],
    '방': [{ h: '方', s: 4, m: '모', el: 'water' }],
    '공': [{ h: '孔', s: 4, m: '구멍', el: 'wood' }],
    '현': [{ h: '玄', s: 5, m: '검을', el: 'water' }],
    '함': [{ h: '咸', s: 9, m: '다', el: 'water' }],
    '표': [{ h: '表', s: 8, m: '겉', el: 'wood' }],
    '변': [{ h: '卞', s: 4, m: '법', el: 'water' }]
  };

  function mergeHanja() {
    Object.keys(SURNAME_EXTRA).forEach(function (k) {
      var base = HANJA[k] || [];
      var extra = SURNAME_EXTRA[k];
      var seen = {};
      var merged = [];
      function pushAll(arr) {
        arr.forEach(function (c) {
          if (seen[c.h]) return;
          seen[c.h] = true;
          merged.push(c);
        });
      }
      pushAll(extra);
      pushAll(base);
      HANJA[k] = merged;
    });
  }
  mergeHanja();

  function isHangulSyllable(ch) {
    var c = ch.charCodeAt(0);
    return c >= 0xAC00 && c <= 0xD7A3;
  }

  function decompose(ch) {
    var c = ch.charCodeAt(0) - 0xAC00;
    return {
      cho: Math.floor(c / 588),
      jung: Math.floor((c % 588) / 28),
      jong: c % 28
    };
  }

  function syllableStroke(ch) {
    if (!isHangulSyllable(ch)) return 0;
    var d = decompose(ch);
    return CHO_STROKE[d.cho] + JUNG_STROKE[d.jung] + JONG_STROKE[d.jong];
  }

  function syllableSoundOheng(ch) {
    if (!isHangulSyllable(ch)) return null;
    return OHENG[CHO_SOUND[decompose(ch).cho]];
  }

  function strokeTone(n) {
    var d = n % 10;
    if (d === 1 || d === 3 || d === 5 || d === 6 || d === 7 || d === 8) {
      return { id: 'good', ko: '힘이 붙는 편', tip: '이름을 밖으로 드러내도 괜찮은 흐름입니다.' };
    }
    if (d === 2 || d === 4) {
      return { id: 'mixed', ko: '노력형', tip: '꾸준함이 이름을 빛나게 합니다.' };
    }
    return { id: 'care', ko: '다듬으면 좋은 편', tip: '서명·호칭을 단정히 쓰면 보완됩니다.' };
  }

  function cleanName(raw) {
    return String(raw || '').replace(/\s+/g, '').replace(/[^가-힣]/g, '');
  }

  function candidatesFor(syllable) {
    var list = HANJA[syllable] || [];
    return list.map(function (c) {
      return {
        hanja: c.h,
        stroke: c.s,
        meaning: c.m,
        oheng: OHENG[c.el] || strokeToOheng(c.s),
        label: c.h + ' (' + c.s + '획·' + c.m + ')'
      };
    });
  }

  /**
   * 한글 이름 → 글자별 한자 후보
   */
  function suggestHanja(fullName, opts) {
    opts = opts || {};
    var surname = cleanName(opts.surname || '');
    var given = cleanName(opts.given || '');
    var full = cleanName(fullName);
    if (surname && given) full = surname + given;
    if (!full || full.length < 2) {
      return { ok: false, error: '한글 이름 2글자 이상을 입력해 주세요.' };
    }
    if (!surname && full.length >= 2) {
      surname = full.charAt(0);
      given = full.slice(1);
    }
    var slots = [];
    for (var i = 0; i < full.length; i++) {
      var ch = full.charAt(i);
      var cands = candidatesFor(ch);
      slots.push({
        index: i,
        hangul: ch,
        role: i === 0 ? '성' : '이름',
        candidates: cands,
        hasHanja: cands.length > 0,
        hangulStroke: syllableStroke(ch)
      });
    }
    return {
      ok: true,
      full: full,
      surname: surname,
      given: given,
      slots: slots,
      allHaveHanja: slots.every(function (s) { return s.hasHanja; })
    };
  }

  function dominantFromList(ohengIds) {
    var count = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    ohengIds.forEach(function (id) {
      if (count[id] != null) count[id]++;
    });
    var best = 'earth';
    var max = -1;
    Object.keys(count).forEach(function (k) {
      if (count[k] > max) { max = count[k]; best = k; }
    });
    return OHENG[best];
  }

  /**
   * 선택한 한자로 풀이
   * selections: [{ hangul, hanja, stroke, meaning, ohengId }]
   */
  function readFromHanja(selections) {
    if (!selections || !selections.length) {
      return { ok: false, error: '한자를 선택해 주세요.' };
    }
    var missing = selections.filter(function (s) { return !s.hanja; });
    if (missing.length) {
      return {
        ok: false,
        error: '「' + missing.map(function (s) { return s.hangul; }).join('') + '」한자 후보가 없거나 선택이 비어 있습니다.'
      };
    }

    var total = 0;
    var parts = [];
    var elIds = [];
    selections.forEach(function (s) {
      total += s.stroke;
      var oh = OHENG[s.ohengId] || strokeToOheng(s.stroke);
      elIds.push(oh.id);
      parts.push(s.hangul + s.hanja + '(' + s.stroke + '획·' + oh.ko + '·' + s.meaning + ')');
    });

    var mainOheng = dominantFromList(elIds);
    var strokeOheng = strokeToOheng(total);
    var tone = strokeTone(total);
    var sur = selections[0];
    var givenSel = selections.slice(1);
    var givenStroke = givenSel.reduce(function (a, s) { return a + s.stroke; }, 0);
    var hyung = sur.stroke + (givenSel[0] ? givenSel[0].stroke : 0);

    var fullHangul = selections.map(function (s) { return s.hangul; }).join('');
    var fullHanja = selections.map(function (s) { return s.hanja; }).join('');

    return {
      ok: true,
      mode: 'hanja',
      full: fullHangul,
      fullHanja: fullHanja,
      display: fullHangul + ' (' + fullHanja + ')',
      totalStroke: total,
      surStroke: sur.stroke,
      givenStroke: givenStroke,
      hyungStroke: hyung,
      mainOheng: mainOheng,
      strokeOheng: strokeOheng,
      tone: tone,
      partsLine: parts.join(' · '),
      nature:
        mainOheng.icon + ' 한자 이름 기운은 「' + mainOheng.ko + '」 쪽에 가깝습니다. ' + mainOheng.tip,
      strokeLine:
        '한자 획수 합 ' + total + '획(옥편 기준 참고) · 수리 오행 「' + strokeOheng.ko + '」. ' +
        tone.tip +
        ' 성 ' + sur.stroke + '획 · 이름 ' + givenStroke + '획 · 형격(성+첫 이름글자) ' + hyung + '획.',
      summary:
        fullHangul + ' ' + fullHanja + ' — ' + mainOheng.ko + ' · 합 ' + total + '획(' + tone.ko + ')',
      disclaimer:
        '한자 획수는 옥편식 참고값입니다. 작명소·원획 표기와 1~2획 다를 수 있어요. 참고용입니다.'
    };
  }

  /* —— 기존 한글 간이 풀이 (한자 없을 때) —— */
  function analyzeSyllables(hangul) {
    var list = [];
    for (var i = 0; i < hangul.length; i++) {
      var ch = hangul.charAt(i);
      if (!isHangulSyllable(ch)) continue;
      var st = syllableStroke(ch);
      list.push({
        char: ch,
        stroke: st,
        strokeOheng: strokeToOheng(st),
        soundOheng: syllableSoundOheng(ch)
      });
    }
    return list;
  }

  function readNameHangul(fullName, opts) {
    opts = opts || {};
    var surname = cleanName(opts.surname || '');
    var given = cleanName(opts.given || '');
    var full = cleanName(fullName);
    if (surname && given) full = surname + given;
    if (!full || full.length < 2) {
      return { ok: false, error: '한글 이름 2글자 이상을 입력해 주세요. 예: 김민수' };
    }
    if (full.length > 6) {
      return { ok: false, error: '이름은 6글자 이하로 입력해 주세요.' };
    }
    if (!surname && !opts.given && full.length >= 2) {
      surname = full.charAt(0);
      given = full.slice(1);
    }
    var all = analyzeSyllables(full);
    var givenParts = analyzeSyllables(given);
    var totalStroke = all.reduce(function (a, s) { return a + s.stroke; }, 0);
    var mainOheng = (function () {
      var ids = (givenParts.length ? givenParts : all).map(function (s) {
        return (s.soundOheng && s.soundOheng.id) || 'earth';
      });
      return dominantFromList(ids);
    })();
    var strokeOheng = strokeToOheng(totalStroke);
    var tone = strokeTone(totalStroke);
    return {
      ok: true,
      mode: 'hangul',
      full: full,
      surname: surname,
      given: given,
      totalStroke: totalStroke,
      mainOheng: mainOheng,
      strokeOheng: strokeOheng,
      tone: tone,
      nature: mainOheng.icon + ' 이름 기운은 「' + mainOheng.ko + '」 쪽에 가깝습니다. ' + mainOheng.tip,
      strokeLine: '한글 자모 획수 합 ' + totalStroke + '획 · 「' + strokeOheng.ko + '」. ' + tone.tip +
        ' (한자와 다릅니다. 가능하면 한자 선택을 권합니다.)',
      partsLine: all.map(function (s) {
        return s.char + '(' + s.stroke + '획·' + (s.soundOheng ? s.soundOheng.ko : '?') + ')';
      }).join(' · '),
      summary: full + ' — ' + mainOheng.ko + ' · 합 ' + totalStroke + '획(' + tone.ko + ') · 한글 간이',
      disclaimer: '한글 자모 획수는 성명학 한자 획수와 다릅니다. 한자를 알면 한자 모드로 봐 주세요.'
    };
  }

  /** 하위 호환 */
  function readName(fullName, opts) {
    return readNameHangul(fullName, opts);
  }

  global.NameReading = {
    readName: readName,
    readNameHangul: readNameHangul,
    suggestHanja: suggestHanja,
    readFromHanja: readFromHanja,
    candidatesFor: candidatesFor,
    syllableStroke: syllableStroke,
    OHENG: OHENG,
    HANJA: HANJA
  };
})(typeof window !== 'undefined' ? window : this);

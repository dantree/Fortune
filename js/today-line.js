/**
 * 오늘 한 줄 운세 — 일주 기준 결정론 (같은 날 = 같은 문장)
 */
(function (global) {
  'use strict';

  var BY_STEM = {
    0: '크게 뻗어 나가는 날. 새 일을 꺼내 보기 좋아요.',
    1: '유연하게 맞춰 가는 날. 고집을 조금 풀면 길이 납니다.',
    2: '밝게 드러나는 날. 표현·제안이 잘 붙습니다.',
    3: '섬세한 온기가 필요한 날. 가까운 사람을 챙기세요.',
    4: '중심을 잡는 날. 큰 결정보다 기반을 다지세요.',
    5: '실속이 남는 날. 작은 정리가 큰 이득이 됩니다.',
    6: '원칙이 빛나는 날. 할 일과 안 할 일을 분명히.',
    7: '디테일이 승부처. 말·계약·마감을 정확히.',
    8: '흐름이 넓은 날. 정보는 모으고 결정은 천천히.',
    9: '직관이 예민한 날. 느낌과 휴식을 믿어 보세요.'
  };

  var BY_OHENG = {
    wood: '성장·시작의 공기. 미뤄 둔 첫걸음에 힘을 주세요.',
    fire: '열정·표현의 공기. 숨기지 말고 한 마디 더.',
    earth: '안정·실무의 공기. 기본을 지키면 중간 이상.',
    metal: '결단·마감의 공기. 끝을 내는 쪽이 운이 돕습니다.',
    water: '지혜·흐름의 공기. 서두르지 말고 물처럼.'
  };

  var TIP = {
    wood: '초록·동쪽·가벼운 산책',
    fire: '밝은 자리·따뜻한 말 한마디',
    earth: '정리·약속 지키기·든든한 한 끼',
    metal: '화이트·마감·짧은 체크리스트',
    water: '수분·조용한 시간·메모'
  };

  function lineForDay(day) {
    if (!day) return { line: '오늘도 차분히 가꾸는 하루.', tip: '' };
    var stemLine = BY_STEM[day.stemIndex];
    var oh = day.oheng && day.oheng.type;
    return {
      line: stemLine || BY_OHENG[oh] || '오늘도 차분히 가꾸는 하루.',
      tip: TIP[oh] || '',
      pillar: day.pillar,
      oheng: day.oheng
    };
  }

  global.TodayLine = { lineForDay: lineForDay };
})(typeof window !== 'undefined' ? window : this);

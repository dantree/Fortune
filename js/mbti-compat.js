/**
 * MBTI 16×16 궁합 매트릭스 — 고정값 (랜덤 없음)
 */
(function (global) {
  'use strict';

  var TYPES = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  var BASE = {
    INTJ: { ENFP: 92, ENTP: 88, INFP: 85, INFJ: 82, ENTJ: 78, INTP: 75, ESTP: 70, ENFJ: 68 },
    INTP: { ENFJ: 90, ENTJ: 86, ENFP: 84, INFJ: 80, ENTP: 76, INFP: 74, ESTJ: 68, ESFJ: 65 },
    ENTJ: { INTP: 90, INFP: 88, ENFP: 82, INFJ: 78, INTJ: 72, ENTP: 70, ISFP: 68, ISTP: 65 },
    ENTP: { INFJ: 91, INTJ: 88, ENFJ: 85, INFP: 80, INTP: 74, ENTJ: 72, ISFJ: 66, ISTJ: 62 },
    INFJ: { ENTP: 91, ENFP: 89, INTJ: 82, INTP: 80, INFP: 76, ENTJ: 74, ESTP: 68, ESFP: 65 },
    INFP: { ENFJ: 90, ENTJ: 88, ENFP: 84, INFJ: 76, INTJ: 85, ENTP: 80, ESFJ: 70, ESTJ: 64 },
    ENFJ: { INFP: 90, INTP: 90, ISFP: 86, ENFP: 82, INFJ: 78, ENTP: 78, ISTP: 68, INTJ: 68 },
    ENFP: { INTJ: 92, INFJ: 89, ENTP: 84, INFP: 82, ENFJ: 80, INTP: 84, ISTJ: 66, ISFJ: 64 },
    ISTJ: { ESFP: 82, ESTP: 78, ISFP: 75, ESFJ: 72, ESTJ: 70, ISTP: 68, ENFP: 66, ENTP: 62 },
    ISFJ: { ESTP: 84, ESFP: 80, ISTP: 76, ISFJ: 72, ESFJ: 70, ESTJ: 68, ENTP: 66, ENFP: 64 },
    ESTJ: { ISFP: 85, ISTP: 80, ESFP: 78, INTP: 68, INFP: 68, ISFJ: 70, ISTJ: 72, ENFJ: 64 },
    ESFJ: { ISFP: 86, ISTP: 82, ESFP: 74, INFP: 70, ENFJ: 70, ISFJ: 72, ESTJ: 70, INTP: 65 },
    ISTP: { ESFJ: 84, ESTJ: 80, ENFJ: 68, ISFP: 72, ESTP: 70, ISTJ: 76, INFJ: 68, ENFP: 65 },
    ISFP: { ESTJ: 85, ESFJ: 86, ENFJ: 70, ESFP: 72, ISTP: 72, ISFJ: 74, ENTJ: 68, ENTP: 64 },
    ESTP: { ISFJ: 84, ISTJ: 78, ESFP: 74, ISTP: 70, ESFJ: 78, ESTJ: 72, INFJ: 65, INTJ: 70 },
    ESFP: { ISTJ: 82, ISFJ: 80, ESTP: 74, ESFP: 72, ISTP: 72, ESTJ: 78, INTJ: 65, INFJ: 65 }
  };

  /** 결정론적 보완 점수 — 4축 일치도 기반 (랜덤 없음) */
  function deterministicScore(a, b) {
    if (a === b) return 75;
    var score = 58;
    for (var i = 0; i < 4; i++) {
      score += a[i] === b[i] ? 9 : 5;
    }
    return Math.min(94, score);
  }

  function lookupBase(a, b) {
    var ab = BASE[a] && BASE[a][b];
    var ba = BASE[b] && BASE[b][a];
    if (ab != null && ba != null) return Math.round((ab + ba) / 2);
    if (ab != null) return ab;
    if (ba != null) return ba;
    return null;
  }

  function buildMatrix() {
    var matrix = {};
    TYPES.forEach(function (a) {
      matrix[a] = {};
      TYPES.forEach(function (b) {
        if (a === b) {
          matrix[a][b] = 75;
          return;
        }
        var v = lookupBase(a, b);
        matrix[a][b] = v != null ? v : deterministicScore(a, b);
      });
    });
    return matrix;
  }

  var MATRIX = buildMatrix();

  function getScore(a, b) {
    return MATRIX[a][b];
  }

  global.MbtiCompat = {
    TYPES: TYPES,
    MATRIX: MATRIX,
    getScore: getScore
  };
})(typeof window !== 'undefined' ? window : this);

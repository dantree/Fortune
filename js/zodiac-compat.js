/**
 * 12띠 궁합표 — 고정 데이터 (삼합·육합·충·형 기반)
 */
(function (global) {
  'use strict';

  var ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  /** 삼합: 申子辰, 亥卯未, 寅午戌, 巳酉丑 */
  var SAMHAP = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]];
  /** 육합 */
  var YUKHAP = { 0: 1, 1: 0, 2: 11, 3: 10, 4: 9, 5: 8, 6: 7, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2 };
  /** 충 */
  var CHUNG = { 0: 6, 6: 0, 1: 7, 7: 1, 2: 8, 8: 2, 3: 9, 9: 3, 4: 10, 10: 4, 5: 11, 11: 5 };

  function inSamhap(a, b) {
    return SAMHAP.some(function (g) { return g.indexOf(a) >= 0 && g.indexOf(b) >= 0 && a !== b; });
  }

  function getRelation(a, b) {
    if (a === b) return { type: '동일', label: '같은 띠', score: 72 };
    if (YUKHAP[a] === b) return { type: '육합', label: '육합(六合)', score: 90 };
    if (inSamhap(a, b)) return { type: '삼합', label: '삼합(三合)', score: 85 };
    if (CHUNG[a] === b) return { type: '충', label: '충(沖)', score: 48 };
    return { type: '보통', label: '일반', score: 65 };
  }

  function buildMatrix() {
    var matrix = [];
    for (var i = 0; i < 12; i++) {
      matrix[i] = [];
      for (var j = 0; j < 12; j++) {
        matrix[i][j] = getRelation(i, j);
      }
    }
    return matrix;
  }

  var MATRIX = buildMatrix();

  function getCompat(branchIndexA, branchIndexB) {
    return MATRIX[branchIndexA][branchIndexB];
  }

  function getCompatByAnimal(animalA, animalB) {
    var a = ANIMALS.indexOf(animalA);
    var b = ANIMALS.indexOf(animalB);
    if (a < 0 || b < 0) return null;
    return getCompat(a, b);
  }

  global.ZodiacCompat = {
    ANIMALS: ANIMALS,
    BRANCHES: BRANCHES,
    MATRIX: MATRIX,
    getCompat: getCompat,
    getCompatByAnimal: getCompatByAnimal
  };
})(typeof window !== 'undefined' ? window : this);

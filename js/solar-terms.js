/**
 * 절기(節氣) — 태양 황경 기반 정밀 계산 (Meeus 근사)
 * 한국 표준시(KST, UTC+9) 기준으로 절입 시각을 다룹니다.
 */
(function (global) {
  'use strict';

  var KST_OFFSET_H = 9;

  /** 월을 가르는 12절 (중기 제외) — 황경(°) · 월지 */
  var JIE_TERMS = [
    { id: 'lichun',   ko: '입춘', hanja: '立春', lon: 315, branchIndex: 2 },  // 寅
    { id: 'jingzhe',  ko: '경칩', hanja: '驚蟄', lon: 345, branchIndex: 3 },  // 卯
    { id: 'qingming', ko: '청명', hanja: '清明', lon: 15,  branchIndex: 4 },  // 辰
    { id: 'lixia',    ko: '입하', hanja: '立夏', lon: 45,  branchIndex: 5 },  // 巳
    { id: 'mangzhong',ko: '망종', hanja: '芒種', lon: 75,  branchIndex: 6 },  // 午
    { id: 'xiaoshu',  ko: '소서', hanja: '小暑', lon: 105, branchIndex: 7 },  // 未
    { id: 'liqiu',    ko: '입추', hanja: '立秋', lon: 135, branchIndex: 8 },  // 申
    { id: 'bailu',    ko: '백로', hanja: '白露', lon: 165, branchIndex: 9 },  // 酉
    { id: 'hanlu',    ko: '한로', hanja: '寒露', lon: 195, branchIndex: 10 }, // 戌
    { id: 'lidong',   ko: '입동', hanja: '立冬', lon: 225, branchIndex: 11 }, // 亥
    { id: 'daxue',    ko: '대설', hanja: '大雪', lon: 255, branchIndex: 0 },  // 子
    { id: 'xiaohan',  ko: '소한', hanja: '小寒', lon: 285, branchIndex: 1 }   // 丑
  ];

  function norm360(x) {
    x = x % 360;
    if (x < 0) x += 360;
    return x;
  }

  function deg2rad(d) { return d * Math.PI / 180; }

  /** 그레고리력 → 율리우스일 (UTC 소수 포함) */
  function julianDateUTC(y, m, d, hourUTC) {
    var h = hourUTC == null ? 12 : hourUTC;
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100);
    var B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + h / 24;
  }

  function jdToPartsUTC(jd) {
    var z = Math.floor(jd + 0.5);
    var f = jd + 0.5 - z;
    var A = z;
    if (z >= 2299161) {
      var alpha = Math.floor((z - 1867216.25) / 36524.25);
      A = z + 1 + alpha - Math.floor(alpha / 4);
    }
    var B = A + 1524;
    var C = Math.floor((B - 122.1) / 365.25);
    var D = Math.floor(365.25 * C);
    var E = Math.floor((B - D) / 30.6001);
    var day = B - D - Math.floor(30.6001 * E) + f;
    var month = E < 14 ? E - 1 : E - 13;
    var year = month > 2 ? C - 4716 : C - 4715;
    var dayInt = Math.floor(day);
    var frac = day - dayInt;
    var hour = frac * 24;
    var h = Math.floor(hour);
    var min = Math.floor((hour - h) * 60);
    var sec = Math.round((((hour - h) * 60) - min) * 60);
    if (sec >= 60) { sec = 0; min++; }
    if (min >= 60) { min = 0; h++; }
    return { y: year, m: month, d: dayInt, h: h, min: min, sec: sec, jd: jd };
  }

  function formatKST(partsUTC) {
    var jdK = partsUTC.jd + KST_OFFSET_H / 24;
    var p = jdToPartsUTC(jdK);
    function pad(n) { return String(n).padStart(2, '0'); }
    return {
      y: p.y, m: p.m, d: p.d, h: p.h, min: p.min, sec: p.sec,
      dateStr: p.y + '-' + pad(p.m) + '-' + pad(p.d),
      timeStr: pad(p.h) + ':' + pad(p.min),
      dateTimeStr: p.y + '-' + pad(p.m) + '-' + pad(p.d) + ' ' + pad(p.h) + ':' + pad(p.min),
      jd: jdK
    };
  }

  /**
   * 태양 시황경(근사) — Jean Meeus Astronomical Algorithms ch.25
   * 수 분 이내 오차로 절입 판별에 충분
   */
  function sunLongitude(jd) {
    var T = (jd - 2451545.0) / 36525;
    var L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    var M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    var Mr = deg2rad(M);
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
      + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
      + 0.000289 * Math.sin(3 * Mr);
    var trueLon = L0 + C;
    var omega = 125.04 - 1934.136 * T;
    var lambda = trueLon - 0.00569 - 0.00478 * Math.sin(deg2rad(omega));
    return norm360(lambda);
  }

  function lonDiff(a, target) {
    return ((a - target + 540) % 360) - 180;
  }

  /** 특정 황경에 도달하는 UTC JD (이진 탐색) */
  function findLongitudeCrossing(approxJd, targetLon) {
    var lo = approxJd - 2;
    var hi = approxJd + 2;
    for (var i = 0; i < 40; i++) {
      var mid = (lo + hi) / 2;
      var d = lonDiff(sunLongitude(mid), targetLon);
      if (d < 0) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function approxJdForTerm(year, lon) {
    /* 1월 1일 황경 ≈ 280°, 하루 ≈ 0.9856° */
    var dayOfYear = ((lon - 280 + 360) % 360) / 0.9856473;
    return julianDateUTC(year, 1, 1, 0) + dayOfYear;
  }

  function findTermJd(year, lon) {
    var approx = approxJdForTerm(year, lon);
    var jd = findLongitudeCrossing(approx, lon);
    var p = jdToPartsUTC(jd);
    /* 근사가 인접 연도로 빗나가면 한 번 더 */
    if (p.y !== year) {
      jd = findLongitudeCrossing(approxJdForTerm(year, lon) + (year - p.y) * 365.25, lon);
      p = jdToPartsUTC(jd);
      if (Math.abs(p.y - year) > 0) {
        jd = findLongitudeCrossing(approxJdForTerm(year, lon), lon);
      }
    }
    return jd;
  }

  function termAtJd(termDef, jdUTC) {
    var utcParts = jdToPartsUTC(jdUTC);
    var kst = formatKST(utcParts);
    return {
      id: termDef.id,
      ko: termDef.ko,
      hanja: termDef.hanja,
      lon: termDef.lon,
      branchIndex: termDef.branchIndex,
      jdUTC: jdUTC,
      kst: kst
    };
  }

  /** 해당 연도의 12절 절입 (KST) */
  function getYearJieTerms(year) {
    return JIE_TERMS.map(function (t) {
      return termAtJd(t, findTermJd(year, t.lon));
    });
  }

  function birthJdKST(dateStr, timeStr) {
    var p = dateStr.split('-').map(Number);
    var h = 12;
    var min = 0;
    if (timeStr) {
      var tp = timeStr.split(':').map(Number);
      h = tp[0] || 0;
      min = tp[1] || 0;
    }
    /* KST → UTC */
    var hourUTC = h + min / 60 - KST_OFFSET_H;
    return julianDateUTC(p[0], p[1], p[2], hourUTC);
  }

  /**
   * 출생 시각이 속한 절·이전/다음 절입
   */
  function getTermContext(dateStr, timeStr) {
    var jd = birthJdKST(dateStr, timeStr);
    var y = Number(dateStr.slice(0, 4));
    var terms = getYearJieTerms(y - 1).concat(getYearJieTerms(y)).concat(getYearJieTerms(y + 1));
    terms.sort(function (a, b) { return a.jdUTC - b.jdUTC; });

    var prev = null;
    var next = null;
    var current = null;
    for (var i = 0; i < terms.length; i++) {
      if (terms[i].jdUTC <= jd) {
        prev = terms[i];
        current = terms[i];
      } else {
        next = terms[i];
        break;
      }
    }
    return {
      jd: jd,
      current: current,
      prev: prev,
      next: next,
      daysSincePrev: prev ? (jd - prev.jdUTC) : null,
      daysUntilNext: next ? (next.jdUTC - jd) : null
    };
  }

  function getLichun(year) {
    var t = JIE_TERMS[0];
    return termAtJd(t, findTermJd(year, t.lon));
  }

  global.SolarTerms = {
    JIE_TERMS: JIE_TERMS,
    sunLongitude: sunLongitude,
    julianDateUTC: julianDateUTC,
    getYearJieTerms: getYearJieTerms,
    getTermContext: getTermContext,
    getLichun: getLichun,
    birthJdKST: birthJdKST,
    KST_OFFSET_H: KST_OFFSET_H
  };
})(typeof window !== 'undefined' ? window : this);

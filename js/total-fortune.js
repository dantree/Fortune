/**
 * 오늘의 총운 — 사주 운세 + 띠 + 별자리 종합 (결정론)
 */
(function (global) {
  'use strict';

  function avg(nums) {
    if (!nums.length) return 0;
    var s = 0;
    for (var i = 0; i < nums.length; i++) s += nums[i];
    return Math.round(s / nums.length);
  }

  function gradeOf(score) {
    if (score >= 85) return { label: '크게 열린 날', emoji: '✨' };
    if (score >= 72) return { label: '흐름 좋은 날', emoji: '🌤️' };
    if (score >= 58) return { label: '가꾸는 날', emoji: '🌿' };
    if (score >= 45) return { label: '조심하며 가는 날', emoji: '🕯️' };
    return { label: '쉬어 가는 날', emoji: '🌙' };
  }

  /**
   * @param {{
   *   solarDate: string,
   *   todayDate?: string,
   *   name?: string,
   *   gender?: 'F'|'M'|''
   * }} opts
   */
  function getTotalToday(opts) {
    var SE = global.SajuEngine;
    var ZC = global.ZodiacCompat;
    var SS = global.StarSign;
    var OS = global.OhengStory;
    if (!SE || !opts || !opts.solarDate) return null;

    var today = opts.todayDate || SE.todayDateStr();
    var name = (opts.name || '').trim();
    var call = name ? name + '님' : '당신';

    var fortune = SE.getDailyFortune(opts.solarDate, today);
    var year = SE.getYearPillar(opts.solarDate);
    var day = SE.getDayPillar(opts.solarDate);
    var bi = SE.BRANCHES.indexOf(year.branch);
    var ddi = ZC && typeof ZC.getDailyAnimalFortune === 'function'
      ? ZC.getDailyAnimalFortune(bi, today)
      : null;
    var star = SS && typeof SS.getDailyStarFortune === 'function'
      ? SS.getDailyStarFortune(opts.solarDate, today)
      : null;
    var oheng = OS && typeof OS.getOhengStory === 'function'
      ? OS.getOhengStory(day.oheng.type, day.stem)
      : null;

    var parts = [fortune.score];
    if (ddi) parts.push(ddi.score);
    if (star) parts.push(star.score);
    var total = avg(parts);
    var g = gradeOf(total);

    var headline =
      call + '의 오늘 총운은 ' + total + '점 · ' + g.emoji + ' ' + g.label + '입니다.';

    var synthesis =
      '오늘은 사주 일간(' + day.stem + ')과 오늘 일주(' + fortune.todayDay.pillar + ')의 흐름, ' +
      year.animal + '띠의 기운' +
      (star ? ', ' + star.sign.ko + '의 별빛' : '') +
      '을 겹쳐 읽었습니다. ' +
      (total >= 72
        ? '전체적으로 문이 열린 편이라, 미뤄 둔 시도와 인사가 잘 통합니다. 다만 욕심을 한꺼번에 펼치기보다 “오늘의 한 가지”만 제대로 밀면 결과가 또렷합니다.'
        : total >= 58
          ? '극단의 대길·대흉보다, 태도에 따라 결과가 갈리는 날입니다. 루틴을 지키며 사람과 일 모두 “작게 잘” 하는 쪽이 이득입니다.'
          : '자극과 소모가 커질 수 있는 공기입니다. 말·소비·일정에 브레이크를 걸고, 회복을 우선하면 저녁이 달라집니다.');

    var focus =
      total >= 72
        ? '오늘의 한 가지: 미뤄 둔 연락·제안·신청 중 하나만 실행하기'
        : total >= 58
          ? '오늘의 한 가지: 나를 위한 30분 + 가까운 사람에게 감사 한마디'
          : '오늘의 한 가지: 중요한 결정은 보류, 수면·식사·물부터 챙기기';

    return {
      date: today,
      birthDate: opts.solarDate,
      name: name || null,
      gender: opts.gender || null,
      score: total,
      grade: g.label,
      emoji: g.emoji,
      headline: headline,
      synthesis: synthesis,
      focus: focus,
      pillars: {
        year: year,
        day: day
      },
      layers: {
        saju: {
          title: '사주 흐름',
          score: fortune.score,
          grade: fortune.grade,
          text: fortune.summary,
          tip: fortune.tip,
          mood: fortune.mood
        },
        animal: ddi && {
          title: '띠 운세',
          score: ddi.score,
          grade: ddi.grade,
          text: ddi.summary,
          label: ddi.label,
          animal: ddi.animal
        },
        star: star && {
          title: '별자리 운세',
          score: star.score,
          text: star.summary,
          sign: star.sign.ko,
          symbol: star.sign.symbol
        },
        oheng: oheng && {
          title: '내 오행 기질',
          nick: oheng.nick,
          text: oheng.sections[0].text + ' ' + oheng.sections[6].text
        }
      }
    };
  }

  /**
   * 풀사주 요약 (년·월·일·시 + 대운 + 생활 가이드)
   */
  function getFullSajuReading(opts) {
    var SE = global.SajuEngine;
    var OS = global.OhengStory;
    var ZC = global.ZodiacCompat;
    var SS = global.StarSign;
    var SG = global.SajuGuide;
    if (!SE || !opts || !opts.solarDate) return null;

    var name = (opts.name || '').trim();
    var gender = opts.gender || '';
    var saju = SE.getFullSaju(opts.solarDate, opts.time || null, gender || null);
    var oheng = OS ? OS.getOhengStory(saju.day.oheng.type, saju.day.stem) : null;
    var animal = ZC && typeof ZC.getAnimalProfileReading === 'function'
      ? ZC.getAnimalProfileReading(saju.year.animal)
      : null;
    var star = SS && typeof SS.getProfile === 'function'
      ? SS.getProfile(opts.solarDate)
      : null;

    var daeun = saju.daeun || null;
    var guide = SG && typeof SG.getLifeGuide === 'function'
      ? SG.getLifeGuide({
        solarDate: opts.solarDate,
        todayDate: opts.todayDate || SE.todayDateStr(),
        name: name,
        saju: saju,
        daeun: daeun
      })
      : null;

    var call = name ? name + '님' : '당신';
    var opening = (guide && guide.story && guide.story.prologue)
      ? guide.story.prologue
      : (guide && guide.faq && guide.faq.blurb)
        ? guide.faq.blurb
        : (call + '의 사주 이야기를 시작합니다.');

    return {
      name: name || null,
      gender: gender || null,
      solarDate: opts.solarDate,
      time: opts.time || null,
      saju: saju,
      daeun: daeun,
      guide: guide,
      oheng: oheng,
      animal: animal,
      star: star,
      opening: opening,
      disclaimer: '다른 만세력 앱과 해가 조금 다를 수 있어요. 절기(절입) 시각을 어떻게 잡느냐에 따라 달라집니다.'
    };
  }

  global.TotalFortune = {
    getTotalToday: getTotalToday,
    getFullSajuReading: getFullSajuReading,
    gradeOf: gradeOf
  };
})(typeof window !== 'undefined' ? window : this);

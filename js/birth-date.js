/**
 * 출생 날짜 양력/음력 처리
 * - 변환: korean-lunar-calendar (KARI 한국천문연구원 기준)
 * - 사주 계산은 항상 양력(solar)으로 수행
 */
(function (global) {
  'use strict';

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function formatYMD(y, m, d) {
    return y + '-' + pad(m) + '-' + pad(d);
  }

  function parseYMD(dateStr) {
    if (!dateStr) return null;
    var p = dateStr.split('-').map(Number);
    if (p.length !== 3 || p.some(function (n) { return !n && n !== 0; })) return null;
    return { y: p[0], m: p[1], d: p[2] };
  }

  function getCalendar() {
    if (typeof global.KoreanLunarCalendar === 'function') {
      return new global.KoreanLunarCalendar();
    }
    return null;
  }

  /**
   * @param {string} dateStr YYYY-MM-DD (음력 날짜 숫자)
   * @param {boolean} leap 윤달 여부
   * @returns {{ok:boolean, solar?:string, error?:string}}
   */
  function lunarToSolar(dateStr, leap) {
    var p = parseYMD(dateStr);
    if (!p) return { ok: false, error: '날짜를 입력해 주세요' };
    var cal = getCalendar();
    if (!cal) return { ok: false, error: '음력 변환 모듈을 불러오지 못했습니다' };
    if (!cal.setLunarDate(p.y, p.m, p.d, !!leap)) {
      return { ok: false, error: '유효하지 않은 음력 날짜입니다 (윤달·일수 확인)' };
    }
    var s = cal.getSolarCalendar();
    return { ok: true, solar: formatYMD(s.year, s.month, s.day), lunar: dateStr, leap: !!leap };
  }

  function solarToLunar(dateStr) {
    var p = parseYMD(dateStr);
    if (!p) return { ok: false, error: '날짜를 입력해 주세요' };
    var cal = getCalendar();
    if (!cal) return { ok: false, error: '음력 변환 모듈을 불러오지 못했습니다' };
    if (!cal.setSolarDate(p.y, p.m, p.d)) {
      return { ok: false, error: '변환 가능한 양력 범위를 벗어났습니다' };
    }
    var l = cal.getLunarCalendar();
    return {
      ok: true,
      solar: dateStr,
      lunar: formatYMD(l.year, l.month, l.day),
      leap: !!l.intercalation
    };
  }

  /**
   * 입력 → 사주 계산용 양력
   * @param {{date:string, calendar?:'solar'|'lunar', leap?:boolean}} input
   */
  function resolveToSolar(input) {
    if (!input || !input.date) return { ok: false, error: '날짜를 입력해 주세요' };
    var cal = input.calendar || 'solar';
    if (cal === 'lunar') return lunarToSolar(input.date, !!input.leap);
    return { ok: true, solar: input.date, lunar: null, leap: false, calendar: 'solar' };
  }

  function labelOf(input, resolved) {
    if (!input || !input.date) return '';
    if ((input.calendar || 'solar') === 'lunar') {
      return '음력 ' + input.date.replace(/-/g, '.') + (input.leap ? ' (윤달)' : '') +
        (resolved && resolved.solar ? ' → 양력 ' + resolved.solar.replace(/-/g, '.') : '');
    }
    return '양력 ' + input.date.replace(/-/g, '.');
  }

  /** 공통 토글 UI 스타일 (한 번만 주입) */
  function injectStyles() {
    if (global.document.getElementById('birth-date-styles')) return;
    var css = [
      '.bd-cal{display:flex;gap:8px;margin-bottom:10px;}',
      '.bd-cal label{flex:1;display:flex !important;align-items:center;justify-content:center;gap:6px;',
      'padding:10px;border-radius:10px;border:1.5px solid #e5e7eb;background:#fafafa;',
      'font-size:14px;font-weight:700;cursor:pointer;color:#6b7280;margin:0;line-height:1.2;',
      'white-space:nowrap;box-sizing:border-box;}',
      '.bd-cal input[type=radio]{width:auto !important;height:auto !important;padding:0 !important;',
      'margin:0;flex-shrink:0;accent-color:#6b4eff;border:none;background:transparent;}',
      '.bd-cal label.active{border-color:#6b4eff;background:#ede9fe;color:#4c1d95;}',
      '.bd-leap{display:none !important;align-items:center;gap:8px;font-size:13px;color:#6b7280;margin:0 0 10px;}',
      '.bd-leap.show{display:flex !important;}',
      '.bd-leap input[type=checkbox]{width:auto !important;height:auto !important;padding:0 !important;',
      'margin:0;flex-shrink:0;accent-color:#6b4eff;}',
      '.bd-hint{display:none;font-size:12px;color:#5b21b6;background:#ede9fe;padding:8px 10px;',
      'border-radius:8px;margin:0 0 10px;line-height:1.5;}',
      '.bd-hint.show{display:block;}',
      '.bd-hint.err{color:#991b1b;background:#fee2e2;}'
    ].join('');
    var style = global.document.createElement('style');
    style.id = 'birth-date-styles';
    style.textContent = css;
    global.document.head.appendChild(style);
  }

  /**
   * 날짜 필드에 양력/음력 UI 연결
   * @param {{
   *   name: string,
   *   dateInput: HTMLInputElement,
   *   mountEl: HTMLElement,
   *   onChange?: Function
   * }} opts
   */
  function enhance(opts) {
    injectStyles();
    var name = opts.name || 'cal';
    var dateInput = opts.dateInput;
    var mount = opts.mountEl;
    if (!dateInput || !mount) return null;

    mount.innerHTML =
      '<div class="bd-cal" role="group" aria-label="달력 종류">' +
      '<label class="active"><input type="radio" name="' + name + '" value="solar" checked> 양력</label>' +
      '<label><input type="radio" name="' + name + '" value="lunar"> 음력</label>' +
      '</div>' +
      '<label class="bd-leap"><input type="checkbox" data-leap> 윤달</label>' +
      '<div class="bd-hint" data-hint></div>';

    var radios = mount.querySelectorAll('input[type=radio]');
    var leapWrap = mount.querySelector('.bd-leap');
    var leapInput = mount.querySelector('[data-leap]');
    var hint = mount.querySelector('[data-hint]');
    var labels = mount.querySelectorAll('.bd-cal label');

    function calendar() {
      var checked = mount.querySelector('input[type=radio]:checked');
      return checked ? checked.value : 'solar';
    }

    function syncLabels() {
      labels.forEach(function (lab) {
        var inp = lab.querySelector('input');
        lab.classList.toggle('active', inp && inp.checked);
      });
      var isLunar = calendar() === 'lunar';
      leapWrap.classList.toggle('show', isLunar);
      if (!isLunar) leapInput.checked = false;
    }

    function updateHint() {
      var cal = calendar();
      var date = dateInput.value;
      hint.classList.remove('show', 'err');
      hint.textContent = '';
      if (!date) return null;
      if (cal === 'solar') {
        var lu = solarToLunar(date);
        if (lu.ok) {
          hint.textContent = '참고 음력 ' + lu.lunar.replace(/-/g, '.') + (lu.leap ? ' (윤달)' : '');
          hint.classList.add('show');
        }
        return { ok: true, solar: date, calendar: 'solar', leap: false };
      }
      var r = lunarToSolar(date, leapInput.checked);
      if (!r.ok) {
        hint.textContent = r.error;
        hint.classList.add('show', 'err');
        return r;
      }
      hint.textContent = '양력 환산 ' + r.solar.replace(/-/g, '.');
      hint.classList.add('show');
      return { ok: true, solar: r.solar, calendar: 'lunar', leap: !!leapInput.checked, lunar: date };
    }

    function getValue() {
      var base = updateHint();
      if (!base || !base.ok) {
        return {
          ok: false,
          error: (base && base.error) || '날짜를 확인해 주세요',
          date: dateInput.value,
          calendar: calendar(),
          leap: leapInput.checked
        };
      }
      return {
        ok: true,
        date: dateInput.value,
        calendar: calendar(),
        leap: leapInput.checked,
        solar: base.solar,
        lunar: base.lunar || null
      };
    }

    radios.forEach(function (r) {
      r.addEventListener('change', function () {
        syncLabels();
        updateHint();
        if (opts.onChange) opts.onChange(getValue());
      });
    });
    leapInput.addEventListener('change', function () {
      updateHint();
      if (opts.onChange) opts.onChange(getValue());
    });
    dateInput.addEventListener('change', function () {
      updateHint();
      if (opts.onChange) opts.onChange(getValue());
    });

    syncLabels();
    updateHint();

    return { getValue: getValue, updateHint: updateHint, calendar: calendar };
  }

  function saveBirth(v) {
    if (!v || !v.date) return;
    try {
      global.localStorage.setItem('fortune_birth', JSON.stringify({
        date: v.date,
        calendar: v.calendar || 'solar',
        leap: !!v.leap,
        solar: v.solar || v.date
      }));
    } catch (e) {}
  }

  function loadBirth() {
    try {
      var raw = global.localStorage.getItem('fortune_birth');
      if (!raw) return null;
      if (raw.charAt(0) === '{') return JSON.parse(raw);
      return { date: raw, calendar: 'solar', leap: false, solar: raw };
    } catch (e) {
      return null;
    }
  }

  function applySaved(fieldApi, dateInput, saved) {
    if (!saved || !dateInput) return;
    dateInput.value = saved.date || '';
    if (!fieldApi || !fieldApi.getValue) return;
    var mount = dateInput.parentElement && dateInput.parentElement.querySelector
      ? null : null;
    /* radios live in mountEl passed to enhance — find via name from getValue after click */
    var root = dateInput.closest ? dateInput.closest('.card') || dateInput.parentElement : dateInput.parentElement;
    if (!root) return;
    var cal = saved.calendar || 'solar';
    var radio = root.querySelector('input[type=radio][value="' + cal + '"]');
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    var leap = root.querySelector('[data-leap]');
    if (leap) {
      leap.checked = !!saved.leap;
      leap.dispatchEvent(new Event('change', { bubbles: true }));
    }
    fieldApi.updateHint();
  }

  global.BirthDate = {
    lunarToSolar: lunarToSolar,
    solarToLunar: solarToLunar,
    resolveToSolar: resolveToSolar,
    labelOf: labelOf,
    enhance: enhance,
    formatYMD: formatYMD,
    saveBirth: saveBirth,
    loadBirth: loadBirth,
    applySaved: applySaved
  };
})(typeof window !== 'undefined' ? window : this);

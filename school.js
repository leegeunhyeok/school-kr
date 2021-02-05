/**
 * @name school-kr
 * @description 전국 교육청 급식, 학사일정 파싱 라이브러리
 * @author Leegeunhyeok
 * @license MIT
 * @version 3.1.1
 *
 * Github : https://github.com/leegeunhyeok/school-kr
 * NPM : https://www.npmjs.com/package/school-kr
 */

// 아래 코드는 트랜스파일 할 경우 정상 동작하지 않음 (Babel 7, @babel/preset-env)
// import { RequestManager } from './src/core';

import core from './src/core';
import util from './src/util';
import Data from './src/data';
const { type, region, data } = Data;

class School {
  /**
   * @constructor
   */
  constructor() {
    this._requestManager = new core.RequestManager(); // HTTP 요청 관리 객체
    this._data = data; // 데이터 정의 객체
    this._searchUrl = data.searchUrl; // 검색 URL End-point
    this._mealUrl = data.mealUrl; // 급식 URL End-point
    this._calendarMonthUrl = data.calendarMonthUrl; // 학사일정 URL End-point
    this._calendarYearUrl = data.calendarYearUrl;

    this._schoolType = null; // init한 교육기관 유형 심볼 값
    this._schoolRegion = null; // init한 지역별 교육청 주소 심볼 값
    this._schoolCode = null; // init한 학교 코드 값

    this._init = false; // 학교 초기화 여부
  }

  /**
   * 데이터 조회 전에 준비 상태를 확인합니다.
   */
  _prepare() {
    if (!this._init) {
      throw new Error('학교 정보가 설정되지 않았습니다.');
    }
  }

  /**
   * 급식 데이터를 정제하여 반환합니다.
   * @param {string} d 급식 값
   */
  _parseMeal(d) {
    if (d) {
      const match = d.match(/^[0-9]{1,2}/);
      if (match) {
        const date = match[0];
        const menu = d.slice(date.length);
        return {
          date,
          menu: menu
            ? menu
                .replace(/\s/g, '')
                .replace(/<br\/>/g, '\n')
                .slice(1)
            : '',
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  /**
   * 학사일정 데이터를 정제하여 반환합니다.
   * @param {string} ev 학사일정 값
   */
  _parseCalendar(ev, sep) {
    if (ev) {
      let res = '';
      // 하루에 2개 이상의 일정이 있는 경우 | 로 구분되어있음
      ev.split('|').forEach((e) => {
        // : 문자로 학사일정에 날짜,일정 등이 구분되어있으며 뒤에서 두 번째 값이 학사일정 값
        const eventSplited = e.split(':');
        res += eventSplited[eventSplited.length - 2] + sep;
      });

      // 맨 뒤의 구분자 삭제
      return res.slice(0, res.length - sep.length);
    } else {
      return null;
    }
  }

  /**
   * 해당 학교로 인스턴스를 초기화 합니다.
   * @param {Symbol} type 교육기관 심볼
   * @param {Symbol} region 교육청 관할 지역 심볼
   * @param {string} schoolCode 학교명
   */
  init(type, region, schoolCode) {
    if (!(this._data.EDUTYPE[type] && this._data.REGION[region])) {
      throw new Error('교육기관 유형 또는 지역 값을 확인해주세요');
    }

    if (!(schoolCode && typeof schoolCode === 'string')) {
      throw new Error('학교 코드 값을 확인해주세요');
    }

    this._schoolType = type;
    this._schoolRegion = region;
    this._schoolCode = schoolCode;
    this._init = true;
    this._requestManager.setRegion(region);
  }

  /**
   * 해당 지역의 학교를 검색합니다.
   * @param {Symbol} region 교육청 관할 지역 심볼
   * @param {string} name 학교명
   */
  search(region, name) {
    if (!this._data.REGION[region]) {
      throw new Error('지역 값을 확인해주세요');
    }

    if (!(name && typeof name === 'string')) {
      throw new Error('검색할 학교명을 확인해주세요');
    }

    this._requestManager.setRegion(region);
    return this._requestManager
      .post(this._searchUrl, {
        kraOrgNm: name,
      })
      .then(({ data }) => {
        if (data.result.status === 'error') {
          throw new Error(data.result.message);
        }

        return data.resultSVO.orgDVOList.map((s) => {
          return {
            name: s.kraOrgNm,
            schoolCode: s.orgCode,
            address: s.zipAdres,
          };
        });
      });
  }

  /**
   * 지정한 년-월의 급식 데이터를 가져옵니다.
   * 년-월을 지정하지 않으면 현재 시점의 날짜를 기준으로 조회합니다.
   * @param {any} [year] 년도(Year) 혹은 설정 객체
   * @param {number} [month] 월(Month)
   */
  getMeal(year, month) {
    this._prepare();
    let option = {};
    const currentDate = new Date();

    if (typeof year === 'object') {
      option = year;
      year = option.year || currentDate.getFullYear();
      month = option.month || currentDate.getMonth() + 1;
    } else if (typeof year === 'undefined' || typeof month === 'undefined') {
      year = currentDate.getFullYear();
      month = currentDate.getMonth() + 1;
    }

    if (year <= 0) {
      throw new Error('년도(year) 값을 확인해주세요');
    }

    if ((month !== 0 && month < 1) || month > 12) {
      throw new Error('월(month)은 1~12 범위로 지정해주세요');
    }

    const schulCrseScCode = this._data.EDUTYPE[this._schoolType].toString();
    const schulKndScCode = '0' + schulCrseScCode;
    return this._requestManager
      .post(this._mealUrl, {
        ay: util.paddingNumber(year),
        mm: util.paddingNumber(month, 2),
        schulCode: this._schoolCode,
        schulKndScCode,
        schulCrseScCode,
      })
      .then(({ data }) => {
        if (data.result.status === 'error') {
          throw new Error(data.result.message);
        }

        const mealData = [];
        data.resultSVO.mthDietList.forEach((meal) => {
          mealData.push(this._parseMeal(meal.sun));
          mealData.push(this._parseMeal(meal.mon));
          mealData.push(this._parseMeal(meal.tue));
          mealData.push(this._parseMeal(meal.wed));
          mealData.push(this._parseMeal(meal.the));
          mealData.push(this._parseMeal(meal.fri));
          mealData.push(this._parseMeal(meal.sat));
        });

        const res = {};
        mealData.forEach((meal) => {
          if (meal && meal.date) {
            res[meal.date] = meal.menu || option.default || '';
          }
        });

        res.year = year;
        res.month = month;
        res.day = currentDate.getMonth() + 1 === month ? currentDate.getDate() : 0;
        res.today =
          year === currentDate.getFullYear() && month === currentDate.getMonth() + 1
            ? res[res.day] || ''
            : '';

        return res;
      });
  }

  /**
   * 지정한 년-월의 학사일정 데이터를 가져옵니다.
   * 년-월을 지정하지 않으면 현재 시점의 날짜를 기준으로 조회합니다.
   * @param {any} [year] 년도(Year) 혹은 설정 객체
   * @param {number} [month] 월(Month)
   */
  getCalendar(year, month) {
    this._prepare();
    let option = {};
    const currentDate = new Date();

    // 설정값 확인
    if (typeof year === 'object') {
      // year에 옵션 객체를 전달한 경우
      option = year;
      year = option.year || currentDate.getFullYear();
      month = option.month || currentDate.getMonth() + 1;
    } else if (typeof year === 'undefined' || typeof month === 'undefined') {
      // 인자가 없는 경우 현재 시점의 날짜로 설정
      year = currentDate.getFullYear();
      month = currentDate.getMonth() + 1;
    }

    if (year <= 0) {
      throw new Error('년도(year) 값을 확인해주세요');
    }

    if ((month !== 0 && month < 1) || month > 12) {
      throw new Error('월(month)은 1~12 범위로 지정해주세요');
    }

    // 요청을 위한 파라미터 및 URL
    const schulCrseScCode = this._data.EDUTYPE[this._schoolType].toString();
    const schulKndScCode = '0' + schulCrseScCode;

    // 새학기일 경우 2월달 이전의 달에 대한 학사 일정을 가져오는 예외처리
    if (new Date().getFullYear() === year && month <= 2) {
      return this._requestManager
        .post(this._calendarYearUrl, {
          ay: util.paddingNumber(year - 1), // 이전 년도 데이터를 사용
          schulCode: this._schoolCode,
          schulKndScCode,
          schulCrseScCode,
          sem: '2', // 2학기
        })
        .then(({ data }) => {
          // 응답 값 확인
          if (data.result.status === 'error') {
            throw new Error(data.result.message);
          }

          // 데이터를 순회하며 값을 정제합니다.
          // 연간일정은 day + i 는 요일, dd 는 날짜를 의미합니다.
          // 2학기는 9월에서 2월까지 입니다.
          // 따라서 day5, day6는 1월달 2월달 데이터를 의미합니다.

          const calendarData = [];
          data.resultSVO.selectYear.forEach((calendar, i) => {
            // day1, event1 과 같은 형식의 프로퍼티에 날짜와 학사일정 데이터가 존재함
            const event = this._parseCalendar(
              calendar['event' + (4 + month)],
              option.separator || ',',
            );

            calendarData.push({ date: i + 1, event: event !== 'undefined' ? event : null });
          });

          // 수집한 데이터에서 빈 데이터 및 확인된 데이터만 필더링하여 객체에 저장
          const res = {};
          calendarData.forEach((calendar) => {
            if (calendar && calendar.date && calendar.date !== 'NaN') {
              // 확인된 데이터만 추가
              res[calendar.date] = calendar.event || option.default || '';
            }
          });

          // 년도, 월, 오늘 날짜, 오늘의 학사일정 값을 상황에 맞게 추가합니다.
          res.year = year;
          res.month = month;
          res.day = currentDate.getMonth() + 1 === month ? currentDate.getDate() : 0;
          res.today =
            year === currentDate.getFullYear() && month === currentDate.getMonth() + 1
              ? res[res.day] || ''
              : '';

          return res;
        });
    }

    // 학사일정 데이터 요청
    return this._requestManager
      .post(this._calendarMonthUrl, {
        ay: util.paddingNumber(year),
        mm: util.paddingNumber(month, 2),
        schulCode: this._schoolCode,
        schulKndScCode,
        schulCrseScCode,
      })
      .then(({ data }) => {
        // 응답 값 확인
        if (data.result.status === 'error') {
          throw new Error(data.result.message);
        }
        /**
         * 학사일정 데이터를 정제하여 반환합니다.
         * @param {string} ev 학사일정 값
         */
        function parseCalendar(ev, sep) {
          if (ev) {
            let res = '';
            // 하루에 2개 이상의 일정이 있는 경우 | 로 구분되어있음
            ev.split('|').forEach((e) => {
              // : 문자로 학사일정에 날짜,일정 등이 구분되어있으며 뒤에서 두 번째 값이 학사일정 값
              const eventSplited = e.split(':');
              res += eventSplited[eventSplited.length - 2] + sep;
            });

            // 맨 뒤의 구분자 삭제
            return res.slice(0, res.length - sep.length);
          } else {
            return null;
          }
        }

        // 데이터를 순회하며 값을 정제합니다.
        const calendarData = [];
        data.resultSVO.selectMonth.forEach((calendar) => {
          // day1, event1 과 같은 형식의 프로퍼티에 날짜와 학사일정 데이터가 존재함
          for (let i = 1; i <= 7; i++) {
            const date = parseInt(calendar['day' + i]).toString();
            const event = parseCalendar(calendar['event' + i], option.separator || ',');
            calendarData.push({ date, event });
          }
        });

        // 수집한 데이터에서 빈 데이터 및 확인된 데이터만 필더링하여 객체에 저장
        const res = {};
        calendarData.forEach((calendar) => {
          if (calendar && calendar.date && calendar.date !== 'NaN') {
            // 확인된 데이터만 추가
            res[calendar.date] = calendar.event || option.default || '';
          }
        });

        // 년도, 월, 오늘 날짜, 오늘의 학사일정 값을 상황에 맞게 추가합니다.
        res.year = year;
        res.month = month;
        res.day = currentDate.getMonth() + 1 === month ? currentDate.getDate() : 0;
        res.today =
          year === currentDate.getFullYear() && month === currentDate.getMonth() + 1
            ? res[res.day] || ''
            : '';

        return res;
      });
  }
}

School.Type = type;
School.Region = region;

export default School;

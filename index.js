/**
 * @name node-school-kr
 * @description 전국 교육청 급식, 학사일정 파싱 라이브러리
 * @author Leegeunhyeok
 * @license MIT
 * @version 3.0.0
 *
 * Github : https://github.com/leegeunhyeok/node-school-kr
 * NPM : https://www.npmjs.com/package/node-school-kr
 */

// 아래 코드는 트랜스파일 할 경우 정상 동작하지 않음 (Babel 7, @babel/preset-env)
// import { RequestManager } from './src/core';

import core from './src/core';
import Data from './data';
const { type, region, data } = Data;

class School {
  /**
   * @constructor
   */
  constructor () {
    this._request = new core.RequestManager(); // HTTP 요청 관리 객체
    this._data = data;                         // 데이터 정의 객체
    this._searchUrl = data.searchUrl;          // 검색 URL End-point
    this._mealUrl = data.mealUrl;              // 급식 URL End-point
    this._calendarUrl = data.calendarUrl;      // 학사일정 URL End-point

    this._schoolType = null;   // init한 교육기관 유형 심볼 값
    this._schoolRegion = null; // init한 지역별 교육청 주소 심볼 값
    this._schoolCode = null;    // init한 학교 코드 값

    this._init = false;
  }

  _prepare () {
    if (!this._init) {
      throw new Error('학교 정보가 설정되지 않았습니다.');
    }
  }

  _makeUrl (region, url) {
    const host = this._data.REGION[region];
    return `https://${host}/${url}`;
  }

  _convertNumber (number, length) {
    if (length === undefined) {
      return number.toString();
    }

    const targetNumber = number.toString();
    let p = '';
    for (let i = 0; i < targetNumber.length - length; i++) {
      p += '0';
    }

    return p + targetNumber;
  }

  init (type, region, schoolCode) {
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
  }

  /**
   * @description 해당 지역의 학교를 검색합니다.
   * @param {Symbol} region 교육청 관할 지역 심볼
   * @param {string} name 학교명
   */
  search (region, name) {
    if (!this._data.REGION[region]) {
      throw new Error('지역 값을 확인해주세요');
    }

    if (!(name && typeof name === 'string')) {
      throw new Error('검색할 학교명을 확인해주세요');
    }

    return this._request.post(this._makeUrl(region, this._searchUrl), {
      kraOrgNm: name
    })
      .then(({ data }) => {
        if (data.result.status === 'error') {
          throw new Error(data.result.message);
        }

        return data.resultSVO.orgDVOList.map(s => {
          return {
            name: s.kraOrgNm,
            schoolCode: s.orgCode,
            address: s.zipAdres
          };
        });
      });
  }

  getMeal (year, month) {
    this._prepare();
    let option = {};
    if (typeof year === 'object') {
      option = year;
      year = option['year'];
      month = option['month'];
    } else if (
      year === undefined && month === undefined
    ) {
      year = 0;
      month = 0;
    } else if (
      year === undefined || month === undefined
    ) {
      throw new Error('날짜를 지정하려면 년도와 월 모두 지정해주세요');
    }

    if (month !== 0 && month < 1 || month > 12) {
      throw new Error('월(Month)은 1~12 범위로 지정해주세요');
    }

    const mealRequestUrl = this._makeUrl(this._schoolRegion, this._mealUrl);
    return this._request.post(mealRequestUrl, {
      ...(year ? {
        ay: this._convertNumber(year)
      } : null),
      ...(month ? {
        mm: this._convertNumber(month, 2)
      } : null),
      schulCode: this._schoolCode,
      schulCrseScCode: this._data.EDUTYPE[this._schoolType].toString()
    }).then(({ data }) => {
      if (data.result.status === 'error') {
        throw new Error(data.result.message);
      }

      function parseMeal (d) {
        if (d) {
          const match = d.match(/^[0-9]{1,2}/);
          if (match) {
            const date = match[0];
            const menu = d.slice(date.length);
            return {
              date,
              menu: menu ? menu
                .replace(/\s/g, '')
                .replace(/<br\/>/g, '\n')
                .slice(1)
                : ''
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      }

      const mealData = [];
      data.resultSVO.mthDietList.map(meal => {
        mealData.push(parseMeal(meal.sun));
        mealData.push(parseMeal(meal.mon));
        mealData.push(parseMeal(meal.tue));
        mealData.push(parseMeal(meal.wed));
        mealData.push(parseMeal(meal.the));
        mealData.push(parseMeal(meal.fri));
        mealData.push(parseMeal(meal.sat));
      });

      // TODO: 급식 데이터 정제
      return mealData;
    });
  }
}

School.Type = type;
School.Region = region;

export default School;

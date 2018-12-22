/**
 * node-school-kr Module
 *
 * school.js
 * 
 * Github : https://github.com/leegeunhyeok/node-school-kr
 * NPM : https://www.npmjs.com/package/node-school-kr
 * 
 * @description 전국 급식, 학사일정 API
 * @author Leegeunhyeok
 * @license MIT
 * @version 2.1.0
 *
 */

const { DATA, TYPE, REGION } = require('./data/data.js')
const Meal = require('./src/meal.js')
const Calendar = require('./src/calendar.js')

class School {
  /**
   * @static TYPE Symbols
   */
  static get Type () {
    return TYPE
  }
  
  /**
   * @static REGION Symbols
   */
  static get Region () {
    return REGION
  }

  /**
   * @constructor School 생성자
   */
  constructor () {
    this._DATA = DATA                     // 데이터 정의 객체
    this._mealUrl = DATA.mealUrl          // 급식 URL
    this._calendarUrl = DATA.calendarUrl  // 학사일정 URL
    this._meal = new Meal()               // 급식 인스턴스 생성
    this._calendar = new Calendar()       // 학사일정 인스턴스 생성
  }

  /**
   * @description 해당 교육기관으로 인스턴스를 초기화 합니다.
   * @doc type과 region은 data 폴더의 data.js에서 확인 가능합니다. 사용 방법은 sample 폴더의 sample.js 참고
   * @param {Symbol} type 교육기관 유형(병설유치원, 초, 중, 고)
   * @param {Symbol} region 교육청 지역
   * @param {string} schoolCode 학교 고유번호 (https://www.meatwatch.go.kr/biz/bm/sel/schoolListPopup.do)
   */
  init (type, region, schoolCode) {
    /* 초기화 여부 */
    if (this._initialized) {
      throw new Error(`본 인스턴스는 [${this._schoolCode}]로 이미 초기화 되어있습니다.`)
    } else if (type && region && schoolCode) {
      this._eduType = this._DATA.EDUTYPE[type]
      this._region = this._DATA.REGION[region]
      this._schoolCode = schoolCode
      this._initialized = true
    } else {
      throw new Error('교육기관 타입, 지역, 학교 코드는 필수 데이터 입니다.')
    }
  }

  /**
   * @description 해당 교육기관으로 인스턴스를 재설정 합니다.
   * @doc type과 region은 data 폴더의 data.js에서 확인 가능합니다. 사용 방법은 sample 폴더의 sample.js 참고
   * @param {Symbol} type 교육기관 유형 (병설유치원, 초, 중, 고)
   * @param {Symbol} region 교육청 지역
   * @param {string} schoolCode 학교 고유번호 (https://www.meatwatch.go.kr/biz/bm/sel/schoolListPopup.do)
   */
  reset (type, region, schoolCode) {
    if (!this._initialized) {
      throw new Error('초기화 이후 재설정 할 경우에만 사용 가능합니다.')
    } else if (type && region && schoolCode) {
      this._eduType = this._DATA.EDUTYPE[type]
      this._region = this._DATA.REGION[region]
      this._schoolCode = schoolCode
      // 재설정 완료
    } else {
      throw new Error('교육기관 유형, 지역, 학교 코드는 필수 데이터 입니다.')
    }
  }

  /**
   * @description MM 형식으로 변환하여 반환합니다.
   * @param {any} month MM 형식으로 변환할 데이터
   * @return {string} MM 형식으로 변환된 데이터
   */
  monthFormat (month) {
    month = month.toString()

    // 변환할 데이터 길이가 2보다 큰 경우 빈 값 반환
    if (month.length > 2) {
      return ''
    }

    // 변환할 데이터가 빈 값이거나 길이가 2라면 원래의 값 반환
    if (month === '' || month.length === 2) {
      return month
    }

    // 위 조건에 맞지 않는 경우 데이터 앞에 0을 붙여서 반환
    return '0' + month
  }

  /**
   * @description type에 해당하는 파싱할 타겟 URL 생성
   * @param {string} type URL 유형 문자열 데이터(meal, calendar)
   * @return {string} 유형에 해당하는 URL
   */
  createUrl (type, year, month) {
    if (this._initialized) {
      const typeString = type.toLowerCase()
      let typeUrl = ''

      if (typeString === 'meal') {
        typeUrl = this._mealUrl
      } else if (typeString === 'calendar') {
        typeUrl = this._calendarUrl
      } else {
        throw new Error('알 수 없는 유형입니다.')
      }

      let targetUrl = `https://${this._region}/${typeUrl}?`
      targetUrl += `schulCode=${this._schoolCode}&`
      targetUrl += `schulCrseScCode=${this._eduType}&`
      targetUrl += `schulKndScCode=0${this._eduType}&`
      targetUrl += `ay=${year || ''}&`
      targetUrl += `mm=${this.monthFormat(month || '')}&`
      return targetUrl
    } else {
      throw new Error('인스턴스가 초기화 되지 않았습니다.')
    }
  }

  /**
   * @description 지정한 유형(meal, calendar)의 파싱 타겟 페이지 URL을 반환합니다.
   * @param {string} type URL 유형 문자열 데이터(meal, calendar)
   * @param {number} year 지정한 연도
   * @param {number} month 지정한 달
   * @return {string} 지정한 유형(meal, calendar)의 타겟 페이지 URL
   */
  getTargetURL (type, year, month) {
    if (!((year !== undefined && month !== undefined) || (year === undefined && month === undefined))) {
      throw new Error('날짜를 지정하려면 년도와 월 모두 지정해주세요')
    }
    return this.createUrl(type, year, month)
  }

  /**
   * @description 이번 달 급식 데이터를 파싱합니다.
   * @param {number} year 지정한 연도
   * @param {number} month 지정한 달
   * @return {any} 이번 달 급식 데이터
   */
  getMeal (year, month) {
    if (!((year !== undefined && month !== undefined) || (year === undefined && month === undefined))) {
      throw new Error('날짜를 지정하려면 년도와 월 모두 지정해주세요')
    }

    if (month < 1 || month > 12) {
      throw new Error('월(Month)은 1~12 범위로 지정해주세요')
    }

    if (this._initialized) {
      return this._meal.getData(this.createUrl('meal', year, month))
    } else {
      throw new Error('인스턴스가 초기화 되지 않았습니다.')
    }
  }

  /**
   * @description 이번 달 학사일정을 파싱합니다.
   * @param {number} year 지정한 연도
   * @param {number} month 지정한 달
   * @return {any} 이번 달 학사일정 데이터
   */
  getCalendar (year, month) {
    if (!((year !== undefined && month !== undefined) || (year === undefined && month === undefined))) {
      throw new Error('날짜를 지정하려면 년도와 월 모두 지정해주세요')
    }

    if (month < 1 || month > 12) {
      throw new Error('월(Month)은 1~12 범위로 지정해주세요')
    }

    if (this._initialized) {
      return this._calendar.getData(this.createUrl('calendar', year, month))
    } else {
      throw new Error('인스턴스가 초기화 되지 않았습니다.')
    }
  }
}

module.exports = School

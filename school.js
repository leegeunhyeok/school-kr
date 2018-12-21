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
 * @version 2.0.1
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
   * @description type에 해당하는 파싱할 타겟 URL 생성
   * @param {string} type URL 유형 문자열 데이터(meal, calendar)
   * @return {string} 유형에 해당하는 URL
   */
  createUrl (type) {
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
      return `https://${this._region}/${typeUrl}?schulCode=${this._schoolCode}&schulCrseScCode=${this._eduType}&schulKndScCode=${this._eduType}`
    } else {
      throw new Error('인스턴스가 초기화 되지 않았습니다.')
    }
  }

  /**
   * @description 이번 달 급식 데이터를 파싱합니다.
   * @return {any} 이번 달 급식 데이터
   */
  getMeal () {
    if (this._initialized) {
      return this._meal.getData(this.createUrl('meal'))
    } else {
      throw new Error('인스턴스가 초기화 되지 않았습니다.')
    }
  }

  /**
   * @description 이번 달 학사일정을 파싱합니다.
   * @return {any} 이번 달 학사일정 데이터
   */
  getCalendar () {
    if (this._initialized) {
      return this._calendar.getData(this.createUrl('calendar'))
    } else {
      throw new Error('인스턴스가 초기화 되지 않았습니다.')
    }
  }

  /**
   * @description 지정한 유형(meal, calendar)의 파싱 타겟 페이지 URL을 반환합니다.
   * @param {string} type URL 유형 문자열 데이터(meal, calendar)
   * @return {string} 지정한 유형(meal, calendar)의 타겟 페이지 URL
   */
  getTargetURL (type) {
    return this.createUrl(type)
  }
}

module.exports = School

/**
 * node-school-kr Module
 * 
 * school.js
 * 
 * @description 교육청에서 이번 달 급식, 학사일정을 파싱하여 제공합니다.
 * @author Leegeunhyeok
 * @version 1.0.1
 *
 */

const Meal = require('./src/meal.js')
const Notice = require('./src/notice.js')

class School {
  constructor() {
    const data = require('./data/data.js') // 데이터 정의 모듈
    this.eduType = data.eduType            // 교육기관 유형 
    this.region = data.region              // 교육청 지역
    this.mealUrl = data.mealUrl            // 급식 URL
    this.noticeUrl = data.noticeUrl        // 학사일정 URL
    this.meal = new Meal()                 // 급식 인스턴스 생성
    this.notice = new Notice()             // 학사일정 인스턴스 생성
  }

  /**
   * @description 해당 교육기관으로 인스턴스를 초기화 합니다.
   * type과 region은 sample 폴더의 sample.js 예제파일을 참고하여 사용하세요
   * 
   * @param type 교육기관 유형(병설유치원, 초, 중, 고)
   * @param region 교육청 지역
   * @param schoolCode 학교 고유번호 (https://www.meatwatch.go.kr/biz/bm/sel/schoolListPopup.do)
   */
  init(type, region, schoolCode) {
    /* 초기화 여부 */
    if (this.initialized) {
      console.log(`본 인스턴스는 [${this.schoolCode}]로 이미 초기화 되었습니다. reset()으로 재설정 가능합니다.`)
      return
    } else if (type && region && schoolCode) {
      this._eduType = type
      this._region = region
      this.schoolCode = schoolCode
      this.initialized = true
    } else {
      throw new Error('교육기관 타입, 지역, 학교 코드는 필수 데이터 입니다.')
    }
  }

  /**
   * @description 해당 교육기관으로 인스턴스를 재설정 합니다.
   * type과 region은 sample 폴더의 sample.js 예제파일을 참고하여 사용하세요
   * 
   * @param type 교육기관 유형(병설유치원, 초, 중, 고)
   * @param region 교육청 지역
   * @param schoolCode 학교 고유번호 (https://www.meatwatch.go.kr/biz/bm/sel/schoolListPopup.do)
   */
  reset(type, region, schoolCode) {
    if (!this.initialized) {
      console.log('초기화 이후 재설정 할 경우에만 사용 가능합니다.')
      return
    } else if (type && region && schoolCode) {
      this._eduType = type
      this._region = region
      this.schoolCode = schoolCode
      console.log(schoolCode, '로 재설정 되었습니다.')
    } else {
      throw new Error('교육기관 타입, 지역, 학교 코드는 필수 데이터 입니다.')
    }
  }

  /**
   * @description type에 맞는 URL 생성
   * 
   * @param type URL 유형 문자열 데이터(meal, notice)
   */
  createUrl(type) {
    if(this.initialized) {
      let typeUrl = ''
      switch(type.toLowerCase()) {
        case 'meal':
          typeUrl = this.mealUrl
          break

        case 'notice':
          typeUrl = this.noticeUrl
          break
        
        default:
          break
      }
      return `https://${this._region}/${typeUrl}?schulCode=${this.schoolCode}&schulCrseScCode=${this._eduType}&schulKndScCode=${this._eduType}`
    } else {
      throw new Error('정보가 초기화 되지 않았습니다. init()를 호출해주세요.')
    }
  }

  /**
   * @description 이번 달 급식 데이터를 파싱합니다.
   */
  getMeal() {
    if(this.initialized) {
      return this.meal.getData(this.createUrl('meal'))
    } else {
      throw new Error('정보가 초기화 되지 않았습니다. init()를 호출해주세요.')
    }
  }


  /**
   * @description 이번 달 학사일정을 파싱합니다.
   */
  getNotice() {
    if(this.initialized) {
      return this.notice.getData(this.createUrl('notice'))
    } else {
      throw new Error('정보가 초기화 되지 않았습니다. init()를 호출해주세요.')
    }
  }
}

module.exports = School
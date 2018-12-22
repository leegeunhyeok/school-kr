/**
 * sample.js
 * 
 * @description 샘플 테스트 코드입니다.
 * @version 2.1.0
 */

/* 모듈 불러오기 */
// const School = require('node-school-kr')
const School = require('../school.js')

/* 인스턴스 생성 */
const school = new School()

/**
 * Type    : 병설유치원, 초, 중, 고
 * Region     : 교육청 지역
 * schoolCode : 학교 고유 번호
 * 
 * 학교 고유번호는 아래 링크에서 검색 가능
 * https://www.meatwatch.go.kr/biz/bm/sel/schoolListPopup.do
 *
 * 아래 예제는 경기도의 광명경영회계고등학교를 기준으로 함
 *
 * init()없이 데이터 불러올 경우 Error 발생
 */

// 경기도 광명시의 광명고등학교로 init()
school.init(School.Type.HIGH, School.Region.GYEONGGI, 'J100000482')

// reset()은 init() 이후에 가능
// 경기도 광명시의 광명경영회계고등학교로 재설정
school.reset(School.Type.HIGH, School.Region.GYEONGGI, 'J100000488')

const test = async function () {
  console.log('[파싱할 타겟 URL]')
  // 2018년 5월 급식 데이터를 조회하는 타겟 URL을 반환합니다.
  console.log(school.getTargetURL('meal', 2018, 5))
  // 년도와 월을 입력하지 않으면 이번 달 데이터를 조회하는 타겟 URL을 반환합니다.
  console.log(school.getTargetURL('calendar') + '\n')

  /* 
    2018년 5월 급식 데이터를 불러옵니다.
    const meal = await school.getMeal(2018, 5)
    
    년도와 월을 인자로 전달하지 않을 경우 이번 달 데이터를 조회합니다.
    const meal = await school.getMeal()
  */
  const meal = await school.getMeal()

  console.log('[오늘 날짜]')
  console.log(`${meal.month}월 ${meal.day}일\n`)

  console.log('[오늘 급식]')
  console.log(meal.today || '급식이 없습니다.' + '\n')

  console.log('[이번 달 급식 정보]')
  console.log(meal)
  console.log('')

  console.log('[2018년 7월 학사일정]')
  // 급식과 마찬가지로 년도와 월을 지정하면 해당 데이터를 반환하고,
  // 년도와 월을 지정하지 않으면 이번 달 데이터를 반환합니다.
  console.log(await school.getCalendar(2018, 7))
}

test()

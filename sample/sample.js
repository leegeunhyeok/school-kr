/**
 * sample.js
 * 
 * @description 샘플 테스트 코드입니다.
 * @version 2.0.1
 */

/* 모듈 불러오기 */
// const School = require('node-school-kr')
const School = require('../school.js')

/* 인스턴스 생성 */
const school = new School()

/**
 * eduType    : 병설유치원, 초, 중, 고
 * region     : 교육청 지역
 * schoolCode : 학교 고유 번호
 * 
 * 학교 고유번호는 아래 링크에서 검색 가능
 * https://www.meatwatch.go.kr/biz/bm/sel/schoolListPopup.do
 *
 * 아래 예제는 경기도의 광명경영회계고등학교를 기준으로 함
 *
 * init()없이 데이터 불러올 경우 Error 발생
 */

/* 경기도 광명시의 광명고등학교로 init() */
school.init(School.Type.HIGH, School.Region.GYEONGGI, 'J100000482')

/* reset()은 init() 이후에 가능 */
/* 경기도 광명시의 광명경영회계고등학교로 재설정 */
school.reset(School.Type.HIGH, School.Region.GYEONGGI, 'J100000488')

/* 비동기 함수 방식 예제 */
const sampleAsync = async function () {
  const meal = await school.getMeal()

  console.log('[파싱할 타겟 URL]')
  console.log(school.getTargetURL('meal'))
  console.log(school.getTargetURL('calendar'))
  console.log('\n\n')

  console.log('[오늘 날짜]') 
  console.log(`${meal.month}월 ${meal.day}일`)
  console.log('\n\n')

  console.log('[오늘 급식 - Async]')
  console.log(meal.today || '급식이 없습니다.')
  console.log('\n\n')

  console.log('[이번 달 급식 정보 - Async]')
  console.log(meal)
  console.log('\n\n')

  console.log('[이번 달 학사일정 - Async]')
  console.log(await school.getCalendar())
  console.log('\n\n')
}

/* 프라미스 방식 예제 */
const samplePromise = function () {
  school.getMeal().then(result => {
    console.log('[오늘 날짜]') 
    console.log(`${result.month}월 ${result.day}일`)
    console.log('\n\n')

    console.log('[오늘 급식 - Promise]')
    console.log(result.today || '급식이 없습니다.')
    console.log('\n\n')

    console.log('[이번 달 급식 정보 - Promise]')
    console.log(result)

    return school.getCalendar()
  }).then(result => {
    console.log('\n\n')
    console.log('[이번 달 학사일정 - Promise]')
    console.log(result)
  })
}

// 두 예제를 순차적으로 실행
sampleAsync().then(() => { samplePromise() })

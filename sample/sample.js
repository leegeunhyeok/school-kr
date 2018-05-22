/**
 * sample.js
 * 
 * @description 샘플 테스트 코드입니다.
 * @version 1.0.1
 */


/* 모듈 불러오기 */
const School = require('../school.js') 

/* 객체 생성 */
const school = new School()

/**
 * eduType    : 병설유치원, 초, 중, 고
 * region     : 교육청 지역
 * schoolCode : 학교 고유 번호
 * 
 * 고유번호는 아래 링크에서 검색 가능
 * https://www.meatwatch.go.kr/biz/bm/sel/schoolListPopup.do
 * 
 * 아래 예제는 경기도의 광명경영회계고등학교를 기준으로 함
 * 
 * init()없이 데이터 불러올 경우 Error 발생 
 */

/* 경기도 광명시의 광명고등학교로 init() */
school.init(school.eduType.high, school.region.gyeonggi, 'J100000482')

/* reset()은 init() 이후에 가능 */
/* 경기도 광명시의 광명경영회계고등학교로 재설정 */
school.reset(school.eduType.high, school.region.gyeonggi, 'J100000488')

console.log(school.eduType.high)
console.log(school.region.seoul)

/* 비동기 함수 방식 예제 */
const sampleAsync = async function() {
  console.log('[이번 달 급식 정보 - Async]\n')
  console.log(await school.getMeal())

  console.log('\n\n\n')

  console.log('[이번 달 학사일정 - Async]\n')
  console.log(await school.getNotice())
}

/* 프라미스 방식 예제 */
const samplePromise = function() {
  school.getMeal().then(result => {
    console.log('[이번 달 급식 정보 - Promise]\n')
    console.log(result)
    return school.getNotice()
  }).then(result => {
    console.log('\n\n\n')
    console.log('[이번 달 학사일정 - Promise]\n')
    console.log(result)
  })
}

// 두 예제를 순차적으로 실행
sampleAsync().then(() => { samplePromise() })
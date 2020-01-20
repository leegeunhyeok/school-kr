/**
 * @description 샘플 테스트 코드입니다.
 */

// const School = require('node-school-kr')
const School = require('../entry.js')

/* 인스턴스 생성 */
const school = new School()

async function sample () {
  // 경기도 지역의 광명경영회계고등학교 검색
  const result = await school.search(School.Region.GYEONGGI, '광명경영회계고등학교')
  console.log('검색 결과:', result)

  // 경기도 지역의 광명경영회계고등학교로 초기화
  school.init(School.Type.HIGH, School.Region.GYEONGGI, 'J100000488')

  const meal = await school.getMeal()
  // const meal = await scool.getMeal(2020, 3)
  // const meal = await school.getMeal({
  //   year: 2020,
  //   month: 3,
  //   default: '급식 없음'
  // })

  const calendar = await school.getCalendar()
  // const meal = await scool.getCalendar(2020, 3)
  // const meal = await school.getMeal({
  //   year: 2020,
  //   month: 3,
  //   default: '일정 없음',
  //   separator: '\n'
  // })

  console.log(meal)
  console.log(calendar)
}

sample()

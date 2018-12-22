/**
 * meal.js
 * 
 * @description 교육청에서 급식 정보 파싱 후 json 데이터를 반환합니다.
 * @author Leegeunhyeok
 * @version 2.1.0
 * 
 */

const request = require('request')
const cheerio = require('cheerio')

class Meal {
  /**
   * @description 이번 달 급식 데이터를 파싱합니다.
   * @param {string} url 파싱할 타겟 URL
   * @return {any} 이번 달 급식 데이터
   */
  async getData (url) {
    try {
      let body = await new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
          if(err) {
            reject(err)
          }
          resolve(body)
        })
      })
      
      let $ = cheerio.load(body, {decodeEntities: false})

      // 급식 데이터 갯수 카운트, 반복하며 1씩 증가 (오늘 급식 데이터를 )
      let count = 1
      let today = ''
      let customDate = false

      // URL에 지정한 년도, 월이 있는지 추출
      const yearParam = url.match(/ay=[0-9]{4}/)
      const monthParam = url.match(/mm=[0-9]{2}/)
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1

      let year = 0
      let month = 0
      let day = 0

      if (yearParam) {
        // URL에 있는 년도 데이터 추출
        year = parseInt(yearParam[0].replace('ay=', ''))

        // URL에 지정된 년도가 이번 년도가 아닌 경우 커스텀 데이터로 구분
        if (!(year === currentYear)) {
          customDate = true
        }
      } else {
        // URL에 지정한 년도가 없는 경우 이번 년도로 지정
        year = currentDate.getFullYear()
      }

      if (monthParam) {
        // URL에 있는 월 데이터 추출
        month = parseInt(monthParam[0].replace('mm=', ''))

        // URL에 지정된 월이 이번 달이 아닌 경우 커스텀 데이터로 구분
        if (!(month === currentMonth)) {
          customDate = true
        }
      } else {
        // URL에 지정한 월이 없는 경우 이번 달로 지정
        month = currentDate.getMonth() + 1
      }

      // 사용자가 지정한 년도, 월이 이번 달 데이터인 경우 오늘 날짜 저장
      // >> 사용자가 지정한 년도, 월이 이번 달 데이터가 아닌 경우 day는 0으로 저장 됨
      if (!customDate) {
        day = currentDate.getDate()
      }

      /* 결과 저장 객체 */
      let result = {
        year,
        month,
        day
      }
      
      $('tbody > tr > td').each(function () {
        if ($(this).text().match(/^[0-9]{1,2}/)) {
          let html = $(this).html().replace(/^<div>/, '').replace(/<\/div>$/, '')
          let date = html.match(/^[0-9]{1,2}/)[0]
          let menu = html.replace(/^[0-9]{1,2}<br>/, '').replace(/<br>/g, '\n')

          // 급식이 없을 경우 빈 문자열로 설정
          if (menu.match(/^[0-9]{1,2}/)) {
            menu = ''
          }

          // 해당 날짜에 급식 데이터 추가
          result[date] = menu

          // 오늘 날짜의 급식 메뉴를 today에 임시 저장
          if (count === day) {
            today = menu
          }
          count++
        }
      })
      result['today'] = today // 오늘의 급식
      return result
    } catch(e) {
      /* 에러 핸들링 */
      console.error(e)
      return {}
    }
  }
}

module.exports = Meal

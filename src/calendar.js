/**
 * calendar.js
 *
 * @description 교육청에서 급식 정보 파싱 후 json 데이터를 반환합니다.
 * @author Leegeunhyeok
 * @version 2.1.0
 *
 */

const request = require('request')
const cheerio = require('cheerio')

class Calendar {
  /**
   * @description 이번 달 학사일정 데이터를 파싱합니다.
   * @param {string} url 파싱할 타겟 URL
   * @return {any} 이번 달 학사일정 데이터
   */
  async getData (url) {
    try {
      const body = await new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
          if(err) {
            reject(err)
          }
          resolve(body)
        })
      })

      const $ = cheerio.load(body, { decodeEntities: false })

      const yearParam = url.match(/ay=[0-9]{4}/)
      const monthParam = url.match(/mm=[0-9]{2}/)
      const currentDate = new Date()

      // URL에 지정한 년도, 월이 있을 경우 해당 데이터 추출
      // 년도 또는 월을 지정하지 않았다면 현재 날짜로 설정
      const year = yearParam ? parseInt(yearParam[0].replace('ay=', '')) : currentDate.getFullYear()
      const month = monthParam ? parseInt(monthParam[0].replace('mm=', '')) : currentDate.getMonth() + 1

      /* 결과 저장 객체 */
      const result = {
        year,
        month
      }

      $('tbody > tr > td').each(function () {
        const dayText = $(this).find('div.textL em').text() // 날짜 텍스트 추출

        // 날짜 텍스트가 비어있지 않은 경우
        if (dayText) {
          // 날짜 텍스트를 숫자로 변환
          const day = parseInt(dayText)

          // 현재 날짜의 일정 데이터 저장 변수
          let content = ''

          // 하루에 여러 일정이 있을 수 있음. 반복하며 모든 일정 추가
          $(this).find('a').each(function () {
            const temp = $(this).text().trim()

            // 일정이 비어있거나 토요휴업일이 아니면 content에 누적
            if (temp && temp !== '토요휴업일') {
              content += temp + ','
            }
          })

          // 결과에 현재 날짜 일정 데이터 추가
          result[day] = content.slice(0, -1) // 마지막 ',' 문자 제거
        }
      })
      return result
    } catch(e) {
      /* 에러 핸들링 */
      console.error(e)
      return {}
    }
  }
}

module.exports = Calendar

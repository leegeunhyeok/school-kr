/**
 * notice.js
 * 
 * @description 교육청에서 급식 정보 파싱 후 json 데이터를 반환합니다.
 * @author Leegeunhyeok
 * @version 1.0.1
 * 
 */

const request = require('request')
const cheerio = require('cheerio')

class Notice {
  /**
   * @description 학사일정 URL에 접속하여 데이터를 수집합니다.
   * 
   * @param url 교육청 학사일정 정보 URL 
   */
  async getData(url) {
    try {
      let $body = await new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
          if(err) {
            reject(err)
          }
          resolve(body)
        })
      })
  
      let $ = cheerio.load($body, {decodeEntities: false})
      let $month = new Date().getMonth() + 1 // 이번달 
      /* 결과 저장 객체 */
      let result = {
        month: $month
      }

      $('tbody > tr > td').each(function(idx) {
        let dayText = $(this).find('div.textL em').text() // 날짜 텍스트 추출
        if(dayText) { // 날짜 텍스트가 비어있지 않은 경우
          let day = parseInt(dayText) // 숫자로 변환
          let content = ''
          $(this).find('a').each(function(idx) { // 하루에 여러 일정이 있을 수 있음
            let temp = $(this).text().trim()
            if(temp && temp !== '토요휴업일') { // 비어있거나 토요휴업일이 아니면 content에 누적
              content += temp + ','
            }
          })
          result[day] = content.slice(0, -1) // 마지막 , 문자 제거
        }
      })
      return result
    } catch(e) {
      /* 에러 핸들링 */
      console.log('[Notice]', e)
      return {}
    }
  }
}

module.exports = Notice
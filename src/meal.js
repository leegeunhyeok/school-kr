/**
 * meal.js
 * 
 * @description 교육청에서 급식 정보 파싱 후 json 데이터를 반환합니다.
 * @author Leegeunhyeok
 * @version 1.0.1
 * 
 */

const request = require('request')
const cheerio = require('cheerio')

class Meal {
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
      const $date = new Date() 
      const $day = $date.getDate() // 오늘 날짜
      const $month = $date.getMonth() + 1 // 현재 달
      let $ = cheerio.load($body, {decodeEntities: false})
      let count = 1
      let today = ''
      /* 결과 저장 객체 */
      let result = { 
        month: $month,
        day: $day
      }
      
      $('tbody > tr > td').each(function(idx) {
        if($(this).text().match(/^[0-9]{1,2}/)) {
          let html = $(this).html().replace(/^<div>/, '').replace(/<\/div>$/, '')
          let day = html.match(/^[0-9]{1,2}/)[0]
          let menu = html.replace(/^[0-9]{1,2}<br>/, '').replace(/<br>/g, '\n')
          if(menu.match(/^[0-9]{1,2}/)) {
            menu = '' // 급식이 없을 경우 빈 문자열
          }
          result[day] = menu
          if(count === $day) { // 오늘 날짜의 급식 메뉴를 today에 임시 저장
            today = menu
          }
          count++
        }
      })
      result['today'] = today // 오늘의 급식
      return result
    } catch(e) {
      /* 에러 핸들링 */
      console.log('[Meal]', e)
      return {}
    }
  }
}

module.exports = Meal
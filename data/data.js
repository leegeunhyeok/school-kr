/**
 * data.js
 * 
 * @description 지역별 교육청 주소, 교육기관 종류의 데이터 정의
 * @author Leegeunhyeok
 * @version 1.0.1
 * 
 */

const $data = {
  /* 교육기관 유형 */
  eduType: {
    kindergarden: 1, // 병설유치원
    elementary: 2,   // 초등학교
    middle: 3,       // 중학교
    high: 4          // 고등학교
  },
  /* 지역별 교육청 주소 */
  region: {
    seoul: 'stu.sen.go.kr',     // 서울
    incheon: 'stu.ice.go.kr',   // 인천
    busan: 'stu.pen.go.kr',     // 부산
    gwangju: 'stu.gen.go.kr',   // 광주
    daejeon: 'stu.dge.go.kr',   // 대전
    deagu: 'stu.dge.go.kr',     // 대구
    sejong: 'stu.sje.go.kr',    // 세종
    ulsan: 'stu.use.go.kr',     // 울산
    gyeonggi: 'stu.goe.go.kr',  // 경기
    kangwon: 'stu.kwe.go.kr',   // 강원
    chungbuk: 'stu.cbe.go.kr',  // 충북
    chungnam: 'stu.cne.go.kr',  // 충남
    gyeongbuk: 'stu.gbe.go.kr', // 경북
    gyeongnam: 'stu.gne.go.kr', // 경남
    jeonbuk: 'stu.jbe.go.kr',   // 전북
    jeonnam: 'stu.jne.go.kr',   // 전남
    jeju: 'stu.jje.go.kr'       // 제주
  },
  mealUrl: 'sts_sci_md00_001.do',  // 급식 URL
  noticeUrl: 'sts_sci_sf01_001.do' // 학사일정 URL
}

module.exports = $data
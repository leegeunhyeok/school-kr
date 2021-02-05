/**
 * @description 지역별 교육청 주소, 교육기관 종류의 데이터 정의
 * @author Leegeunhyeok
 */

// 교육기관 유형 심볼 Namespace
const $EDUTYPE = {
  KINDERGARTEN: Symbol('KINDERGARTEN'),
  ELEMENTARY: Symbol('ELEMENTARY'),
  MIDDLE: Symbol('MIDDLE'),
  HIGH: Symbol('HIGH'),
};

// 관할지역 심볼 Namespace
const $REGION = {
  SEOUL: Symbol('SEOUL'),
  INCHEON: Symbol('INCHEON'),
  BUSAN: Symbol('BUSAN'),
  GWANGJU: Symbol('GWANGJU'),
  DAEJEON: Symbol('DAEJEON'),
  DAEGU: Symbol('DAEGU'),
  SEJONG: Symbol('SEJONG'),
  ULSAN: Symbol('ULSAN'),
  GYEONGGI: Symbol('GYEONGGI'),
  KANGWON: Symbol('KANGWON'),
  CHUNGBUK: Symbol('CHUNGBUK'),
  CHUNGNAM: Symbol('CHUNGNAM'),
  GYEONGBUK: Symbol('GYEONGBUK'),
  GYEONGNAM: Symbol('GYEONGNAM'),
  JEONBUK: Symbol('JEONBUK'),
  JEONNAM: Symbol('JEONNAM'),
  JEJU: Symbol('JEJU'),
};

const $DATA = {
  /* 교육기관 유형 */
  EDUTYPE: {
    [$EDUTYPE.KINDERGARTEN]: 1, // 병설유치원
    [$EDUTYPE.ELEMENTARY]: 2, // 초등학교
    [$EDUTYPE.MIDDLE]: 3, // 중학교
    [$EDUTYPE.HIGH]: 4, // 고등학교
  },
  /* 지역별 교육청 주소 */
  REGION: {
    [$REGION.SEOUL]: 'stu.sen.go.kr', // 서울
    [$REGION.INCHEON]: 'stu.ice.go.kr', // 인천
    [$REGION.BUSAN]: 'stu.pen.go.kr', // 부산
    [$REGION.GWANGJU]: 'stu.gen.go.kr', // 광주
    [$REGION.DAEJEON]: 'stu.dje.go.kr', // 대전
    [$REGION.DAEGU]: 'stu.dge.go.kr', // 대구
    [$REGION.SEJONG]: 'stu.sje.go.kr', // 세종
    [$REGION.ULSAN]: 'stu.use.go.kr', // 울산
    [$REGION.GYEONGGI]: 'stu.goe.go.kr', // 경기
    [$REGION.KANGWON]: 'stu.kwe.go.kr', // 강원
    [$REGION.CHUNGBUK]: 'stu.cbe.go.kr', // 충북
    [$REGION.CHUNGNAM]: 'stu.cne.go.kr', // 충남
    [$REGION.GYEONGBUK]: 'stu.gbe.kr', // 경북
    [$REGION.GYEONGNAM]: 'stu.gne.go.kr', // 경남
    [$REGION.JEONBUK]: 'stu.jbe.go.kr', // 전북
    [$REGION.JEONNAM]: 'stu.jne.go.kr', // 전남
    [$REGION.JEJU]: 'stu.jje.go.kr', // 제주
  },
  mainUrl: 'edusys.jsp?page=sts_m40000', // 메인 페이지
  searchUrl: 'spr_ccm_cm01_100.ws', // 검색
  mealUrl: 'sts_sci_md00_001.ws', // 급식 URL
  calendarMonthUrl: 'sts_sci_sf01_001.ws', // 학사 월간일정 URL
  calendarYearUrl: 'sts_sci_sf00_001.ws',
};

export default { type: $EDUTYPE, region: $REGION, data: $DATA };

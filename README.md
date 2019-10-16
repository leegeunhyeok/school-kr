# node-school-kr
> 전국 초, 등, 고등학교 및 병설유치원 급식, 학사일정 파싱 라이브러리

[![npm version](https://badge.fury.io/js/node-school-kr.svg)](https://badge.fury.io/js/node-school-kr)

본 라이브러리는 `Node.js` 환경에서 사용할 수 있는 Promise 기반의 `급식 API` + `학사일정 API` 통합 라이브러리 입니다.  
  
전국 교육청 학생 서비스 페이지(stu.xxx.go.kr)를 파싱하여 이번 달 **학사일정**과 **급식 정보**를 JSON 데이터로 제공합니다.

## 설치하기
[NPM](https://www.npmjs.com/package/node-school-kr) 저장소를 통해 다운로드 받을 수 있으며 별다른 작업 없이 바로 사용 가능합니다.
```bash
npm i node-school-kr
```

## 테스트
아래 명령어를 입력하여 미리 작성된 예제 코드를 실행해볼 수 있습니다.  
`sample/sample.js` 코드가 실행되며, 학교는 `광명경영회계고등학교` 기준으로 실행됩니다.
```bash
npm test
```

## 개발 문서

### School
모듈을 불러오면 School 클래스의 인스턴스를 생성할 수 있습니다.
```javascript
const School = require('node-school-kr')
new School()
```
- - -

### School.Type
[학교 종류](#학교-종류) 참조
- - -

### School.Region
[교육청 관할 지역](#교육청-관할-지역) 참조
- - -

### (Method) School.init
인스턴스 정보를 초기화 합니다.
> ※ 인스턴스 초기화는 인스턴스당 1회만 가능합니다.  
> 설정 정보를 변경하려면 `reset`을 사용해주세요

| Parameter | Type | Required |
|:--|:--:|:--:|
| type | Symbol | O |
| region | Symbol | O |
| schoolCode | string | O |

Return type: `void`

```javascript
const school = new School()
school.init(type, region, schoolCode)
```
예제는 [인스턴스 초기화](#인스턴스-초기화) 참조
- - -

### (Method) School.reset
인스턴스 정보를 재설정 합니다.
> ※ 인스턴스 초기화 이후에만 재설정 할 수 있습니다.

| Parameter | Type | Required |
|:--|:--:|:--:|
| type | Symbol | O |
| region | Symbol | O |
| schoolCode | string | O |

Return type: `void`

```javascript
...

school.reset(type, region, schoolCode)
```
예제는 [인스턴스 재설정](#인스턴스-재설정) 참조
- - -

### (Method) School.getTargetURL
지정한 Type의 데이터를 파싱하는 타겟 URL을 반환합니다.  
년도와 월을 지정하지 않을 경우 **이번 년도 / 달** 데이터를 파싱하는 타겟 URL을 반환합니다.

| Parameter | Type | Required |
|:--|:--:|:--:|
| type | string | O |
| year | number | X |
| month | number | X |

Return type: `string`

```javascript
school.getTargetURL(type, year, month)
```
예제는 [타겟 URL 조회](#타겟-URL-조회) 참조
- - -

### (Method) School.getMeal
이번 달 또는 지정한 년도/월의 급식 데이터를 반환합니다  
년도와 월을 지정하지 않을 경우 **이번 년도 / 달** 데이터를 반환합니다.  

| Parameter | Type | Required |
|:--|:--:|:--:|
| year | number | X |
| month | number | X |

Return type: [참고](#급식-데이터-형식)

```javascript
school.getMeal(year, month)
```
예제는 [급식 및 학사일정 조회](#급식-및-학사일정-조회) 참조
- - -

### (Method) School.getCalendar
이번 달 또는 지정한 년도/월의 학사일정 데이터를 반환합니다  
년도와 월을 지정하지 않을 경우 **이번 년도 / 달** 데이터를 반환합니다.

| Parameter | Type | Required |
|:--|:--:|:--:|
| year | number | X |
| month | number | X |

Return type: [참고](#학사일정-데이터-형식)

```javascript
school.getCalendar(year, month)
```
예제는 [급식 및 학사일정 조회](#급식-및-학사일정-조회) 참조
- - -


## 사용 방법

### School 인스턴스 생성
`node-school-kr` 모듈을 불러온 후 인스턴스를 생성합니다.  
생성 후 반드시 `init()`를 호출하여 데이터를 조회할 학교로 초기화합니다.

- init() 호출 없이 데이터를 불러올 경우 Error가 Throw 됩니다.

```javascript
const School = require('node-school-kr')
const school = new School()

/* 
* @param type: 학교 유형(초, 중, 고, 병설유치원) 
* @param region: 교육청 관할 지역
* @param schoolCode: 학교 고유 코드
*/
school.init(/* Type */, /* Region */, /* SchoolCode */)
```

#### 학교 종류

 학교 종류는 `School.Type` 에서 선택할 수 있습니다.
```javascript
const School = require('node-school-kr')

/* 4 */
console.log(School.Type.HIGH)
```

| 유형 | Key | Value |
|:---:|:---|:---:|
| 병설유치원 | `KINDERGARTEN` | 1 |
| 초등학교 | `ELEMENTARY` | 2 |
| 중학교 | `MIDDLE` | 3 |
| 고등학교 | `HIGH` | 4 |

#### 교육청 관할 지역

 지역은 생성한 `School.Region` 에서 선택할 수 있습니다. 
```javascript
const School = require('node-school-kr')

/* stu.sen.go.kr */
console.log(School.Region.SEOUL)
```
| 지역 | Key | Value |
|:---:|:---|:---|
| 서울 | `SEOUL` | stu.sen.go.kr |
| 인천 | `INCHEON` | stu.ice.go.kr |
| 부산 | `BUSAN` | stu.pen.go.kr |
| 광주 | `GWANGJU` | stu.gen.go.kr |
| 대전 | `DAEJEON` | stu.dge.go.kr |
| 대구 | `DEAGU` | stu.dge.go.kr |
| 세종 | `SEJONG` | stu.sje.go.kr |
| 울산 | `ULSAN` | stu.use.go.kr |
| 경기 | `GYEONGGI` | stu.goe.go.kr |
| 강원 | `KANGWON` | stu.kwe.go.kr |
| 충북 | `CHUNGBUK` | stu.cbe.go.kr |
| 충남 | `CHUNGNAM` | stu.cne.go.kr |
| 경북 | `GYEONGBUK` | stu.gbe.go.kr |
| 경남 | `GYEONGNAM` | stu.gne.go.kr |
| 전북 | `JEONBUK` | stu.jbe.go.kr |
| 전남 | `JEONNAM` | stu.jne.go.kr |
| 제주 | `JEJU` | stu.jje.go.kr |

## 학교 코드

학교 고유 코드는 [삭제됨](#)에서 학교명으로 검색할 수 있습니다.  
 학교 코드는 `X000000000` 형식의 10자리 문자열입니다.
(곧 학교 검색 스크립트가 라이브러리에 추가될 예정입니다.)

## 사용 예시
※ 아래 예제는 경기도의 `광명경영회계고등학교`를 기준으로 진행됩니다.

- Promise를 기반으로 하여 비동기 함수(Async/Await)에서 사용 가능
- 초기화(init) 작업 없이 데이터 불러올 경우 Error가 Throw 됩니다.
- 파싱 도중 오류가 발생할 경우 메시지 출력 및 비어있는 객체 반환 `{}`
- init() 는 생성된 인스턴스당 `1회만` 가능
- reset() 을 통해 다른 학교 정보로 `재설정` 가능

### 인스턴스 초기화
```javascript
const School = require('node-school-kr') 
const school = new School()

school.init(School.Type.HIGH, School.Region.GYEONGGI, 'J100000488')
```

### 인스턴스 재설정
```javascript
const School = require('node-school-kr')
const school = new School()

/* 경기도 광명시의 광명고등학교로 init() */
school.init(School.Type.HIGH, School.Region.GYEONGGI,  'J100000482')

/* 경기도 광명시의 광명경영회계고등학교로 재설정하는 코드 */
school.reset(School.Type.HIGH, School.Region.GYEONGGI, 'J100000488')
```

### 타겟 URL 조회
급식 / 학사일정 정보는 타겟 URL에 접속하여 데이터를 파싱합니다.
```javascript
const School = require('node-school-kr') 
const school = new School()

school.init(School.Type.HIGH, School.Region.GYEONGGI, 'J100000488')

// 급식, 학사일정 데이터 파싱 타겟 페이지 URL
console.log(school.getTargetURL('meal', 2018, 5))  // 년도와 월 지정 가능
console.log(school.getTargetURL('calendar')) // 지정하지 않을 경우 이번 달로 설정 됨

/*
https://stu.goe.go.kr/sts_sci_md00_001.do?schulCode=J100000488&schulCrseScCode=4&schulKndScCode=4&ay=2018&mm=05&
https://stu.goe.go.kr/sts_sci_sf01_001.do?schulCode=J100000488&schulCrseScCode=4&schulKndScCode=4&ay=&mm=&
*/
```

### 급식 및 학사일정 조회

#### 사용 예시
```javascript
const School = require('node-school-kr') 
const school = new School()

school.init(School.Type.HIGH, School.Region.GYEONGGI, 'J100000488')

const sampleAsync = async function() {
  const meal = await school.getMeal()
  const calendar = await school.getCalendar()

  // 오늘 날짜
  console.log(`${meal.month}월 ${meal.day}일`)

  // 오늘 급식 정보
  console.log(meal.today)

  // 이번 달 급식 정보
  console.log(meal)

  // 이번 달 학사일정
  console.log(calendar)

  // 년도와 달을 지정하여 해당 날짜의 데이터를 조회할 수 있습니다.
  const mealCustom = await school.getMeal(2018, 9)
  const calendarCustom = await school.getCalendar(2017, 4)

  console.log(mealCustom)
  console.log(calendarCustom)

  // 년도값 대신 옵션 객체를 전달하여 데이터 수집 가능
  const optionMeal = await school.getMeal({
    year: 2018,
    month: 9,
    default: '급식이 없습니다'
  })
  const optionCalendar = await school.getCalendar({
    // year, month 생략시 현재 시점 기준으로 조회됨
    default: '일정 없는 날'
  })

  console.log(optionMeal)
  console.log(optionCalendar)
}

sampleAsync()
```


samplePromise()
```

### 급식 데이터 형식
`getMeal` 반환 데이터 형식은 아래와 같습니다.

| Key | Value | 비고 |
|:--|:--:|:--|
| 1 ~ 31 | 해당 날짜의 급식 | 급식이 없는 경우 option.default 값 혹은  빈 문자열 |
| month | 이번 달 | |
| day | 오늘 날짜 | 사용자 지정 년도/월이 이번 달이 아닌 경우 0 |
| today | 오늘 급식 | 급식이 없는 경우 빈 문자열 |
```javascript
{
  '1': '[중식]\n발아현미밥\n미역국5.6.9....', // 이번달 1일 메뉴
  '2': '[중식]\n얼갈이된장무침5.6.\n칼슘찹쌀....', // 이번달 2일 메뉴 
  '3': '[중식]\n투움바파스타(주식)1.2.5.6.9.13.15.\n....', // 이번달 3일 메뉴
  '4': '', // 급식이 없을 경우 option.default 값 혹은 빈 문자열
  '5': '',
  ...
  'year': 2018, // 이번 년도
  'month': 5,   // 이번 달
  'day': 3,     // 오늘 날짜 
  'today': '[중식]\n투움바파스타(주식)1.2.5.6.9.13.15.\n....' // 오늘 메뉴
}
```

### 학사일정 데이터 형식
`getCalendar` 반환 데이터 형식은 아래와 같습니다.

| Key | Value | 비고 |
|:--|:--:|:--|
| 1 ~ 31 | 해당 날짜의 일정 | 일정이 없는 경우 option.default 값 혹은 빈 문자열 |
| year | 이번 년도 | |
| month | 이번 달 | |
```javascript
{
  '1': '', // 이번 달 1일의 일정
  '2': '', // 일정이 없을 경우 option.default 값 혹은 빈 문자열
  '3': '',
  '4': '개교기념일', // 4일 일정
  '5': '',
  '6': '',
  '7': '대체공휴일',
  ...
  'year': 2018,
  'month': 5 // 이번 달
}
```

## 문제 신고
교육청 홈페이지의 리뉴얼 등의 문제로 파싱이 불가능 할 수 있습니다. [이슈](https://github.com/leegeunhyeok/node-school-kr/issues)를 남겨주시면 최대한 빠르게 수정하여 반영하도록 하겠습니다.

## 변경사항
- `2.2.0`
  - [Issue #3](https://github.com/leegeunhyeok/node-school-kr/issues/3) 기본값 옵션 추가
  - `getMeal`, `getCalendar` 옵션 호출방식 추가
- `2.1.2`
  - [Issue #1](https://github.com/leegeunhyeok/node-school-kr/issues/1) 경북 교육청 접속문제 수정
  - 의존 라이브러리의 보안 취약성 업데이트
- `2.1.1`
  - 의존 라이브러리의 보안 취약성 업데이트
- `2.1.0`
  - 급식 / 학사일정 데이터를 불러올 때 년도와 월을 지정할 수 있도록 기능 추가
  - 급식 / 학사일정 데이터에 년도 추가
  - README에 개발 문서 추가 작성
- `2.0.1`
  - 의존 라이브러리의 보안 취약성 업데이트
- `2.0.0`
  - ※ 기존 버전과 `호환되지 않습니다.` (아래 변경사항을 확인 해주세요)
  - Type, Region 프로퍼티 값을 Symbol 기반으로 구현
    - Type, Region 접근 방식이 조금 변경 됨, [참고1](#학교-종류), [참고2](#교육청-관할-지역)
  - 에러 발생 상황 추가 및 기존 에러 메시지 수정
  - getNotice 메소드명 변경 -> `getCalendar`
  - getTargetURL 메소드 추가 (파싱할 타겟 URL을 반환합니다, [참고](#타겟-URL-조회))
  - 예제 및 README 내용 수정사항에 맞게 업데이트 / 내용 추가
  - 코드 주석 업데이트
- `1.0.1`
  - NPM 저장소와 이름 동일하게 Git 저장소 이름 변경 (이미 사용중인 이름)
    - node-school -> node-school-kr
  - README 문서 내용 수정
  - 에러 메시지 구분 문자 추가 (급식 파싱 에러인지 학사일정 파싱 에러인지 구분)
- `1.0.0` - 첫 번째 릴리즈!

## 라이센스
[MIT](https://github.com/agemor/school-api/blob/master/LICENSE)


## 정보
본 프로젝트는 [School API](https://github.com/agemor/school-api)를 참고하여 Node.js 환경에서 사용할 수 있도록 새로 포팅한 프로젝트입니다.

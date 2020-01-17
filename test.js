const School = require('./dist/entry')
const school = new School()
school.search(School.Region.GYEONGGI, '광명경영회계고')
  .then(result => {
    const code = result[0].schoolCode
    school.init(School.Type.HIGH, School.Region.GYEONGGI, code)
    school.getMeal().then(console.log)
  })
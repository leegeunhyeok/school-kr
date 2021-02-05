const School = require('../dist/entry');
const school = new School();
school.init(School.Type.HIGH, School.Region.GYEONGGI, 'J100000488');

async function meal(iter) {
  const sTime = new Date();
  for (let i = 0; i < iter; i++) {
    console.time('meal_v2_' + i);
    await school.getMeal();
    console.timeEnd('meal_v2_' + i);
  }
  console.log(`Meal avg: ${(new Date() - sTime) / iter}`);
}

async function calendar(iter) {
  const sTime = new Date();
  for (let i = 0; i < iter; i++) {
    console.time('calendar_v2_' + i);
    await school.getCalendar();
    console.timeEnd('calendar_v2_' + i);
  }
  console.log(`Calendar avg: ${(new Date() - sTime) / iter}ms`);
}

async function test(iter) {
  await meal(iter);
  console.log('=========================');
  await calendar(iter);
}

test(20);

/**
 * util
 */

/**
 * 대상 숫자의 길이가 length가 되도록 앞 자리에 0을 채워 반환
 * @param {number} number 자릿수를 맞출 대상 수
 * @param {number} length 0을 채워 length 길이로 만들기
 */
const paddingNumber = (number, length) => {
  if (typeof length === 'undefined') {
    return number.toString();
  }

  const targetNumber = number.toString();
  let p = '';
  for (let i = 0; i < length - targetNumber.length; i++) {
    p += '0';
  }

  return p + targetNumber;
};

export default { paddingNumber };

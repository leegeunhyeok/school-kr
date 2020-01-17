const paddingNumber = (number, length) => {
  if (length === undefined) {
    return number.toString();
  }

  const targetNumber = number.toString();
  let p = '';
  for (let i = 0; i < targetNumber.length - length; i++) {
    p += '0';
  }

  return p + targetNumber;
};

export default { paddingNumber };

export const cleanNumber = (num: number): number => {
  let strNum = num.toString().split('.');
  return Number(strNum[0]);
};

export const calculateDifference = (
  currentValue: number,
  oldValue: number
): { percentage: number; usd: number } => {
  const usd = currentValue - oldValue;
  const percentage = (usd / currentValue) * 100;
  return { percentage, usd };
};

export const Size = (size: number, funds: number): string => {
  return `${size * funds}`.slice(0, 9);
};

export const truncateDecimals = function (number: number, digits: number) {
  var multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

  return truncatedNum / multiplier;
};

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

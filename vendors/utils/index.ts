export const calculatePercentageIncrease = (
  finalValue: number,
  initialValue: number
): { percentage: number; usd: number } => {
  const usd = finalValue - initialValue;
  const percentage = (usd / initialValue) * 100;
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

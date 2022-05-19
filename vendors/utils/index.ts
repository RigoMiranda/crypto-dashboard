export const storeObject = (
  data: Object | string,
  path: string,
  append: boolean = false
) => {
  try {
    // const fs = require("fs");
    // if (append) {
    //   fs.appendFile(path, data, function (err) {
    //     if (err) throw err;
    //   });
    // } else {
    //   fs.writeFileSync(path, JSON.stringify(data, null, 4));
    // }
  } catch (err) {
    console.error(err);
  }
};

export const cleanNumber = (num: number): number => {
  let strNum = num.toString().split(".");
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

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

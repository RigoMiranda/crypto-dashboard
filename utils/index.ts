export const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const getHourDiff = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  //@ts-ignore
  const diff = new Date(now - date);
  return diff.getUTCHours();
};

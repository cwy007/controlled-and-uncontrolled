/** 本月总共有多少天 */
export const daysOfMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

/** 本月的第一天是星期几 */
export const firstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month + 1).getDay();
};

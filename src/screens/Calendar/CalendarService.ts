import moment from "moment";

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

export const getMonth = (selMonth: number, selYear: number) => {
  const year = selYear;
  const month = String(selMonth).length === 2 ? String(selMonth) : `0${selMonth}`;

  const startOfWeek = moment(`01.${month}.${year}`, 'DD.MM.YYYY').startOf('month').startOf('week').subtract(1, 'day');
  const calendarDays = [...Array(42)].map(() => {
    const day = startOfWeek.add(1, 'day').clone();
    const dayFormat = day.format('DD.MM.YYYY');
    const dayMonth = day.month() + 1;
    const isWeekend = day.day() === 6 || day.day() === 0 ? true : false;

    const isNextMonth = (dayMonth > Number(month) && day.year() >= year) ||
      (day.year() > year) ? true : false;

    const isPrevMonth = (isNextMonth === false && dayMonth !== Number(month)) ? true : false;

    const isToday = moment().format('DD.MM.YYYY') === dayFormat ? true : false;
    return {
      date: {
        full: day.format('x'),
        formate: dayFormat,
      },
      day: dayFormat.slice(0, 2),
      month: dayFormat.slice(3, 5),
      year: dayFormat.slice(6),
      isWeekend,
      isPrevMonth,
      isNextMonth,
      isToday,
    }
  });

  return calendarDays;
};

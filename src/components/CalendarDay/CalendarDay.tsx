import { FC } from "react";
import { IDayItem, ISelectedDate } from "../../interfaces";

import styles from './CalendarDay.module.scss';

interface ICalendarDay {
  day: IDayItem,
  selectDay(date: ISelectedDate): void,
  prevMonth(): void,
  nextMonth(): void,
};

const CalendarDay: FC<ICalendarDay> = ({
  day,
  selectDay,
  prevMonth,
  nextMonth,
}) => {
  const date = {
    full: day.date.full,
    formate: day.date.formate,
  }
  return (
    <div
      onClick={() => {
        if (day.isPrevMonth) {
          prevMonth();
          return;
        } else if (day.isNextMonth) {
          nextMonth();
          return;
        } else {
          selectDay(date);
          return;
        }
      }}
      className={
        day.isPrevMonth || day.isNextMonth ?
          `${styles.calendarDay} ${styles.disabled}` :
          styles.calendarDay
      }>
      <span className={`${styles.day} ${day.isToday ? styles.isToday : ''}`}>
        {day.day}
      </span>
      {day.isToday && <span className={styles.marker}></span>}
    </div>
  );
};

export default CalendarDay;

import { FC, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import MonthSwitch from '../../components/MonthSwitch/MonthSwitch';
import WeekDays from '../../components/WeekDays/WeekDays';
import { setLoading, setMonth, setNextMonth, setPrevMonth, setSelectedDate, setSelectedMonth, setYear } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import MenuBtn from '../../components/MenuBtn/MenuBtn';
import Logo from '../../components/Logo/Logo';
import Menu from '../../components/Menu/Menu';
import { IDayItem, ISelectedDate } from '../../interfaces';
import { getMonth } from './CalendarService';
import CalendarDay from '../../components/CalendarDay/CalendarDay';

import styles from './Calendar.module.scss';
import axios from 'axios';
import DefaultBtn from '../../components/DefaultBtn/DefaultBtn';
import useAuth from '../../firebase/controllers/userController';

interface ICalendar { };

const Calendar: FC<ICalendar> = () => {
  const { userSignOut } = useAuth();
  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(state => state.AppStore);
  const [menuIsActive, setMenuIsActive] = useState(false);

  useEffect(() => {
    (async () => {
      reduxDispatch(setLoading(true));
      const dateInfo = await getMonth(appState.month, appState.year);
      reduxDispatch(setMonth(dateInfo.month));
      reduxDispatch(setYear(dateInfo.year));
      reduxDispatch(setSelectedMonth(dateInfo.calendarDays));
      reduxDispatch(setLoading(false));
    })()
  }, []);

  useEffect(() => {
    (async () => {
      reduxDispatch(setLoading(true));
      const dateInfo = await getMonth(appState.month, appState.year);
      reduxDispatch(setMonth(dateInfo.month));
      reduxDispatch(setYear(dateInfo.year));
      reduxDispatch(setSelectedMonth(dateInfo.calendarDays));
      reduxDispatch(setLoading(false));
    })()
  }, [appState.month]);

  const setDate = (date: ISelectedDate) => reduxDispatch(setSelectedDate(date));

  const signOut = async () => {
    reduxDispatch(setLoading(true));
    await userSignOut();
    reduxDispatch(setLoading(false));
  }

  return (
    <div className={styles.Calendar}>

      <Menu isActive={menuIsActive}>
        <DefaultBtn
          type='button'
          value='выход'
          handleClick={() => signOut()} />
      </Menu>

      <Header>
        <MenuBtn
          isActive={menuIsActive}
          handleClick={() => setMenuIsActive(!menuIsActive)} />
        <Logo />
      </Header>

      <MonthSwitch
        prevMonth={() => { reduxDispatch(setPrevMonth()) }}
        nextMonth={() => { reduxDispatch(setNextMonth()) }}
        month={appState.month}
        year={appState.year} />
      <WeekDays />

      <div className={styles.calendarGrid}>
        {appState.selectedMonth.map(day =>
          <CalendarDay
            key={day.date.full}
            day={day}
            selectDay={() => setDate(day.date)}
            prevMonth={() => reduxDispatch(setPrevMonth())}
            nextMonth={() => reduxDispatch(setNextMonth())} />
        )}
      </div>
    </div >
  );
}

export default Calendar;

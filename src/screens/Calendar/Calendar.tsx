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
import DefaultBtn from '../../components/DefaultBtn/DefaultBtn';
import useAuth from '../../firebase/controllers/userController';
import { useToast } from '@chakra-ui/react';

import styles from './Calendar.module.scss';

const Calendar: FC = () => {
  const { userSignOut } = useAuth();
  const toast = useToast();

  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(state => state.AppStore);

  const [prevMonthState, setPrevMonthState] = useState(0);
  const [menuIsActive, setMenuIsActive] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        reduxDispatch(setLoading(true));
        const dateInfo = await getMonth(appState.month, appState.year);
        setPrevMonthState(dateInfo.month);
        reduxDispatch(setMonth(dateInfo.month));
        reduxDispatch(setYear(dateInfo.year));
        reduxDispatch(setSelectedMonth(dateInfo.calendarDays));
        if (appState.currentUserInfo.name) {
          toast({
            title: `Здравствуйте, ${appState.currentUserInfo.name}`,
            status: 'success',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
        } else {
          toast({
            title: 'Поалуйста заполните данные профиля',
            status: 'info',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
        }
      } catch (e) {
        console.log(e);
        toast({
          title: 'Произошла ошибка, попробуйте перезагрузить страницу',
          status: 'error',
          isClosable: true,
          duration: 8000,
          position: 'top',
        });
      } finally {
        reduxDispatch(setLoading(false));
      }
    })()
  }, []);

  useEffect(() => {
    if (appState.month !== prevMonthState) {
      (async () => {
        try {
          reduxDispatch(setLoading(true));
          const dateInfo = await getMonth(appState.month, appState.year);
          reduxDispatch(setSelectedMonth(dateInfo.calendarDays));
          setPrevMonthState(dateInfo.month);
        } catch (e) {
          console.log(e);
          toast({
            title: 'Произошла ошибка, попробуйте перезагрузить страницу',
            status: 'error',
            isClosable: true,
            duration: 8000,
            position: 'top',
          });
        } finally {
          reduxDispatch(setLoading(false));
        }
      })()
    }
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

      {
        appState.selectedMonth.length > 0 ?
          <>
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
          </>
          :
          <h1>Попробуйте позже</h1>
      }

    </div >
  );
}

export default Calendar;

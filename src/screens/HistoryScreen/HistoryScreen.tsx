import { FC, useEffect, useState } from 'react';
import BackBtn from '../../components/BackBtn/BackBtn';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Logo from '../../components/Logo/Logo';
import ScreenTitle from '../../components/ScreenTitle/ScreenTitle';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  IconButton,
  Input,
} from '@chakra-ui/react';

import styles from './HistoryScreen.module.scss';
import { SearchIcon } from '@chakra-ui/icons';
import moment from 'moment';
import useTime from '../../firebase/controllers/timeController';
import { IHistoryInfo } from '../../interfaces';
import { setLoading } from '../../store';

const HistoryScreen: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const {
    getAllHistory,
  } = useTime();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [history, setHistory] = useState<IHistoryInfo[]>([]);

  useEffect(() => {
    const date = moment();
    const start = date.startOf('month').format('YYYY-MM-DD');
    const startMS = date.startOf('month').valueOf();
    const end = date.endOf("month").format('YYYY-MM-DD');
    const endMS = date.endOf("month").valueOf();
    setStartDate(start);
    setEndDate(end);
    (async () => {
      await getHistory(startMS, endMS);
    })()
  }, []);

  async function getHistory(start: number, end: number) {
    try {
      reduxDispatch(setLoading(true));
      const historyList = await getAllHistory(start, end);
      console.log(historyList);
    } catch (e) {
      console.log(e)
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  return (
    <div className={styles.reserved}>
      <Header>
        <BackBtn />
        <Logo />
      </Header>

      <ScreenTitle
        title='история работы' />

      <Container>
        <div className={styles.range}>
          <span className={styles.rangeTitle}>Промежуток времени</span>
          <div className={styles.rangeDateWrapper}>
            <div className={styles.rangeDateItem}>
              <span className={styles.rangeDateText}>с</span>
              <Input
                color={'#fff'}
                placeholder="Select Date"
                size="md"
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.rangeDateItem}>
              <span className={styles.rangeDateText}>по</span>
              <Input
                color={'#fff'}
                placeholder="Select Date"
                size="md"
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className={styles.rangeDateItem}>
              <IconButton
              onClick={async() => {
                await getHistory(moment(startDate).valueOf(), moment(endDate).valueOf());
              }}
                variant='outline'
                colorScheme='whiteAlpha'
                aria-label='btn'
                size={'md'}
                color="#fff"
                icon={<SearchIcon />}
              />
            </div>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default HistoryScreen;

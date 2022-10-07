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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import styles from './HistoryScreen.module.scss';
import { PhoneIcon, SearchIcon } from '@chakra-ui/icons';
import moment from 'moment';
import useTime from '../../firebase/controllers/timeController';
import { IHistoryInfo, ITimeItem } from '../../interfaces';
import { setLoading, setSelectedUserUID } from '../../store';
import InfoContainer from '../../components/InfoContainer/InfoContainer';
import { sortByTime } from '../../firebase/services/dayService';
import { NavLink } from 'react-router-dom';
import ModalConteiner from '../../components/ModalContainer/ModalContainer';
import DefaultBtn from '../../components/DefaultBtn/DefaultBtn';
import { Time } from '../../firebase/services/timeService';

const HistoryScreen: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const {
    getAllHistory,
  } = useTime();

  const [userInfoModal, setUserInfoModal] = useState(false);
  const [timeItem, setTimeItem] = useState<ITimeItem>({
    ...new Time({
      time: '',
      date: {
        full: 0,
        formate: '',
      }
    })
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDateMS, setStartDateMS] = useState(0);
  const [endDateMS, setEndDateMS] = useState(0);
  const [historyList, setHistoryList] = useState<IHistoryInfo[]>([]);
  const [timeSpent, setTimeSpent] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    (async () => {
      const date = moment();
      const start = date.startOf('month').format('YYYY-MM-DD');
      const startMS = date.startOf('month').valueOf();
      const end = date.endOf("month").format('YYYY-MM-DD');
      const endMS = date.endOf("month").valueOf();
      setStartDate(start);
      setEndDate(end);
      setStartDateMS(startMS);
      setEndDateMS(endMS);
      await getHistory(startMS, endMS);
    })()
  }, []);

  const sortHistory = (a: IHistoryInfo, b: IHistoryInfo) => {
    if (a.date.full > b.date.full) {
      return 1;
    } else if (a.date.full < b.date.full) {
      return -1;
    } else {
      const byTime = sortByTime(a.time, b.time);
      return byTime;
    }
  }

  async function getHistory(start?: number, end?: number) {
    try {
      reduxDispatch(setLoading(true));
      const historyList = await getAllHistory(start || startDateMS, end || endDateMS);
      if (historyList) {
        const sortedHistrory = historyList.sort((a, b) => sortHistory(a, b));
        setHistoryList(historyList);
      }
    } catch (e) {
      console.log(e)
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  const setStartDateInput = (value: string) => {
    setStartDate(value);
    setStartDateMS(moment(value).valueOf());
  };
  const setEndDateInput = (value: string) => {
    setEndDate(value);
    setEndDateMS(moment(value).valueOf());
  };
  const formateTime = (time: number) => {
    const hour = Math.trunc(time / 60);
    const min = time % 60;
    if (hour < 1) {
      return `${min}мин.`;
    } else if (min < 1) {
      return `${hour}ч.`;
    } else {
      return `${hour}ч. ${min}м.`;
    }
  }

  const getTotalTimeSpent = () => {
    const totalTime: number = historyList.reduce((prev, curr) => prev + curr.info.time, 0);
    setTimeSpent(formateTime(totalTime));
  };

  const getTotalIncome = () => {
    const totalIncome: number = historyList.reduce((prev, curr) => prev + curr.info.cost, 0);
    setTotalIncome(totalIncome);
  };

  const openUserInfo = (item: IHistoryInfo) => {
    setTimeItem(item.time);
    setUserInfoModal(true);
  }


  useEffect(() => {
    getTotalTimeSpent();
    getTotalIncome();
  }, [historyList]);

  return (
    <div className={styles.reserved}>
      <Header>
        <BackBtn />
        <Logo />
      </Header>

      <ScreenTitle
        title='история работы' />

      <Container>
        <Accordion
          className={styles.accordion}
          defaultIndex={[0]}
          allowMultiple >

          <AccordionItem
            className={styles.accordionItem}>
            <AccordionButton
              display={'block'}>
              <div className={styles.accordionHeader}>
                <span className={styles.accordionTitle}>Промежуток времени</span>
                <AccordionIcon color={'#fff'} />
              </div>
            </AccordionButton>
            <AccordionPanel>
              <div className={styles.accordionDateWrapper}>
                <div className={styles.accordionDateBox}>
                  <div className={styles.accordionDateItem}>
                    <span className={styles.accordionDateText}>с</span>
                    <Input
                      color={'#fff'}
                      width={'120px'}
                      p={'5px'}
                      placeholder="Select Date"
                      size="md"
                      type='date'
                      value={startDate}
                      onChange={(e) => setStartDateInput(e.target.value)}
                    />
                  </div>
                  <div className={styles.accordionDateItem}>
                    <span className={styles.accordionDateText}>по</span>
                    <Input
                      color={'#fff'}
                      width={'120px'}
                      p={'5px'}
                      placeholder="Select Date"
                      size="md"
                      type='date'
                      value={endDate}
                      onChange={(e) => setEndDateInput(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.accordionDateBtn}>
                  <IconButton
                    onClick={async () => {
                      await getHistory();
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
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem className={styles.accordionItem}>
            <AccordionButton
              display={'block'}>
              <div className={styles.accordionHeader}>
                <span className={styles.accordionTitle}>общая информация</span>
                <AccordionIcon color={'#fff'} />
              </div>
            </AccordionButton>
            <AccordionPanel>
              <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                  <InfoContainer>
                    <span className={styles.infoItemTitle}>
                      обслужено человек
                    </span>
                    <span className={styles.infoItemValue}>
                      {historyList.length} чел.
                    </span>
                  </InfoContainer>
                </li>
                <li className={styles.infoItem}>
                  <InfoContainer>
                    <span className={styles.infoItemTitle}>
                      общее время работы
                    </span>
                    <span className={styles.infoItemValue}>
                      {timeSpent}
                    </span>
                  </InfoContainer>
                </li>
                <li className={styles.infoItem}>
                  <InfoContainer>
                    <span className={styles.infoItemTitle}>
                      Общая прибыль
                    </span>
                    <span className={styles.infoItemValue}>
                      {totalIncome} руб.
                    </span>
                  </InfoContainer>
                </li>
              </ul>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <h6 className={styles.historyTitle}>История:</h6>
        <Accordion
          className={styles.accordion}
          allowToggle >
          <ul className={styles.historyList}>
            {
              historyList.map(item => (
                <li
                  key={item.time.id}
                  className={styles.historyItem}>
                  <AccordionItem className={styles.accordionItem}>
                    <AccordionButton
                      display={'block'}>
                      <div className={styles.accordionHeader}>
                        <span className={styles.accordionTitle}>{`${item.date.formate} ${item.time.time}`}</span>
                        <AccordionIcon color={'#fff'} />
                      </div>
                    </AccordionButton>
                    <AccordionPanel>
                      <ul className={styles.infoList}>
                        <li className={styles.infoItem}>
                          <InfoContainer>
                            <span className={styles.infoItemTitle}>
                              клиент
                            </span>
                            {
                              item.time.isOffline.status ?
                                <IconButton
                                  onClick={() => openUserInfo(item)}
                                  aria-label='btn'
                                  color={'#fff'}
                                  colorScheme={'whiteAlpha'}
                                  variant={'outline'}
                                  size={'xs'}
                                  icon={
                                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect x="3" width="6" height="6" rx="3" fill="white" />
                                      <path d="M0 10.5V10.5C0.939219 8.67374 2.71599 7.4257 4.75256 7.1617L4.82655 7.15211C5.60557 7.05113 6.39436 7.05113 7.17338 7.15211L7.24745 7.16171C9.28402 7.42571 11.0608 8.67374 12 10.5V10.5V10.5C10.7728 12.6476 8.47348 14 5.99996 14V14V14C3.80354 14 1.74233 12.9393 0.465688 11.152L0 10.5Z" fill="white" />
                                    </svg>
                                  }
                                />
                                :
                                <NavLink
                                  onClick={() => reduxDispatch(setSelectedUserUID(item.time.client.uid))}
                                  to={'/user'}>
                                  <IconButton
                                    aria-label='btn'
                                    color={'#fff'}
                                    colorScheme={'whiteAlpha'}
                                    variant={'outline'}
                                    size={'xs'}
                                    icon={
                                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" width="6" height="6" rx="3" fill="white" />
                                        <path d="M0 10.5V10.5C0.939219 8.67374 2.71599 7.4257 4.75256 7.1617L4.82655 7.15211C5.60557 7.05113 6.39436 7.05113 7.17338 7.15211L7.24745 7.16171C9.28402 7.42571 11.0608 8.67374 12 10.5V10.5V10.5C10.7728 12.6476 8.47348 14 5.99996 14V14V14C3.80354 14 1.74233 12.9393 0.465688 11.152L0 10.5Z" fill="white" />
                                      </svg>
                                    } />
                                </NavLink>
                            }
                          </InfoContainer>
                        </li>
                        <li className={styles.infoItem}>
                          <InfoContainer>
                            <span className={styles.infoItemTitle}>
                              время работы
                            </span>
                            <span className={styles.infoItemValue}>
                              {formateTime(item.info.time)}
                            </span>
                          </InfoContainer>
                        </li>
                        <li className={styles.infoItem}>
                          <InfoContainer>
                            <span className={styles.infoItemTitle}>
                              стоимость работы
                            </span>
                            <span className={styles.infoItemValue}>
                              {item.info.cost} руб.
                            </span>
                          </InfoContainer>
                        </li>

                        <li className={styles.infoItem}>
                          <InfoContainer>
                            <span className={styles.infoItemTitle}>
                              комментарий
                            </span>
                            <span className={styles.infoItemValue}>
                              {item.info.comment}
                            </span>
                          </InfoContainer>
                        </li>
                      </ul>
                    </AccordionPanel>
                  </AccordionItem>
                </li>
              ))
            }
          </ul>
        </Accordion>



      </Container>

      <ModalConteiner
        isOpen={userInfoModal}
        onClose={() => setUserInfoModal(false)}>

        <div className={styles.modal}>
          <ul className={styles.userInfoList}>
            <li className={styles.userInfoItem}>
              <span className={styles.userInfoTitle}>имя</span>
              <span>{timeItem.isOffline.name}</span>
            </li>
            {
              timeItem.isOffline.instagram &&
              <li className={styles.userInfoItem}>
                <span className={styles.userInfoTitle}>instagram</span>
                <a target={'_blank'} href={timeItem.isOffline.instagram}>
                  <IconButton
                    variant='link'
                    colorScheme='blackAlpha'
                    aria-label='btn'
                    size={'xs'}
                    color="#000"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.8 0H14.2C17.4 0 20 2.6 20 5.8V14.2C20 15.7383 19.3889 17.2135 18.3012 18.3012C17.2135 19.3889 15.7383 20 14.2 20H5.8C2.6 20 0 17.4 0 14.2V5.8C0 4.26174 0.61107 2.78649 1.69878 1.69878C2.78649 0.61107 4.26174 0 5.8 0ZM5.6 2C4.64522 2 3.72955 2.37928 3.05442 3.05442C2.37928 3.72955 2 4.64522 2 5.6V14.4C2 16.39 3.61 18 5.6 18H14.4C15.3548 18 16.2705 17.6207 16.9456 16.9456C17.6207 16.2705 18 15.3548 18 14.4V5.6C18 3.61 16.39 2 14.4 2H5.6ZM15.25 3.5C15.5815 3.5 15.8995 3.6317 16.1339 3.86612C16.3683 4.10054 16.5 4.41848 16.5 4.75C16.5 5.08152 16.3683 5.39946 16.1339 5.63388C15.8995 5.8683 15.5815 6 15.25 6C14.9185 6 14.6005 5.8683 14.3661 5.63388C14.1317 5.39946 14 5.08152 14 4.75C14 4.41848 14.1317 4.10054 14.3661 3.86612C14.6005 3.6317 14.9185 3.5 15.25 3.5ZM10 5C11.3261 5 12.5979 5.52678 13.5355 6.46447C14.4732 7.40215 15 8.67392 15 10C15 11.3261 14.4732 12.5979 13.5355 13.5355C12.5979 14.4732 11.3261 15 10 15C8.67392 15 7.40215 14.4732 6.46447 13.5355C5.52678 12.5979 5 11.3261 5 10C5 8.67392 5.52678 7.40215 6.46447 6.46447C7.40215 5.52678 8.67392 5 10 5ZM10 7C9.20435 7 8.44129 7.31607 7.87868 7.87868C7.31607 8.44129 7 9.20435 7 10C7 10.7956 7.31607 11.5587 7.87868 12.1213C8.44129 12.6839 9.20435 13 10 13C10.7956 13 11.5587 12.6839 12.1213 12.1213C12.6839 11.5587 13 10.7956 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7956 7 10 7Z" fill="#000" />
                      </svg>
                    }
                  />
                </a>
              </li>
            }
            {
              timeItem.isOffline.phoneNumber &&
              <li className={styles.userInfoItem}>
                <span className={styles.userInfoTitle}>телефон</span>
                <a href={`tel: ${timeItem.isOffline.phoneNumber}`}>
                  <IconButton
                    variant='link'
                    colorScheme='blackAlpha'
                    aria-label='btn'
                    size={'xs'}
                    color="#000"
                    icon={<PhoneIcon />}
                  />
                </a>
              </li>
            }
            <li className={styles.userInfoComment}>
              <span className={styles.userInfoTitle}>комментарий</span>
              <div>{timeItem.isOffline.comment}</div>
            </li>
          </ul>
          <div className={styles.btnWrapper}>
            <DefaultBtn
              type='button'
              value='закрыть'
              dark={true}
              handleClick={() => setUserInfoModal(false)} />
          </div>
        </div>
      </ModalConteiner>
    </div>
  );
};

export default HistoryScreen;

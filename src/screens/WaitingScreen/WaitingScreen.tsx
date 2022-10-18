import { FC, useState, useEffect } from 'react';
import BackBtn from '../../components/BackBtn/BackBtn';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import InfoContainer from '../../components/InfoContainer/InfoContainer';
import Logo from '../../components/Logo/Logo';
import ScreenTitle from '../../components/ScreenTitle/ScreenTitle';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  IconButton,
  useToast,
} from '@chakra-ui/react';
import DefaultBtn from '../../components/DefaultBtn/DefaultBtn';
import ModalConteiner from '../../components/ModalContainer/ModalContainer';
import { CheckIcon, CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { setLoading, setSelectedDate, setSelectedUserUID } from '../../store';
import { IReserveItem, ITimeItem } from '../../interfaces';
import useTime from '../../firebase/controllers/timeController';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import styles from './WaitingScreen.module.scss';
import { NavLink } from 'react-router-dom';
import { Time } from '../../firebase/services/timeService';
import useAuth from '../../firebase/controllers/userController';
import { History } from '../../firebase/services/userService';

const WaitingScreen: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const toast = useToast();
  const {
    getAllWaiting,
    removeTimeFromDay,
    removeTimeFromWaiting,
    confirmTime,
  } = useTime();

  const {
    setUserHistory,
    setUserReserve,
    removeUserReserve,
  } = useAuth();

  const [reservedList, setReservedList] = useState<IReserveItem[]>([]);
  const [timeItem, setTimeItem] = useState<ITimeItem>({
    id: '',
    isReserved: false,
    time: '',
    date: {
      full: 0,
      formate: '',
    },
    client: {
      uid: '',
      confirmed: false,
    },
    isOffline: {
      status: false,
      name: '',
      instagram: '',
      phoneNumber: '',
      comment: '',
    }
  });

  const [cancelModal, setCancelModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    (async () => {
      await getWaiting();
    })();
  }, []);

  async function getWaiting() {
    try {
      reduxDispatch(setLoading(true));
      const data = await getAllWaiting();
      if (data) {
        const filteredData = data.filter(item => Object.keys(item.timeList).length > 0)
          .sort((a, b) => Number(a.date.full) - Number(b.date.full))
        setReservedList(filteredData)
      }
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  const openCancelModal = (item: ITimeItem) => {
    setTimeItem(item);
    setCancelModal(true);
  };

  const cancelReserve = async () => {
    try {
      reduxDispatch(setLoading(true));
      setCancelModal(false);
      await removeTimeFromDay(timeItem);
      await removeTimeFromWaiting(timeItem);
      await removeUserReserve(timeItem);

      await getWaiting();
      toast({
        title: `Запись на ${timeItem.date.formate} ${timeItem.time} отклонена`,
        status: 'success',
        isClosable: true,
        duration: 5000,
        position: 'top',
      });
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  };

  const openConfirmModal = (item: ITimeItem) => {
    setTimeItem(item);
    setConfirmModal(true);
  };

  const saveConfirmTime = async () => {
    try {
      setConfirmModal(false);
      reduxDispatch(setLoading(true));
      const newTimeItem = new Time({
        id: timeItem.id,
        date: timeItem.date,
        time: timeItem.time,
        client: {
          uid: timeItem.client.uid,
          confirmed: true,
        },
        isReserved: true,
      });
      const historyItem = new History({ ...newTimeItem }, 'await');
      await confirmTime({ ...newTimeItem });
      await setUserHistory({ ...historyItem });
      await setUserReserve({ ...newTimeItem });

      await getWaiting();

      toast({
        title: `Запись на ${timeItem.date.formate} ${timeItem.time} подтверждена`,
        status: 'success',
        isClosable: true,
        duration: 5000,
        position: 'top',
      });
    } catch (e) {
      console.log(e);
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
        title='Ожидающие подтверждения' />

      <Container>

        <Accordion
          as={'ul'}
          allowToggle
          className={styles.daysList}>
          {reservedList.map(day => (
            <AccordionItem
              key={day.date.full}
              as={'li'}
              className={styles.daysItem} >
              <AccordionButton className={styles.daysItemHeader}>
                <h6 className={styles.daysItemTitle}>{day.date.formate}</h6>
                <div className={styles.daysBtns}>
                  <NavLink
                    className={styles.daysLink}
                    onClick={() => reduxDispatch(setSelectedDate(day.date))}
                    to={'/day'}
                  >
                    <ExternalLinkIcon color={'#fff'} fontSize={'20px'} />
                  </NavLink>
                  <AccordionIcon />
                </div>
              </AccordionButton>
              <AccordionPanel
                p={'10px'}
                as={'ul'}
                className={styles.timeList} >
                {
                  Object.values(day.timeList).sort((a, b) => Number(a.date.full) - Number(b.date.full)).map(item => (
                    <li
                      key={item.id}
                      className={styles.timeItem}>
                      <InfoContainer>
                        <span className={styles.timeItemTitle}>{item.time}</span>
                        <div className={styles.btnWrapper}>
                          <NavLink
                            className={styles.btn}
                            onClick={() => reduxDispatch(setSelectedUserUID(item.client.uid))}
                            to={'/user'}>
                            <IconButton
                              variant='outline'
                              colorScheme='whiteAlpha'
                              aria-label='btn'
                              size={'xs'}
                              color="#fff"
                              icon={
                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="3" width="6" height="6" rx="3" fill="white" />
                                  <path d="M0 10.5V10.5C0.939219 8.67374 2.71599 7.4257 4.75256 7.1617L4.82655 7.15211C5.60557 7.05113 6.39436 7.05113 7.17338 7.15211L7.24745 7.16171C9.28402 7.42571 11.0608 8.67374 12 10.5V10.5V10.5C10.7728 12.6476 8.47348 14 5.99996 14V14V14C3.80354 14 1.74233 12.9393 0.465688 11.152L0 10.5Z" fill="white" />
                                </svg>
                              }
                            />
                          </NavLink>
                          <IconButton
                            onClick={() => openConfirmModal(item)}
                            className={styles.btn}
                            variant='outline'
                            colorScheme='whiteAlpha'
                            aria-label='btn'
                            size={'xs'}
                            color="#fff"
                            icon={<CheckIcon />}
                          />
                          <IconButton
                            onClick={() => openCancelModal(item)}
                            className={styles.btn}
                            variant='outline'
                            colorScheme='whiteAlpha'
                            aria-label='btn'
                            size={'xs'}
                            color="#fff"
                            icon={<CloseIcon />}
                          />
                        </div>
                      </InfoContainer>
                    </li>
                  ))
                }
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

      </Container>

      <ModalConteiner
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}>
        <div className={styles.cancelWrapper}>
          <h6 className={styles.cancelTitle}>
            отказать в записи на {timeItem.time}?
          </h6>
          <div className={styles.cancelBtns}>
            <DefaultBtn
              handleClick={cancelReserve}
              dark={true}
              type='button'
              value='отказать' />
            <DefaultBtn
              handleClick={() => setCancelModal(false)}
              dark={true}
              type='button'
              value='закрыть' />
          </div>
        </div>
      </ModalConteiner>

      <ModalConteiner
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}>
        <div className={styles.cancelWrapper}>
          <div className={styles.confirmTitle}>
            <span>подтвердить запись на {`${timeItem.date.formate} в ${timeItem.time}`}</span>
          </div>
          <div className={styles.confirmBtn}>
            <DefaultBtn
              handleClick={saveConfirmTime}
              dark={true}
              type='button'
              value='подтвердить' />
            <DefaultBtn
              handleClick={() => setConfirmModal(false)}
              dark={true}
              type='button'
              value='закрыть' />
          </div>
        </div>
      </ModalConteiner>


    </div>
  );
};

export default WaitingScreen;

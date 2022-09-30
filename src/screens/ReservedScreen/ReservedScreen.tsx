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
import FormInput from '../../components/FormInput/FormInput';
import { CheckIcon, CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { setLoading } from '../../store';
import useAuth from '../../firebase/controllers/userController';
import { IReserveItem, ITimeItem } from '../../interfaces';
import useTime from '../../firebase/controllers/timeController';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import styles from './ReservedScreen.module.scss';
import moment from 'moment';

const ReservedScreen: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const toast = useToast();
  const { getAllReserves } = useTime();

  const [reservedList, setReservedList] = useState<IReserveItem[]>([]);

  useEffect(() => {
    (async () => {
      await setReserves();
    })();
  }, []);

  async function setReserves() {
    try {
      reduxDispatch(setLoading(true));
      const data = await getAllReserves();
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

  return (
    <div className={styles.reserved}>
      <Header>
        <BackBtn
          to="/calendar" />
        <Logo />
      </Header>

      <ScreenTitle
        title='подтвержденные записи' />

      <Container>

        <Accordion
          as={'ul'}
          className={styles.daysList}>
          {reservedList.map(day => (
            <AccordionItem
              key={day.date.full}
              as={'li'}
              className={styles.daysItem} >
              <AccordionButton className={styles.daysItemHeader}>
                <h6 className={styles.daysItemTitle}>{day.date.formate}</h6>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel
                p={'10px'}
                as={'ul'}
                className={styles.timeList} >
                {
                  Object.values(day.timeList).sort((a, b) => Number(a.date.full) - Number(b.date.full)).map(item => (
                    <li className={styles.timeItem}>
                      <InfoContainer key={item.id}>
                        <span className={styles.timeItemTitle}>{item.time}</span>
                        <div className={styles.btnWrapper}>
                          <IconButton
                            className={styles.btn}
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
                          <IconButton
                            className={styles.btn}
                            variant='outline'
                            colorScheme='whiteAlpha'
                            aria-label='btn'
                            size={'xs'}
                            color="#fff"
                            icon={<CheckIcon />}
                          />
                          <IconButton
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

    </div>
  );
};

export default ReservedScreen;

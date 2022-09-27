import { FC, useEffect, useState } from "react";
import BackBtn from "../../components/BackBtn/BackBtn";
import Header from "../../components/Header/Header";
import Logo from "../../components/Logo/Logo";
import ScreenTitle from "../../components/ScreenTitle/ScreenTitle";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  IconButton,
  Input,
  Switch,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { setLoading } from "../../store";
import useDay from "../../firebase/controllers/dayController";
import ModalConteiner from "../../components/ModalContainer/ModalContainer";
import DefaultBtn from "../../components/DefaultBtn/DefaultBtn";
import FormInput from "../../components/FormInput/FormInput";
import useTime from "../../firebase/controllers/timeController";
import { Time } from "../../firebase/services/timeService";
import { sortByTime } from "../../firebase/services/dayService";
import Container from "../../components/Container/Container";
import { NavLink } from "react-router-dom";
import IconBtn from "../../components/IconBtn/IconBtn";

import styles from './DayScreen.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DayScreen: FC = () => {
  const { addTime } = useTime();
  const { getDay } = useDay();
  const toast = useToast();
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [time, setTime] = useState('08:00');
  const [name, setName] = useState('');
  const [inst, setInst] = useState('');
  const [comment, setComment] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    (async () => {
      reduxDispatch(setLoading(true));
      await getDay();
      reduxDispatch(setLoading(false));
    })();
  }, []);

  const timeList = Object.values(appState.selectedDay.timeList).sort((a, b) => sortByTime(a, b));

  const closeModal = () => {
    onClose();
    setName('');
    setInst('');
    setComment('');
    setIsOffline(false);
  }

  const addNewTime = async () => {
    try {
      if (isOffline) {
        if (!name && !inst && !comment) {
          toast({
            title: 'Заполните данные клиента или уберите метку "оффлайн"',
            status: 'warning',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
          return;
        }
      }
      const newTimeItem = isOffline ?
        new Time(time, appState.selectedDate, {
          status: true,
          name: name,
          instagram: inst,
          comment: comment,
        }) : new Time(time, appState.selectedDate);
      reduxDispatch(setLoading(true));
      await addTime(appState.selectedDate.full, { ...newTimeItem });
      await getDay();
      closeModal();
      toast({
        title: `Добавлена запись на ${newTimeItem.date.formate} ${newTimeItem.time}`,
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
    <div className={styles.day}>
      <Header>
        <BackBtn
          to="/calendar" />
        <Logo />
      </Header>

      <ScreenTitle
        title={appState.selectedDate.formate} />

      <Container>
        <ul className={styles.timeList}>
          {
            timeList.map(item => (
              <li
                key={item.id}
                className={styles.timeItem}>
                <span className={styles.timeItemTime}>
                  {item.time}
                </span>
                <ul className={styles.btnList}>
                  {item.client.uid &&
                    <li className={styles.btnListItem}>
                      <NavLink
                        to={'/user'}>
                        <IconBtn
                          icon={<FontAwesomeIcon icon={solid('user')} />} />
                      </NavLink>
                    </li>
                  }
                  {(item.client.uid && !item.client.confirmed) &&
                    <li className={styles.btnListItem}>
                      <IconBtn
                        icon={<FontAwesomeIcon icon={solid('check')} />} />
                    </li>
                  }
                  <li className={styles.btnListItem}>
                    <IconBtn
                      icon={<FontAwesomeIcon size='xs' icon={solid('pen')} />} />
                  </li>

                  <li className={styles.btnListItem}>
                    <IconBtn
                      icon={<FontAwesomeIcon size='sm' icon={solid('close')} />} />
                  </li>
                </ul>
              </li>
            ))
          }
        </ul>
      </Container >

      <div className={styles.plusBtnWrapper}>
        <IconButton
          onClick={onOpen}
          w={'60px'}
          h={'60px'}
          borderRadius={'50%'}
          colorScheme='whiteAlpha'
          aria-label='add time'
          icon={<AddIcon />}
        />
      </div>

      <ModalConteiner
        isOpen={isOpen}
        onClose={closeModal}>
        <div className={styles.modal}>
          <ul className={styles.modalList}>
            <li className={styles.modalListItem}>
              <label className={styles.modalItemLabel}>Время
                <Input
                  className={styles.timeInp}
                  borderWidth={'2px'}
                  borderColor={'rgba(15, 15, 15, 1)'}
                  type='time'
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>
            </li>

            <li className={styles.modalListItem}>
              <label className={`${styles.modalItemLabel} ${styles.switchWrapper}`}>запись оффлайн
                <Switch
                  colorScheme='blackAlpha'
                  outline={'none'}
                  isChecked={isOffline}
                  onChange={() => setIsOffline(!isOffline)} />
              </label>
            </li>
            <li>
              <ul className={isOffline ?
                `${styles.oflineInfoList} ${styles.open}` :
                styles.oflineInfoList}>
                <li className={styles.modalListItem}>
                  <FormInput
                    title="имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={'Кристина'} />
                </li>
                <li className={styles.modalListItem}>
                  <FormInput
                    title="instagram"
                    value={inst}
                    onChange={(e) => setInst(e.target.value)}
                    placeholder={'https://www.instagram.com/аккаунт'} />
                </li>
                <li className={styles.modalListItem}>
                  <FormInput
                    title="комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={'Кристина'} />
                </li>
              </ul>
            </li>
          </ul>

          <div className={styles.modalBtnWrapper}>
            <DefaultBtn
              type='button'
              value='добавить'
              dark={true}
              handleClick={addNewTime} />

            <DefaultBtn
              type='button'
              value='отмена'
              dark={true}
              handleClick={closeModal} />
          </div>
        </div>
      </ModalConteiner>

    </div >
  );
};

export default DayScreen;

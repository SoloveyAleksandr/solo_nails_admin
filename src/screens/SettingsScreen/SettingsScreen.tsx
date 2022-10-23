import { AddIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { IconButton, Input } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import BackBtn from '../../components/BackBtn/BackBtn';
import Container from '../../components/Container/Container';
import DefaultBtn from '../../components/DefaultBtn/DefaultBtn';
import Header from '../../components/Header/Header';
import InfoContainer from '../../components/InfoContainer/InfoContainer';
import Logo from '../../components/Logo/Logo';
import ModalConteiner from '../../components/ModalContainer/ModalContainer';
import ScreenTitle from '../../components/ScreenTitle/ScreenTitle';
import { useSettings } from '../../firebase/controllers/settingsController';
import { ITemplateTimeItem } from '../../interfaces';
import { setLoading } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import styles from './SettingsScreen.module.scss';

const SettingsScreen: FC = () => {
  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(store => store.AppStore);
  const {
    getTimeTemplate,
    addTimeToTemplate,
    deletiTimeFromTemplate,
  } = useSettings();

  const [confirmModal, setConfirmModal] = useState(false);
  const [timeModal, setTimeModal] = useState(false);
  const [time, setTime] = useState('10:00');
  const [selectedTime, setSelectedTime] = useState<ITemplateTimeItem>({ id: '', time: '', });
  const [timeTemplate, setTimeTemplate] = useState<{ [key: string]: ITemplateTimeItem }>({});

  const getTimeTemplateFromDB = async () => {
    try {
      const template = await getTimeTemplate();
      template && setTimeTemplate(template.timeList);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        reduxDispatch(setLoading(true));
        await getTimeTemplateFromDB();
      } catch (e) {
        console.log(e);
      } finally {
        reduxDispatch(setLoading(false));
      }
    })()
  }, [])

  const openConfirmModal = (time: ITemplateTimeItem) => {
    setSelectedTime(time);
    setConfirmModal(true);
  }

  const addTime = async () => {
    try {
      setTimeModal(false);
      reduxDispatch(setLoading(true));
      await addTimeToTemplate({
        id: v4().slice(0, 8),
        time: time,
      });
      await getTimeTemplateFromDB();
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  const sortTime = (a: string, b: string) => {
    const aH = Number(a.slice(0, 2));
    const bH = Number(b.slice(0, 2));
    if (aH > bH) {
      return 1;
    } else return -1;
  }

  const deletiTime = async () => {
    try {
      setConfirmModal(false);
      reduxDispatch(setLoading(true));
      await deletiTimeFromTemplate(selectedTime.id);
      await getTimeTemplateFromDB();
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  return (
    <>
      <Header>
        <BackBtn />
        <Logo />
      </Header>

      <ScreenTitle
        title={'настройки'} />

      <Container>
        <div className={styles.settings}>

          <div className={styles.settingsContainer}>
            <div className={styles.settingsHeader}>
              <h4 className={styles.settingsTitle}>шаблон времени:</h4>
              <IconButton
                onClick={() => setTimeModal(true)}
                variant='outline'
                colorScheme='whiteAlpha'
                aria-label='btn'
                size={'xs'}
                color="#fff"
                icon={<AddIcon />}
              />
            </div>
            <ul className={styles.list}>
              {
                Object.values(timeTemplate).sort((a, b) => sortTime(a.time, b.time)).map((time) => (
                  <li
                    key={time.id}
                    className={styles.listItem}>
                    <InfoContainer>
                      <span className={styles.listInfo}>
                        {time.time}
                      </span>
                      <IconButton
                        onClick={() => openConfirmModal(time)}
                        variant='outline'
                        colorScheme='whiteAlpha'
                        aria-label='btn'
                        size={'xs'}
                        color="#fff"
                        icon={<CloseIcon />}
                      />
                    </InfoContainer>
                  </li>
                ))
              }
            </ul>
          </div>

        </div>

      </Container>

      <ModalConteiner
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}>
        <div className={styles.confirmModal}>
          <span className={styles.confirmTitle}>{`удалить время на ${selectedTime.time}`}</span>
          <div className={styles.confirmBtns}>
            <DefaultBtn
              handleClick={deletiTime}
              dark
              type='button'
              value='удалить' />
            <DefaultBtn
              handleClick={() => setConfirmModal(false)}
              dark
              type='button'
              value='отмена' />
          </div>
        </div>
      </ModalConteiner>

      <ModalConteiner
        isOpen={timeModal}
        onClose={() => setTimeModal(false)}>
        <div className={styles.confirmModal}>
          <span className={styles.confirmTitle}>добавить время</span>
          <div>
            <Input
              className={styles.timeInp}
              borderWidth={'2px'}
              borderColor={'rgba(15, 15, 15, 1)'}
              type='time'
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className={styles.confirmBtns}>
            <DefaultBtn
              handleClick={addTime}
              dark
              type='button'
              value='добавить' />
            <DefaultBtn
              handleClick={() => setTimeModal(false)}
              dark
              type='button'
              value='отмена' />
          </div>
        </div>
      </ModalConteiner>
    </>
  );
};

export default SettingsScreen;

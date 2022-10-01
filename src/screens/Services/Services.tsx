import { AddIcon } from "@chakra-ui/icons";
import { IconButton, Input } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import BackBtn from "../../components/BackBtn/BackBtn";
import Container from "../../components/Container/Container";
import DefaultBtn from "../../components/DefaultBtn/DefaultBtn";
import Header from "../../components/Header/Header";
import Logo from "../../components/Logo/Logo";
import ModalConteiner from "../../components/ModalContainer/ModalContainer";
import ScreenTitle from "../../components/ScreenTitle/ScreenTitle";
import { useService } from "../../firebase/controllers/serviceController";
import { IService } from "../../interfaces";
import { setLoading } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import styles from './Services.module.scss';

const Services: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const {
    addService,
    removeService,
    getServices,
  } = useService();

  const [priceList, setPriceList] = useState<IService[]>([]);

  useEffect(() => {
    (async () => await getServicesList())()
  }, []);

  async function getServicesList() {
    try {
      reduxDispatch(setLoading(true));
      const data = await getServices();
      setPriceList(Object.values(data));
    } catch (e) {

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
        title={'услуги и цены'} />

      <Container>

        <ul className={styles.priceList}>
          {
            priceList.map(item => (
              <li className={styles.priceItem}>
                <IconButton
                  className={styles.editBtn}
                  aria-label="edit btn"
                  size={'xs'}
                  variant={'ghost'}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_219_638)">
                        <path d="M0.54481 7.42478L2.52475 9.40472L2.47558 9.50307L0.001297 10L0.495635 7.52572L0.54481 7.42478ZM0.8968 7.05985L2.89227 9.05532L8.49305 3.45457L6.49755 1.4591L0.8968 7.05985ZM9.70172 0.88968L9.10644 0.296991C8.71045 -0.0989971 8.11779 -0.0989971 7.72178 0.296991L6.88062 1.13814L8.86057 3.11808L9.70172 2.27693C10.0977 1.88094 10.0977 1.23649 9.70172 0.88968Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0_219_638">
                          <rect width="10" height="10" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  } />
                <h3 className={styles.priceTitle}>{item.title}</h3>
                <ul className={styles.serviceList}>
                  {
                    item.servicesList.map(el => (
                      <li className={styles.serviceItem}>{el}</li>
                    ))
                  }
                </ul>
                <span className={styles.priceCount}>
                  {item.price}
                  <span className={styles.priceValue}>руб.</span>
                </span>
              </li>
            ))
          }
        </ul>

      </Container>

      <div className={styles.plusBtnWrapper}>
        <IconButton
          onClick={() => console.log('add')}
          w={'60px'}
          h={'60px'}
          borderRadius={'50%'}
          colorScheme='whiteAlpha'
          aria-label='add time'
          icon={<AddIcon />}
        />
      </div>

      <ModalConteiner
        isOpen={true}
        onClose={() => false}>

        <div className={styles.modal}>
          <ul className={styles.modalList}>
            <li className={styles.modalListItem}>
              <label className={styles.modalItemLabel}>Время
                <Input
                  className={styles.timeInp}
                  borderWidth={'2px'}
                  borderColor={'rgba(15, 15, 15, 1)'}
                  type='time'
                />
              </label>
            </li>
          </ul>

          <div className={styles.modalBtnWrapper}>
            <DefaultBtn
              type='button'
              value={'добавить'}
              dark={true} />

            <DefaultBtn
              type='button'
              value='отмена'
              dark={true} />
          </div>
        </div>
      </ModalConteiner>

    </div >
  );
};

export default Services;

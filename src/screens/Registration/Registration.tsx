import React, { FC, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import styles from './Registration.module.scss';
import DefaultBtn from "../../components/DefaultBtn/DefaultBtn";
import { Link } from "react-router-dom";
import { authentification } from "../../firebase/firebase";
import { setLoading } from "../../store";
import FormInput from "../../components/FormInput/FormInput";

const Registration: FC = () => {
  const reduxDispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [inst, setInst] = useState('');
  const [friendKey, setFriendKey] = useState('');
  const [awaitOTP, setAwaitOTP] = useState(false);
  const [OTP, setOTP] = useState('');

  const generateRecaptcha = () => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    }, authentification);
  }

  const submitForm = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      reduxDispatch(setLoading(true));
      if (awaitOTP) {
        if (OTP.length === 6) {
          const confirmationResult = (window as any).confirmationResult;
          confirmationResult.confirm(OTP).then((result: any) => {
            const user = result.user;
          }).catch((error: any) => {
            console.log(error);
          });
        }
        return
      } else {
        if (phone.length === 9) {
          setAwaitOTP(true);
          generateRecaptcha();
          const appVerifier = (window as any).recaptchaVerifier;
          const phoneNumber = `+375${phone}`;
          const confirmationResult = await signInWithPhoneNumber(authentification, phoneNumber, appVerifier);
          (window as any).confirmationResult = confirmationResult;
        }
        return;
      }
    } catch (e) {
      console.log(e);
      setAwaitOTP(false);
    } finally {
      reduxDispatch(setLoading(false));
    }
  };

  return (
    <div className={styles.registration}>

      <form
        className={styles.form}
        onSubmit={e => submitForm(e)} >
        <ul className={styles.formList}>
          <li className={styles.formListItem}>
            <FormInput
              title="Имя"
              value={name}
              placeholder='Кристина'
              onChange={e => setName(e.target.value)}
              info={'Ваше имя будет видно другим пользователям'} />
          </li>
          <li className={styles.formListItem}>
            <FormInput
              title="Номер телефона"
              value={phone}
              placeholder='291235656'
              onChange={e => setPhone(e.target.value)}
              addon='+375'
              info="Номер телефона будет использоваться для входа в аккаунт" />
          </li>
          <li className={styles.formListItem}>
            <FormInput
              title="Ссылка на instagram"
              value={inst}
              placeholder='https://instagram.com/...'
              onChange={e => setInst(e.target.value)}
              info='Для получения ссылки зайдите на свою страницу в instagram нажмите "..." 
              сверху и выберите "Скопировать URL профиля", затем вставьте его в поле ввода' />
          </li>
          <li className={styles.formListItem}>
            <FormInput
              title="Код друга"
              value={friendKey}
              placeholder='25a68r'
              onChange={e => setFriendKey(e.target.value)}
              info={'Реферальный код пригласившего вас человека'} />
          </li>
        </ul>

        <div className={styles.btnWrapper}>
          <DefaultBtn
            type={'submit'}
            value={'регистрация'} />
        </div>
        <div className={styles.linkWrapper}>
          <Link
            to={'/login'}
            className={styles.link}>
            вход
          </Link>
        </div>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Registration;
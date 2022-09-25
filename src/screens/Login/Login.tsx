import { FC, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import DefaultBtn from "../../components/DefaultBtn/DefaultBtn";
import { Link } from "react-router-dom";
import { authentification } from "../../firebase/firebase";
import { setLoading } from "../../store";
import FormInput from "../../components/FormInput/FormInput";
import { useToast } from '@chakra-ui/react';
import { useErrorHandler } from "../../firebase/services/errorHandler";

import styles from './Login.module.scss';

const Login: FC = () => {
  const reduxDispatch = useAppDispatch();
  const toast = useToast();
  const { authError } = useErrorHandler();

  const [phone, setPhone] = useState('');
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

  const sendForm = async () => {
    try {
      if (!phone || phone.length !== 9) {
        toast({
          title: 'Проверьте номер телефона',
          status: 'error',
          isClosable: true,
          duration: 5000,
          position: 'top'
        });
        return;
      }
      reduxDispatch(setLoading(true));
      setAwaitOTP(true);
      generateRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const phoneNumber = `+375${phone}`;
      const confirmationResult = await signInWithPhoneNumber(authentification, phoneNumber, appVerifier);
      (window as any).confirmationResult = confirmationResult;
      toast({
        title: 'Код был отправлен на ваш номер телефона',
        status: 'success',
        isClosable: true,
        duration: 5000,
        position: 'top'
      });
      return;
    } catch (e) {
      console.log(e);
      setAwaitOTP(false);
      authError(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  };

  const sendOTP = async () => {
    try {
      if (OTP.length === 6) {
        reduxDispatch(setLoading(true));
        const confirmationResult = (window as any).confirmationResult;
        const result = await confirmationResult.confirm(OTP)
        const user = result.user;
        console.log(user);
        return;
      } else {
        toast({
          title: 'Проверьте правильность кода',
          status: 'error',
          isClosable: true,
          duration: 5000,
          position: 'top'
        });
        return;
      }
    } catch (e) {
      console.log(e);
      setAwaitOTP(false);
      authError(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  return (
    <div className={styles.registration}>

      <form className={styles.form}>
        <ul className={styles.formList}>
          {
            awaitOTP ?
              <FormInput
                title="Код подтверждения *"
                value={OTP}
                placeholder='024986'
                onChange={e => setOTP(e.target.value)}
                info={'Код подтвердения придет на указаный вами номер телефона'} />
              :
              <li className={styles.formListItem}>
                <FormInput
                  title="Номер телефона *"
                  value={phone}
                  placeholder='291235656'
                  onChange={e => e.target.value.length < 10 && setPhone(e.target.value)}
                  addon='+375'
                  info="Номер телефона будет использоваться для входа в аккаунт" />
              </li>
          }
        </ul>

        <div className={styles.btnWrapper}>
          {
            awaitOTP ?
              <DefaultBtn
                type={'button'}
                value={'подтвердить код'}
                handleClick={() => sendOTP()} />
              :
              <DefaultBtn
                type={'button'}
                value={'регистрация'}
                handleClick={() => sendForm()} />
          }
        </div>
        <div className={styles.linkWrapper}>
          <Link
            to={'/sign-in'}
            className={styles.link}>
            регистрация
          </Link>
        </div>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;

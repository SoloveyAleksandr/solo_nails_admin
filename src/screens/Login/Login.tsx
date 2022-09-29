import React, { FC, useEffect, useState } from "react";
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
  const [phoneFormate, setPhoneFormate] = useState('');
  const [awaitOTP, setAwaitOTP] = useState(false);
  const [OTP, setOTP] = useState('');

  const setPhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const freeValue = value.split(' ').join('').split('-').join('');
    if (freeValue.length < 10) {
      if (Number(freeValue)) {
        setPhone(freeValue);
      }
      if (value === '') {
        setPhone('');
      }
    }
  };

  const formatePhone = (): string => {
    const length = phone.length;
    if (length === 0) {
      return '';
    } else if (length <= 2) {
      return `${phone}`;
    } else if (length <= 5) {
      return `${phone.slice(0, 2)} ${phone.slice(2)}`;
    } else if (length <= 7) {
      return `${phone.slice(0, 2)} ${phone.slice(2, 5)}-${phone.slice(5)}`;
    } else if (length <= 9) {
      return `${phone.slice(0, 2)} ${phone.slice(2, 5)}-${phone.slice(5, 7)}-${phone.slice(7)}`;
    }
    return '';
  };

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
      if (phone.length < 9) {
        toast({
          title: 'номер телефона слтшком короткий',
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
        title: `Код был отправлен на ваш номер: +375 ${phoneFormate}`,
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

  useEffect(() => {
    setPhoneFormate(formatePhone());
  }, [phone]);

  return (
    <div className={styles.registration}>

      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault();
          awaitOTP && sendOTP();
          !awaitOTP && sendForm();
        }}>
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
                  value={phoneFormate}
                  placeholder='29 235-25-25'
                  onChange={e => setPhoneNumber(e)}
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
                handleClick={() => sendOTP()}
                dark={true} />
              :
              <DefaultBtn
                dark={true}
                type={'button'}
                value={'войти'}
                handleClick={() => sendForm()} />
          }
        </div>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;

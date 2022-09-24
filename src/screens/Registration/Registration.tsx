import React, { FC, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import styles from './Registration.module.scss';
import DefaultBtn from "../../components/DefaultBtn/DefaultBtn";
import { Link } from "react-router-dom";
import { ICustomWindow } from "../../interfaces";
import { authentification } from "../../firebase/firebase";
import { setLoading } from "../../store";

const Registration: FC = () => {
  const reduxDispatch = useAppDispatch();

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

  const handleSetValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (awaitOTP) {
      if (value.length < 7) {
        setOTP(value);
      }
    } else {
      if (value.length < 10) {
        setPhone(value);
      }
    }
  };

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

        <div className={styles.inputWrapper}>
          <label
            htmlFor="loginFormInput"
            className={styles.inputLabel}>
            {
              awaitOTP ? 'код подтверждения' : 'Номер телефона'
            }
          </label>
          {!awaitOTP &&
            <span className={styles.inputPrefix}>
              +375
            </span>
          }
          <input
            id="loginFormInput"
            required
            type='number'
            className={awaitOTP ? styles.input : `${styles.input} ${styles.phone}`}
            value={awaitOTP ? OTP : phone}
            onChange={e => handleSetValue(e)} />
        </div>

        <div id="recaptcha-container"></div>

        <div className={styles.btnWrapper}>
          <DefaultBtn
            type={'submit'}
            value={awaitOTP ? 'подтвердить' : 'регистрация'}
            disabled={awaitOTP ? OTP.length < 6 : phone.length < 9} />
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
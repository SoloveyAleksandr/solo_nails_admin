import { FC, useState } from "react";
import useAuth from "../../firebase/controllers/userController";
import { setLoading } from "../../store";
import { useAppDispatch } from "../../store/hooks";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

import styles from './Login.module.scss';
import DefaultBtn from "../../components/DefaultBtn/DefaultBtn";
import { Link } from "react-router-dom";

const Login: FC = () => {
  const reduxDispatch = useAppDispatch();

  const auth = getAuth();

  const [userEmail, setUserEmail] = useState('');
  const [userPass, setUserPass] = useState('');
  const { signIn } = useAuth();

  return (
    <div className={styles.login}>
      <form className={styles.form}>

        <div className={styles.inputWrapper}>
          <label
            htmlFor="loginFormInput"
            className={styles.inputLabel}>
            Номер телефона
          </label>
          <input
            id="loginFormInput"
            required
            minLength={9}
            maxLength={9}
            max={9}
            min={9}
            type='number'
            className={styles.input} />
        </div>

        <div id="recaptcha-container"></div>

        <div className={styles.btnWrapper}>
          <DefaultBtn
            type={'submit'}
            value={'войти'} />
        </div>
        <div className={styles.linkWrapper}>
          <Link
            to={'/sign-in'}
            className={styles.link}>
            регистрация
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
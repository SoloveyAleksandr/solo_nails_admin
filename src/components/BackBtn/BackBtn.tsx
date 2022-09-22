import React, { FC } from "react";
import { NavLink } from "react-router-dom";

import styles from './BackBtn.module.scss';

interface IBackBtn {
  to: string
};

const BackBtn: FC<IBackBtn> = ({
  to,
}) => {
  return (
    <NavLink to={to} className={styles.buttonWrapper}>
      <span className={styles.button}></span>
    </NavLink>
  );
};

export default BackBtn;
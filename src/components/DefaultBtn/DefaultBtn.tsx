import { FC } from 'react';

import styles from './DefaultBtn.module.scss';

interface IDefaultBtn {
  type: "button" | "reset" | "submit";
  value: string;
  handleClick?: () => void;
  disabled?: boolean
}

const DefaultBtn: FC<IDefaultBtn> = ({
  type = 'button',
  value,
  handleClick,
  disabled = false,
}) => {
  return (
    <button
      className={disabled ? `${styles.btn} ${styles.disabled}` : styles.btn}
      type={type}
      onClick={handleClick}>
      {value}
    </button>
  )
};

export default DefaultBtn;

import { FC } from 'react';

import styles from './DefaultBtn.module.scss';

interface IDefaultBtn {
  type: "button" | "reset" | "submit";
  value: string;
  handleClick?: () => void;
}

const DefaultBtn: FC<IDefaultBtn> = ({
  type = 'button',
  value,
  handleClick
}) => {
  return (
    <button
      className={styles.btn}
      type={type}
      onClick={handleClick}>
      {value}
    </button>
  )
};

export default DefaultBtn;

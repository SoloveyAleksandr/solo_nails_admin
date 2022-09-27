import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from "@fortawesome/free-regular-svg-icons";
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import styles from './IconBtn.module.scss';
import { type } from 'os';

interface IIconBtn {
  icon: any
}

const IconBtn: FC<IIconBtn> = ({
  icon,
}) => {
  return (
    <button className={styles.btn}>
      {icon}
    </button>
  );
};

export default IconBtn;

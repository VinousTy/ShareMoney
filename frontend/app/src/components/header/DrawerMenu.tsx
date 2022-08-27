import React from 'react';
import styles from './Header.module.scss';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import {
  isToggleDrawer,
  selectIsDrawer,
} from '../../features/layout/layoutSlice';
import { useHistory } from 'react-router-dom';

const DrawerMenu: React.VFC = () => {
  const dispatch: AppDispatch = useDispatch();
  const drawer = useSelector(selectIsDrawer);
  const history = useHistory();

  const toggleOpen = () => {
    dispatch(isToggleDrawer());
  };

  const headerMenu = () => {
    return (
      <>
        <li className={styles.nav_item} onClick={() => history.push('/signup')}>
          <span className={styles.cp_link}>
            <PersonAddIcon />
            <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
              新規登録
            </button>
          </span>
        </li>
        <li className={styles.nav_item} onClick={() => history.push('/signin')}>
          <span className={styles.cp_link}>
            <ExitToAppIcon />
            <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
              ログイン
            </button>
          </span>
        </li>
        <li className={styles.nav_item}>
          <span className={styles.cp_link}>
            <AccountCircleIcon />
            <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
              ゲストログイン
            </button>
          </span>
        </li>
        <li
          className={styles.nav_item}
          onClick={() => history.push('/contact')}
        >
          <span className={styles.cp_link}>
            <ContactMailIcon />
            <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
              お問い合わせ
            </button>
          </span>
        </li>
      </>
    );
  };

  return (
    <div onClick={toggleOpen}>
      <button className={styles.hamburger}>
        <span
          className={`${styles.hamburger_bar} ${drawer && styles.is_active}`}
        ></span>
        <span
          className={`${styles.hamburger_bar} ${drawer && styles.is_active}`}
        ></span>
        <span
          className={`${styles.hamburger_bar} ${drawer && styles.is_active}`}
        ></span>
      </button>
      {drawer && (
        <div className={`${styles.nav_wrapper} ${drawer && styles.fade}`}>
          <nav className={styles.header_nav}>
            <ul className={styles.nav_list}>{headerMenu()}</ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default DrawerMenu;

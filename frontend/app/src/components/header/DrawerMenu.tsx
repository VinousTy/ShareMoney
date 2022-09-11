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
import {
  editMessage,
  isSignOut,
  isSuccessOrFailure,
  selectIsSignIn,
  selectProfile,
} from '../../features/auth/authSlice';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import { FaCrown } from 'react-icons/fa';
import { BsBookmarkFill } from 'react-icons/bs';
import { useCookies } from 'react-cookie';

const DrawerMenu: React.VFC = () => {
  const dispatch: AppDispatch = useDispatch();
  const signIn = useSelector(selectIsSignIn);
  const profile = useSelector(selectProfile);
  const drawer = useSelector(selectIsDrawer);
  const [cookies, setCookie, removeCookie] = useCookies();
  const history = useHistory();

  const toggleOpen = () => {
    dispatch(isToggleDrawer());
  };

  const logout = async () => {
    await dispatch(isSignOut());
    await removeCookie('Bearer');
    await dispatch(editMessage('ログアウトしました'));
    await dispatch(isSuccessOrFailure(true));
    await history.push('/signin');
  };

  const pageTransition = (pass: string) => {
    if (profile === undefined) {
      alert('プロフィールの登録を行ってください');
      dispatch(isToggleDrawer());
    } else {
      history.push(`/${pass}`);
    }
  };

  const headerMenu = () => {
    if (signIn) {
      return (
        <>
          <li
            className={styles.nav_item}
            onClick={() => pageTransition('mypage')}
          >
            <span className={styles.cp_link}>
              <HomeIcon />
              <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
                マイページ
              </button>
            </span>
          </li>
          <li
            className={styles.nav_item}
            onClick={() => pageTransition('accountBook/list')}
          >
            <span className={styles.cp_link}>
              <SearchIcon />
              <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
                家計簿一覧
              </button>
            </span>
          </li>
          <li
            className={styles.nav_item}
            onClick={() => pageTransition('home')}
          >
            <span className={styles.cp_link}>
              <span className="flex items-center">
                <FaCrown />
                <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
                  ランキング
                </button>
              </span>
            </span>
          </li>
          <li
            className={styles.nav_item}
            onClick={() => pageTransition('bookmark/accountBook/list')}
          >
            <span className={styles.cp_link}>
              <span className="flex items-center">
                <BsBookmarkFill />
                <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
                  保存した家計簿
                </button>
              </span>
            </span>
          </li>
          <li className={styles.nav_item} onClick={() => logout()}>
            <span className={styles.cp_link}>
              <ExitToAppIcon />
              <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
                ログアウト
              </button>
            </span>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li
            className={styles.nav_item}
            onClick={() => history.push('/signup')}
          >
            <span className={styles.cp_link}>
              <PersonAddIcon />
              <button className="bg-transparent font-semibold py-1 mr-2 rounded-lg">
                新規登録
              </button>
            </span>
          </li>
          <li
            className={styles.nav_item}
            onClick={() => history.push('/signin')}
          >
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
    }
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

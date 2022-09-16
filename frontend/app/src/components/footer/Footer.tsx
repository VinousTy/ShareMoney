import React from 'react';
import styles from './Footer.module.scss';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LockIcon from '@material-ui/icons/Lock';
import useMedia from 'use-media';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo__footer.png';
import { useSelector } from 'react-redux';
import { selectIsSignIn } from '../../features/auth/authSlice';
import BottomNav from './BottomNav';

const Footer: React.FC = () => {
  const location = useLocation();
  const isWide = useMedia({ maxWidth: '768px' });
  const signIn = useSelector(selectIsSignIn);
  const history = useHistory();

  let id = window.location.pathname.split('/profile')[1];
  if (id !== '') {
    id = id?.split('/')[1];
  }
  const path = location.pathname.includes('/profile');

  const footerMenuSm = () => {
    if (signIn && path && id === '') {
      return (
        <div className="mx-auto text-white items-center">
          <h1>
            <img src={logo} className={`${styles.logo} cursor-pointer mt-4`} />
          </h1>
          <nav className="md:flex items-center justify-between">
            <div className="pb-2 text-xs flex items-center justify-center">
              copylight&copy;2022 <img className="w-28" src={logo} alt="" />
            </div>
          </nav>
        </div>
      );
    } else if (signIn) {
      return <BottomNav />;
    } else {
      return (
        <div className="mx-auto text-white items-center">
          <h1>
            <img src={logo} className={`${styles.logo} cursor-pointer mt-4`} />
          </h1>
          <nav className="md:flex items-center justify-between">
            <ul className={styles.nav_box}>
              <li
                className="cursor-pointer"
                onClick={() => history.push('/terms')}
              >
                <a className={`${styles.nav} inline-block px-3 pb-1`}>
                  利用規約
                </a>
              </li>
              <li
                className="cursor-pointer"
                onClick={() => history.push('/privacy')}
              >
                <a className={`${styles.nav} inline-block px-3 py-1`}>
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`${styles.nav} inline-block px-3 py-1`}
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
            <div className="pb-2 text-xs flex items-center justify-center">
              copylight&copy;2022 <img className="w-28" src={logo} alt="" />
            </div>
          </nav>
        </div>
      );
    }
  };

  const footerMenu = () => {
    if (signIn && path && id === '') {
      return (
        <div className="container mx-auto text-center text-white">
          <h1 className="pt-14">
            <img src={logo} className="cursor-pointer mx-auto w-64" />
          </h1>
          <nav className="mx-auto text-center">
            <div className="pb-2 text-xs flex items-center justify-center">
              copylight&copy;2022 <img className="w-28" src={logo} alt="" />
            </div>
          </nav>
        </div>
      );
    } else {
      return (
        <div className="container mx-auto text-center text-white">
          <h1 className="pt-14">
            <img src={logo} className="cursor-pointer mx-auto w-64" />
          </h1>
          <nav className="mx-auto text-center">
            <ul className="flex items-center text-center justify-center">
              <li className="px-2" onClick={() => history.push('/terms')}>
                <span className={styles.cp_link}>
                  <LibraryBooksIcon />
                  <button className="bg-transparent py-1 mr-2 rounded-lg">
                    利用規約
                  </button>
                </span>
              </li>
              <li className="px-2" onClick={() => history.push('/privacy')}>
                <span className={styles.cp_link}>
                  <LockIcon />
                  <button className="bg-transparent py-1 mr-2 rounded-lg">
                    プライバシーポリシー
                  </button>
                </span>
              </li>
              <li className="px-2" onClick={() => history.push('/contact')}>
                <span className={styles.cp_link}>
                  <ContactMailIcon />
                  <button className="bg-transparent py-1 mr-2 rounded-lg">
                    お問い合わせ
                  </button>
                </span>
              </li>
            </ul>
            <div className="pb-2 text-xs flex items-center justify-center">
              copylight&copy;2022 <img className="w-28" src={logo} alt="" />
            </div>
          </nav>
        </div>
      );
    }
  };

  return (
    <footer className="bg-thin-black">
      {isWide ? footerMenuSm() : footerMenu()}
    </footer>
  );
};

export default Footer;

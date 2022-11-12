import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import logo from '../../assets/logo.png';
import { useHistory, useLocation } from 'react-router-dom';
import HeaderMenus from './HeaderMenus';
import useMedia from 'use-media';
import DrawerMenu from './DrawerMenu';
import { useSelector } from 'react-redux';
import { selectIsSignIn } from '../../features/auth/authSlice';
import NotifyMenu from './NotifyMenu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    toolbar: {
      margin: '0 auto',
      maxWidth: 1280,
      width: '100%',
    },
    menuBar: {
      backgroundColor: '#fbb950',
    },
    iconButtons: {
      margin: '0 0 0 auto',
    },
  })
);

const Header: React.VFC = () => {
  const classes = useStyles();
  const signIn = useSelector(selectIsSignIn);
  const history = useHistory();
  const location = useLocation();
  const isWide = useMedia({ maxWidth: '768px' });

  let id = window.location.pathname.split('/profile')[1];
  if (id !== '') {
    id = id?.split('/')[1];
  }
  const path = location.pathname.includes('/profile');

  const pageTransition = () => {
    if (
      location.pathname.includes('/home') ||
      location.pathname.includes('/mypage') ||
      location.pathname.includes('/accountBook/list') ||
      location.pathname.includes('/accountBook/detail') ||
      location.pathname.includes('/accountBook/regist')
    ) {
      history.push('/home');
    } else if (location.pathname.includes('/profile')) {
      return null;
    } else if (signIn) {
      history.push('/home');
    } else if (!signIn) {
      history.push('/');
    }
  };

  const headerMenu = () => {
    if (isWide && path && id === '') {
      return <></>;
    } else if (isWide && signIn) {
      return (
        <div className="flex items-center">
          <NotifyMenu />
          <DrawerMenu />
        </div>
      );
    } else if (isWide) {
      return <DrawerMenu />;
    } else {
      return <HeaderMenus />;
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.menuBar}>
        <Toolbar className={classes.toolbar}>
          <h1 onClick={pageTransition}>
            <img src={logo} className="cursor-pointer w-32 md:w-40" />
          </h1>
          <div className={classes.iconButtons}>
            {headerMenu()}
            {/* {isWide ? <DrawerMenu /> : <HeaderMenus />} */}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;

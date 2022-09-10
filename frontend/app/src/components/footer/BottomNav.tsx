import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { useHistory } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile, selectProfile } from '../../features/auth/authSlice';
import { useCookies } from 'react-cookie';
import { FaCrown } from 'react-icons/fa';
import { FaListAlt } from 'react-icons/fa';
import { AiFillFileAdd } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';

const useStyles = makeStyles({
  root: {
    width: '100%',
    background: '#434343',
    position: 'fixed',
    bottom: 0,
  },
  nav: {
    color: '#fff',
  },
});

const BottomNav: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const profile = useSelector(selectProfile);
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    dispatch(getMyProfile(cookies));
  }, []);

  const handleClickHome = () => {
    history.push('/home');
  };
  const handleClickSearch = () => {
    history.push('/accountBook/list');
  };
  const handleClickPost = () => {
    history.push('/accountBook/regist');
  };
  const handleClickMyPage = () => {
    history.push('/mypage');
  };

  return (
    <footer>
      <BottomNavigation showLabels className={classes.root}>
        <BottomNavigationAction
          className={classes.nav}
          label="ランキング"
          icon={<FaCrown className="text-lg mb-1 mt-1" />}
          onClick={handleClickHome}
        />
        <BottomNavigationAction
          className={classes.nav}
          label="家計簿一覧"
          icon={<FaListAlt className="text-lg mb-1 mt-1" />}
          onClick={handleClickSearch}
        />
        <BottomNavigationAction
          className={classes.nav}
          label="家計簿登録"
          icon={<AiFillFileAdd className="text-lg mb-1 mt-1" />}
          onClick={handleClickPost}
        />
        <BottomNavigationAction
          className={classes.nav}
          label="マイページ"
          icon={<FaUserCircle className="text-lg mb-1 mt-1" />}
          onClick={handleClickMyPage}
        />
      </BottomNavigation>
    </footer>
  );
};

export default BottomNav;

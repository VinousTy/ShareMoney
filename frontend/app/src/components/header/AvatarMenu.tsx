import React, { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import {
  editMessage,
  isSignOut,
  isSuccessOrFailure,
  selectProfile,
} from '../../features/auth/authSlice';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import { FaCrown } from 'react-icons/fa';
import { AiFillFileAdd } from 'react-icons/ai';
import { BsBookmarkFill } from 'react-icons/bs';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    arrowIcon: {
      fontSize: '28px',
    },
    dropdown: {
      position: 'absolute',
      top: 75,
      right: -30,
      width: '150px',
      zIndex: 1,
      border: '1px solid',
    },
  })
);

interface PROPS {
  pass: string;
}

const AvatarMenu: React.FC<PROPS> = (props) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const [tooltip, setTooltip] = useState(false);
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies();
  const history = useHistory();

  let id = window.location.pathname.split('/profile')[1];
  if (id !== '') {
    id = id?.split('/')[1];
  }
  const path = location.pathname.includes('/profile');

  const handleTooltipClose = useCallback(() => {
    setTooltip(false);
  }, [setTooltip, tooltip]);

  const handleTooltipToggle = useCallback(() => {
    setTooltip(!tooltip);
  }, [setTooltip, tooltip]);

  const pageTransition = (pass: string) => {
    if (profile === undefined) {
      alert('プロフィールの登録を行ってください');
      setTooltip(!tooltip);
    } else {
      history.push(`/${pass}`);
      setTooltip(!tooltip);
    }
  };

  const logout = async () => {
    await dispatch(isSignOut());
    await removeCookie('Bearer');
    await dispatch(editMessage('ログアウトしました'));
    await dispatch(isSuccessOrFailure(true));
    await history.push('/signin');
  };

  const avatarMenu = () => {
    if (path && id === '') {
      return <></>;
    } else {
      return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <div className={`${classes.root} pt-4 cursor-pointer`}>
            <div className="flex items-center" onClick={handleTooltipToggle}>
              <Avatar alt="who?" src={profile?.img} />
              <ArrowDropDownIcon className={classes.arrowIcon} />
            </div>
            <ul
              className={`${
                tooltip ? 'opacity-100 visible' : 'opacity-0 invisible'
              } z-50 absolute w-48 top-16 right-0 bg-header-menu py-2 px-4 text-gray-600 rounded-xl shadow-xl leading-6 transition`}
            >
              <li className="leading-6 border-b border-gray-300 my-2">
                <span
                  className="hover:text-button-color-orange-hover transition"
                  onClick={() => pageTransition('mypage')}
                >
                  <HomeIcon />
                  マイページ
                </span>
              </li>
              <li className="leading-6 border-b border-gray-300 my-2">
                <span
                  className="hover:text-button-color-orange-hover transition flex items-center"
                  onClick={() => pageTransition('accountBook/regist')}
                >
                  <AiFillFileAdd />
                  <span>家計簿追加</span>
                </span>
              </li>
              <li className="leading-6 border-b border-gray-300 my-2">
                <span
                  className="hover:text-button-color-orange-hover transition"
                  onClick={() => pageTransition('accountBook/list')}
                >
                  <SearchIcon />
                  一覧
                </span>
              </li>
              <li className="leading-6 border-b border-gray-300 my-2">
                <span
                  className="hover:text-button-color-orange-hover transition flex items-center"
                  onClick={() => pageTransition('home')}
                >
                  <FaCrown />
                  <span>ランキング</span>
                </span>
              </li>
              <li className="leading-6 border-b border-gray-300 my-2">
                <span
                  className="hover:text-button-color-orange-hover transition flex items-center"
                  onClick={() => pageTransition('bookmark/accountBook/list')}
                >
                  <BsBookmarkFill />
                  <span>保存した家計簿</span>
                </span>
              </li>
              <li className="leading-6 border-b border-gray-300 my-2">
                <span
                  className="hover:text-button-color-orange-hover transition"
                  onClick={() => logout()}
                >
                  <ExitToAppIcon />
                  ログアウト
                </span>
              </li>
            </ul>
          </div>
        </ClickAwayListener>
      );
    }
  };

  return <>{avatarMenu()}</>;
};

export default AvatarMenu;

import React from 'react';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  editMessage,
  isSignIn,
  isSuccessOrFailure,
  selectIsSignIn,
} from '../../features/auth/authSlice';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { AppDispatch } from '../../app/store';
import AvatarMenu from './AvatarMenu';

const guestPassword = String(process.env.REACT_APP_GUEST_PASSWORD);
const apiUrl = process.env.REACT_APP_DEV_API_URL;

const HeaderMenus: React.VFC = () => {
  const dispatch: AppDispatch = useDispatch();
  const signIn = useSelector(selectIsSignIn);
  const history = useHistory();
  const location = useLocation();
  const [cookies, setCookie] = useCookies();

  const guestLogin = async () => {
    const auth = {
      email: 'guest@example.com',
      password: guestPassword,
    };
    await axios
      .post(
        `${apiUrl}api/login`,
        {
          email: auth.email,
          password: auth.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        setCookie('Bearer', res.data.access_token);
        dispatch(isSignIn());
        dispatch(isSuccessOrFailure(true));
        dispatch(editMessage('ゲストユーザーとしてログインしました'));
        history.push('/mypage');
      })
      .catch((e) => {
        console.log(e);
        alert('ログインに失敗しました。時間をおいてから再度お試しください。');
      });
  };

  const headerMenu = () => {
    if (signIn && location.pathname.includes('/profile')) {
      return (
        <li>
          <AvatarMenu pass={'profile'} />
        </li>
      );
    } else if (signIn) {
      return (
        <li>
          <AvatarMenu pass="" />
        </li>
      );
    } else {
      return (
        <>
          <li
            onClick={() => history.push('/signup')}
            className="flex items-center hover:bg-white hover:text-button-color-orange rounded-lg transition px-4"
          >
            <PersonAddIcon />
            <button className="bg-transparent py-1 mr-2 rounded-lg">
              新規登録
            </button>
          </li>
          <li
            onClick={() => history.push('/signin')}
            className="flex items-center hover:bg-white hover:text-button-color-orange rounded-lg transition px-4"
          >
            <ExitToAppIcon />
            <button className="bg-transparent py-1 mr-2 rounded-lg">
              ログイン
            </button>
          </li>
          <li
            className="flex items-center hover:bg-white hover:text-button-color-orange rounded-lg transition px-4"
            onClick={() => guestLogin()}
          >
            <AccountCircleIcon />
            <button className="bg-transparent py-1 mr-2 rounded-lg">
              ゲストログイン
            </button>
          </li>
        </>
      );
    }
  };

  return <ul className="flex">{headerMenu()}</ul>;
};

export default HeaderMenus;

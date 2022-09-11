import React, { useState } from 'react';
import styles from './Auth.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Alert from '../../components/message/alert/Alert';
import { AppDispatch } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  editMessage,
  isSignIn,
  isSuccessOrFailure,
  selectMessage,
} from '../../features/auth/authSlice';
import signin from '../../assets/login_bro.png';
import useMedia from 'use-media';
import FlashMessage from '../../components/message/flashMessage/FlashMessage';

interface INPUTS {
  email: string;
  password: string;
  confirm_password: string;
}

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const SignIn: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const message = useSelector(selectMessage);
  const history = useHistory();
  const [loginError, setLoginError] = useState(false);
  const [cookies, setCookie] = useCookies();
  const isWide = useMedia({ maxWidth: '768px' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INPUTS>();

  const onSubmit: SubmitHandler<INPUTS> = async (data) => {
    const res = await axios
      .post(
        `${apiUrl}api/login`,
        {
          email: data.email,
          password: data.password,
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
        dispatch(editMessage(res.data.message));
        history.push('/mypage');
      })
      .catch((e) => {
        setLoginError(true);
      });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {message == 'パスワードの変更が完了しました' && <FlashMessage />}
      {message == 'パスワードの変更に失敗しました' && <FlashMessage />}
      {message == 'ログアウトしました' && <FlashMessage />}
      <div className="w-10/12 md:w-11/12 md:flex bg-white shadow-2xl my-24 mx-auto rounded-3xl lg:w-10/12">
        <div className="mx-auto md:w-7/12 lg:w-6/12 py-8">
          <div className="text-center text-white h-auto rounded">
            <h2
              className="mb-10 text-black text-xl font-bold lg:pt-14"
              data-testid="title"
            >
              ログイン
            </h2>
            {isWide && (
              <div>
                <img
                  className="sm:w-8/12 md:w-11/12 lg:w-10/12 mx-auto"
                  src={signin}
                  alt="ログイン画面へようこそ"
                />
                <a
                  className={`${
                    isWide && styles.source
                  } text-gray-500 md:text-story-set md:text-sm`}
                  href="https://storyset.com/user"
                >
                  User illustrations by Storyset
                </a>
              </div>
            )}
            {loginError && (
              <Alert
                title={'ログインエラー'}
                message={
                  'メールアドレス、またはパスワードが間違っています。再度入力してください。'
                }
              />
            )}
            <div className="mb-4">
              <div className="sm:ml-16 mt-8 text-left mb-1 pl-1 ml-9 text-gray-700 md:ml-14 md:mt-0">
                <label htmlFor="email" data-testid="label-email">
                  メールアドレス
                </label>
              </div>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-9/12 py-2 px-3 mb-5"
                id="email"
                data-testid="input-email"
                type="text"
                placeholder="例) info@example.com"
                {...register('email', {
                  required: {
                    value: true,
                    message: '※メールアドレスの入力は必須です',
                  },
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: 'メールアドレスの形式が不正です',
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <div className="sm:ml-16 text-left text-gray-700 ml-9 md:ml-14 mb-1 pl-1">
                <label htmlFor="password" data-testid="label-password">
                  パスワード
                </label>
              </div>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-9/12 py-2 px-3 mb-5"
                id="password"
                data-testid="input-password"
                type="password"
                placeholder="8文字以上で入力してください"
                {...register('password', {
                  required: {
                    value: true,
                    message: '※パスワードの入力は必須です',
                  },
                  minLength: {
                    value: 8,
                    message: 'パスワードは8文字以上で入力してください',
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs italic" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <button
                type="submit"
                className="px-20 py-2.5 relative rounded group font-medium text-white inline-block"
                data-testid="button-signin"
              >
                <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-button-color-orange-hover to-yellow-200"></span>
                <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-button-color-orange-hover to-yellow-200"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-button-color-orange-hover to-yellow-200"></span>
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-button-color-orange-hover from-yellow-200"></span>
                <span className="relative">ログイン</span>
              </button>
            </div>
            <div className={styles.separation}>または</div>
            <div className="mt-6 mb-6">
              <div>
                <button
                  type="button"
                  className={`${styles.google_btn} w-10/12 sm:w-8/12 md:w-11/12 lg:w-9/12 bg-secondary hover:bg-red-800 transition-all mt-5 mb-5 text-white font-bold py-2 px-4 rounded`}
                  data-testid="google-signin-button"
                >
                  <span className="flex justify-center font-normal sm:justify-center md:justify-center lg:justify-center">
                    <BsGoogle className="mt-1 mr-2 sm:mr-4 lg:mr-3" />
                    <a href="#">Googleアカウントでログイン</a>
                  </span>
                </button>
              </div>
            </div>
            <div
              className="mb-6"
              onClick={() =>
                alert(
                  '現在ツイッター認証は行えません。別のログイン方法をお試しください。'
                )
              }
            ></div>
            <div className="mb-6 pb-6">
              <p
                className="text-blue-400 underline ... cursor-pointer hover:text-red-500 transition-all"
                onClick={() => history.push('/reset')}
              >
                パスワードを忘れた方はこちら
              </p>
            </div>
          </div>
        </div>
        {!isWide && (
          <div className="w-8/12 bg-orange pt-28 rounded-r-3xl text-center">
            <img
              className="md:w-11/12 lg:w-10/12 mx-auto"
              src={signin}
              alt="ログイン画面へようこそ"
              data-testid="img"
            />
            <a
              className="text-story-set text-xs"
              href="https://storyset.com/user"
            >
              User illustrations by Storyset
            </a>
          </div>
        )}
      </div>
    </form>
  );
};

export default SignIn;

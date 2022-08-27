import React from 'react';
import styles from './Auth.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import {
  postEmail,
  selectIsEmail,
  selectIsNotEmail,
} from '../../features/auth/authSlice';

interface INPUTS {
  email: string;
}

const EmailPost: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isEmail = useSelector(selectIsEmail);
  const isNotEmail = useSelector(selectIsNotEmail);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INPUTS>();

  const onSubmit: SubmitHandler<INPUTS> = async (data) => {
    await dispatch(postEmail(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.container}>
        <div className="w-10/12 mt-10 mb-10 md:w-4/12 mx-auto pt-14 text-center text-white h-auto bg-white rounded">
          <h2
            className="mb-10 text-xl font-bold text-black"
            data-testid="title"
          >
            パスワード再設定
          </h2>
          <div className="w-9/12 mx-auto mb-8 text-black">
            <p>
              ご利用中のメールアドレスを入力してください。パスワード再設定のためのURLをお送り致します。
            </p>
          </div>
          <div className="mb-4">
            <div className="text-left ml-9 text-gray-700 md:ml-14 mb-1 pl-1">
              メールアドレス
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
            {isEmail && (
              <p className="text-green text-xs italic" data-testid="success">
                入力されたメールアドレス宛にメールを送信しました。
              </p>
            )}
            {isNotEmail && (
              <p className="text-red-500 text-xs italic" role="alert">
                入力されたメールアドレスは登録されていません。
              </p>
            )}
          </div>
          <div className="mb-6 pb-8">
            <button
              type="submit"
              className="px-20 py-2.5 relative rounded group font-medium text-white inline-block"
              data-testid="button-submit"
            >
              <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-button-color-orange-hover to-yellow-200"></span>
              <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-button-color-orange-hover to-yellow-200"></span>
              <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-button-color-orange-hover to-yellow-200"></span>
              <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-button-color-orange-hover from-yellow-200"></span>
              <span className="relative">送信</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EmailPost;

import React from 'react';
import styles from './Auth.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import { newPassword } from '../../features/auth/authSlice';

interface INPUTS {
  password: string;
  confirm_password: string;
}

const PasswordReset: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const search = useLocation().search;
  const history = useHistory();

  const query = new URLSearchParams(search);
  const query_token = query.get('token');
  const query_email = query.get('email');

  const {
    register,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INPUTS>();

  const onSubmit: SubmitHandler<INPUTS> = async (data) => {
    const packetPassword = {
      email: query_email,
      password: data.password,
      token: query_token,
    };
    await dispatch(newPassword(packetPassword));
    reset();
    await history.push('/signin');
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
              新しいパスワードを入力して「パスワード再設定」をクリックしてください。
            </p>
          </div>
          <div className="mb-6">
            <div className="text-left ml-9 md:ml-14 mb-1 pl-1 text-gray-700">
              新パスワード
            </div>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-9/12 py-2 px-3 mb-5"
              id="password"
              type="password"
              data-testid="input-password"
              placeholder="新しいパスワードを入力"
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
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <div className="text-left ml-9 md:ml-14 mb-1 pl-1 text-gray-700">
              パスワード再入力
            </div>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-9/12 py-2 px-3 mb-5"
              id="confirm_password"
              type="password"
              data-testid="input-confirm-password"
              placeholder="パスワード再入力"
              {...register('confirm_password', {
                required: {
                  value: true,
                  message: '※パスワードの入力は必須です',
                },
                minLength: {
                  value: 8,
                  message: 'パスワードは8文字以上で入力してください',
                },
                validate: {
                  match: (value) =>
                    value === getValues('password') ||
                    'パスワードが一致しません。もう一度入力してください。',
                },
              })}
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-xs italic" role="alert">
                {errors.confirm_password.message}
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

export default PasswordReset;

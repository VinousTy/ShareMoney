import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { init, send } from 'emailjs-com';
import contact from '../../assets/contact_bro.png';
import useMedia from 'use-media';

interface INPUTS {
  name: string;
  email: string;
  message: string;
}

const userID = process.env.REACT_APP_USER_ID;
const serviceID = process.env.REACT_APP_SERVICE_ID;
const templateID = process.env.REACT_APP_TEMPLATE_ID;

const Contact: React.FC = () => {
  const [postMail, setPostMail] = useState(false);
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [message, setMessage] = useState('');
  const isWide = useMedia({ maxWidth: '768px' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INPUTS>();

  const sendMail = () => {
    if (
      userID !== undefined &&
      serviceID !== undefined &&
      templateID !== undefined
    ) {
      init(userID);

      const template_param = {
        from_name: name,
        from_email: mail,
        message: message,
      };
      send(serviceID, templateID, template_param).then(() => {
        setPostMail(true);
      });
    }
  };

  const onSubmit: SubmitHandler<INPUTS> = async (data) => {
    await sendMail();
    await reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-10/12 md:w-11/12 md:flex bg-white shadow-2xl my-24 mx-auto rounded-3xl lg:w-10/12">
        <div className="mx-auto md:w-7/12 lg:w-6/12 py-8">
          <div className="text-center text-white h-auto rounded">
            <h2
              className="mb-10 text-black text-xl font-bold lg:pt-14"
              data-testid="title"
            >
              お問い合わせ
            </h2>
            {isWide && (
              <div>
                <img
                  className="sm:w-8/12 md:w-11/12 lg:w-10/12 mx-auto"
                  src={contact}
                  alt="お問い合わせ画面"
                />
                <a
                  className={`${
                    isWide && 'text-xs'
                  } text-gray-500 md:text-story-set md:text-sm`}
                  href="https://storyset.com/work"
                >
                  Work illustrations by Storyset
                </a>
              </div>
            )}
            <div className="mb-4">
              <div className="sm:ml-16 mt-8 text-left mb-1 pl-1 ml-9 text-gray-700 md:ml-14 md:mt-0">
                <label htmlFor="name" data-testid="label-email">
                  お名前
                </label>
              </div>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-9/12 py-2 px-3 mb-5"
                id="name"
                data-testid="input-name"
                type="text"
                placeholder="例) 山田 太郎"
                {...register('name', {
                  required: {
                    value: true,
                    message: '※お名前の入力は必須です',
                  },
                })}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs italic">
                  {errors.name.message}
                </p>
              )}
            </div>
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
              <div className="sm:ml-16 mt-8 text-left mb-1 pl-1 ml-9 text-gray-700 md:ml-14 md:mt-0">
                お問い合わせ内容
              </div>
              <textarea
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-9/12 py-2 px-3 mb-5"
                id="message"
                data-testid="input-message"
                rows={6}
                placeholder="ご不明点やご要望などを記載してください。"
                {...register('message', {
                  required: {
                    value: true,
                    message: '※お問い合わせ内容の入力は必須です。',
                  },
                })}
                onChange={(e) => setMessage(e.target.value)}
              />
              {errors.message && (
                <p className="text-red-500 text-xs italic" role="alert">
                  {errors.message.message}
                </p>
              )}
              {postMail && (
                <p className="text-green text-xs italic" role="alert">
                  問合せ窓口ににメールを送信しました。
                </p>
              )}
            </div>
            <div className="mb-6">
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
        {!isWide && (
          <div className="w-8/12 bg-orange pt-28 rounded-r-3xl text-center">
            <img
              className="md:w-11/12 lg:w-10/12 mx-auto"
              src={contact}
              alt="問合せ画面"
              data-testid="img"
            />
            <a
              className="text-story-set text-sm"
              href="https://storyset.com/work"
            >
              Work illustrations by Storyset
            </a>
          </div>
        )}
      </div>
    </form>
  );
};

export default Contact;

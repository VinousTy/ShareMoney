import React from 'react';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import useMedia from 'use-media';
import error_image from '../../assets/404_error_bro.png';

const Error: React.VFC = () => {
  const history = useHistory();
  const isWide = useMedia({ maxWidth: '768px' });

  return (
    <div className="w-10/12 md:w-11/12 md:flex md:items-center bg-white shadow-2xl my-24 mx-auto rounded-3xl lg:w-10/12">
      <div className="text-center lg:ml-4">
        {isWide && (
          <div>
            <img
              className="sm:w-8/12 md:w-11/12 lg:w-10/12 mx-auto"
              src={error_image}
              alt="ログイン画面へようこそ"
            />
            <a
              className="text-gray-400 text-xs"
              href="https://storyset.com/user"
            >
              User illustrations by Storyset
            </a>
          </div>
        )}
        {isWide ? (
          <h2 className="text-4xl text-left inline-block py-10 font-serif">
            Page Not Found
          </h2>
        ) : (
          <h2 className="text-3xl pt-28 md:text-5xl lg:text-6xl text-left inline-block pb-10 font-serif">
            Page
            <br />
            Not Found
          </h2>
        )}

        <p className="text-gray-700 pb-1">
          お探しのページは見つかりませんでした。
        </p>
        <p className="text-gray-700 pb-1">
          URLが間違っている可能性がございます。
        </p>
        <p className="text-gray-700">下記リンクからお戻りください。</p>
        <div
          className={`${
            isWide
              ? 'flex items-center justify-center mt-6 pb-10'
              : 'flex items-center justify-center mt-10 pb-10'
          }`}
        >
          <BsFillArrowRightCircleFill />
          <p
            className="text-blue-600 underline ... cursor-pointer hover:text-red-500 transition-all pl-2"
            onClick={() => history.push('/mypage')}
          >
            マイページへ
          </p>
        </div>
      </div>
      {!isWide && (
        <div className="w-8/12 rounded-r-3xl text-center">
          <img
            src={error_image}
            alt="404 NotFound"
            className="md:w-11/12 lg:w-10/12 mx-auto"
          />
          <a
            href="https://storyset.com/online"
            className="text-xs text-gray-400"
          >
            Online illustrations by Storyset
          </a>
        </div>
      )}
    </div>
  );
};

export default Error;

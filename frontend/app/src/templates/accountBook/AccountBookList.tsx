import React, { useEffect, useState } from 'react';
import styles from './AccountBookList.module.scss';
import { AppDispatch } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfiles,
  getUser,
  isSignIn,
  selectMessage,
} from '../../features/auth/authSlice';
import {
  getAccountBookList,
  selectAccountBookMessage,
  selectAccountBooks,
} from '../../features/accountBook/accountBookSlice';
import {
  isLoadingEnd,
  isLoadingStart,
  selectIsLoading,
} from '../../features/layout/layoutSlice';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import { FiFilter } from 'react-icons/fi';
import { FaListAlt } from 'react-icons/fa';
import { ImSearch } from 'react-icons/im';
import AccountBookCard from '../../components/householdBookList/AccountBookCard';
import FlashMessage from '../../components/message/flashMessage/FlashMessage';
import Loading from '../../components/loading/Loading';

interface NAME {
  name: string;
}

const AccountBookList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [name, setName] = useState('');
  const accountBooks = useSelector(selectAccountBooks),
    isLoading = useSelector(selectIsLoading),
    authMessage = useSelector(selectMessage),
    accountBookMessage = useSelector(selectAccountBookMessage);
  const history = useHistory();
  const [cookies] = useCookies();

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NAME>();

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (cookies) {
        await dispatch(isLoadingStart());
        await dispatch(getProfiles(cookies));
        await dispatch(getProfiles(cookies));
        await dispatch(isSignIn());
        await dispatch(getUser(cookies));
        await dispatch(getAccountBookList(cookies));
      }
      await dispatch(isLoadingEnd());
    };
    fetchBootLoader();
  }, [dispatch, history]);

  return (
    <>
      {authMessage !== '' && <FlashMessage />}
      {accountBookMessage !== '' && <FlashMessage />}
      {isLoading ? (
        <div className="h-screen">
          <Loading title={'Loading...'} />
        </div>
      ) : (
        <div
          className={`pb-20 ${
            accountBooks.accountBook?.length === 0 && 'h-screen'
          }`}
        >
          <h2 className="text-gray-800 text-left text-2xl font-bold ml-8 mt-8">
            <span className="flex items-center">
              <FaListAlt className="text-orange" />
              <span>家計簿一覧</span>
            </span>
          </h2>
          <form
            className={`${styles.search_container} bg-gray-50 w-10/12 md:w-7/12`}
          >
            <input
              type="text"
              value={name}
              placeholder="ユーザー名検索"
              onChange={(e) => setName(e.target.value)}
              data-testid="search-input"
            />
            <ImSearch type="submit" className={styles.serach_icon} />
          </form>
          <div className="m-3">
            <button
              className="w-20 h-20 shadow-lg bg-button-color-orange text-white rounded-full hover:bg-button-color-orange-hover transition-all border-button-color-orange-shadow fixed bottom-24 right-8 text-center md:right-16"
              data-testid="search-button"
            >
              <span className="text-center">
                <FiFilter className="text-center text-lg mx-auto" />
              </span>
              <span>絞り込み</span>
            </button>
          </div>
          <div className={`${styles.flex_container} mx-4`}>
            {accountBooks.accountBook?.length === 0 ? (
              <div className="mt-4 text-center mx-auto">
                <h5 className="text-center mx-auto">
                  検索したユーザーは存在しません
                </h5>
              </div>
            ) : (
              <div
                className={`${styles.flex_container} md:flex md:flex-wrap md:justify-around`}
              >
                {accountBooks.accountBook
                  ?.slice(0)
                  .reverse()
                  .map((book, index) => (
                    <AccountBookCard
                      key={book.id}
                      id={book.id}
                      likes={book.likes}
                      bookmarks={book.bookmarks}
                      date={book.date}
                      costs={accountBooks.costs}
                      income={book.monthly_income}
                      user_id={book.user_id}
                      index={index}
                      icon={false}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AccountBookList;

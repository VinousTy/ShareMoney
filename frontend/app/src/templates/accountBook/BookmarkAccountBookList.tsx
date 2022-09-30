import React, { useEffect } from 'react';
import styles from './AccountBookList.module.scss';
import { AppDispatch } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyProfile,
  getProfiles,
  getUser,
  isSignIn,
} from '../../features/auth/authSlice';
import {
  getBookmarkAccountBook,
  selectAccountBooks,
} from '../../features/accountBook/accountBookSlice';
import { useCookies } from 'react-cookie';
import { BsBookmarkFill } from 'react-icons/bs';
import AccountBookCard from '../../components/householdBookList/AccountBookCard';
import SearchModal from '../../components/modals/SearchModal';
import {
  isLoadingEnd,
  isLoadingStart,
  selectIsLoading,
} from '../../features/layout/layoutSlice';
import Loading from '../../components/loading/Loading';

const BookmarkAccountBookList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const accountBooks = useSelector(selectAccountBooks),
    isLoading = useSelector(selectIsLoading);
  const [cookies] = useCookies();

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(isLoadingStart());
      await dispatch(isSignIn());
      await dispatch(getUser(cookies));
      await dispatch(getMyProfile(cookies));
      await dispatch(getBookmarkAccountBook(cookies));
      await dispatch(getProfiles(cookies));
      await dispatch(isLoadingEnd());
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <div className="h-screen">
          <Loading title="Loading..." />
        </div>
      ) : (
        <div
          className={`pb-20 ${
            accountBooks.accountBook?.length === 0 && 'h-screen'
          }`}
        >
          <h2 className="text-gray-800 text-left text-2xl font-bold ml-8 mt-8">
            <span
              className={`flex items-center ${
                accountBooks.accountBook?.length === 0 && 'justify-center mr-10'
              }`}
            >
              <BsBookmarkFill className="text-green" />
              <span>保存した家計簿一覧</span>
            </span>
          </h2>
          <div
            className={`${
              accountBooks.accountBook?.length === 0 ? 'text-center' : 'ml-12'
            }`}
          >
            <span className="text-gray-800 text-lg font-bold">
              &#40;他のユーザーからは見られません&#41;
            </span>
          </div>
          {accountBooks.accountBook?.length === 0 && (
            <div className="text-center mt-10 text-lg">
              保存した家計簿はありません
            </div>
          )}
          <SearchModal />
          <div className={`${styles.flex_container} mx-4`}>
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
          </div>
        </div>
      )}
    </>
  );
};

export default BookmarkAccountBookList;

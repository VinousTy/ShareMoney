import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import {
  getMyProfile,
  getProfiles,
  isSignIn,
  selectProfile,
} from '../../features/auth/authSlice';
import {
  getAccountBookList,
  recomendAccountBookList,
  selectAccountBooks,
  selectRecomendAccountBooks,
} from '../../features/accountBook/accountBookSlice';
import AccountBookCard from '../../components/householdBookList/AccountBookCard';
import { useCookies } from 'react-cookie';
import { AiFillStar } from 'react-icons/ai';
import { FaCrown } from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import clsx from 'clsx';
import useMedia from 'use-media';
import {
  isLoadingEnd,
  isLoadingStart,
  selectIsLoading,
} from '../../features/layout/layoutSlice';
import Loading from '../../components/loading/Loading';

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const accountBooks = useSelector(selectAccountBooks),
    profile = useSelector(selectProfile),
    isLoading = useSelector(selectIsLoading);
  const recomendAccountBooks = useSelector(selectRecomendAccountBooks);
  const [cookies] = useCookies();
  const isWide = useMedia({ maxWidth: '768px' });

  const postRank = accountBooks.accountBook?.filter((book) => {
    if (book.likes.length) {
      return book;
    }
  });

  const sort = postRank?.sort(function (a, b) {
    return b.likes.length - a.likes.length;
  });

  const random = Math.floor(
    Math.random() * (recomendAccountBooks.accountBook?.length - 5)
  );

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(isLoadingStart());
      if (cookies) {
        await dispatch(getMyProfile(cookies));
        await dispatch(getProfiles(cookies));
        await dispatch(getAccountBookList(cookies));
        await dispatch(isSignIn());
      }
      await dispatch(isLoadingEnd());
    };
    fetchBootLoader();
  }, [dispatch]);

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(
        recomendAccountBookList({
          name: profile.name,
          job: profile.job,
          income: profile.income,
          composition: profile.composition,
          cookie: cookies,
        })
      );
    };
    fetchBootLoader();
  }, [profile]);

  return (
    <>
      {isLoading ? (
        <div className="h-screen">
          <Loading title={'Loading...'} />
        </div>
      ) : (
        <div className="pb-20">
          {isWide ? (
            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
              className="text-center mx-auto mt-10"
            >
              <TabList className="mb-7 flex">
                <Tab className="bg-transparent cursor-pointer w-22 mx-auto">
                  <div
                    className={clsx([
                      tabIndex === 0
                        ? 'text-black font-bold border-b-2 border-orange'
                        : 'text-disabled text-silver opacity-70',
                    ])}
                    data-testid="post-title"
                  >
                    ランキング
                  </div>
                </Tab>
                <Tab className="bg-transparent cursor-pointer w-22 mx-auto">
                  <div
                    className={clsx([
                      tabIndex === 1
                        ? 'text-black font-bold border-b-2 border-orange'
                        : 'text-disabled text-silver opacity-70',
                    ])}
                    data-testid="bookmark-title"
                  >
                    おすすめ
                  </div>
                </Tab>
              </TabList>
              <TabPanel>
                <div>
                  <h2 className="text-gray-800 text-left text-2xl font-bold ml-8 mt-8">
                    <span className="flex items-center">
                      <FaCrown className="text-gold" />
                      <span>人気ランキング</span>
                    </span>
                  </h2>
                  <p className="text-left text-gray ml-8 mt-1">
                    今みんなに「いいね」されている人気の家計簿
                  </p>
                  <div
                    className={`${styles.wrap} md:flex mx-4 md:justify-between md:overflow-x-scroll`}
                  >
                    {sort?.slice(0, 5).map((book, index) => (
                      <React.Fragment key={book.id}>
                        <AccountBookCard
                          id={book.id}
                          date={book.date}
                          user_id={book.user_id}
                          income={book.monthly_income}
                          likes={book.likes}
                          bookmarks={book.bookmarks}
                          costs={accountBooks.costs}
                          index={index}
                          icon={true}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div>
                  <h2 className="text-gray-800 text-left text-2xl font-bold ml-8 mt-8">
                    <span className="flex items-center">
                      <AiFillStar className="text-yellow-300" />
                      <span>あなたへのおすすめ</span>
                    </span>
                  </h2>
                  <p className="text-left text-gray ml-8 mt-1">
                    あなたと似たプロフィールの家計簿
                  </p>
                  <div
                    className={`${styles.wrap} md:flex mx-4 md:justify-between md:overflow-x-scroll`}
                  >
                    {recomendAccountBooks.accountBook
                      ?.slice(random, random + 5)
                      .map((book, index) => (
                        <React.Fragment key={book.id}>
                          <AccountBookCard
                            id={book.id}
                            date={book.date}
                            user_id={book.user_id}
                            income={book.monthly_income}
                            likes={book.likes}
                            bookmarks={book.bookmarks}
                            costs={recomendAccountBooks.costs}
                            index={index}
                            icon={false}
                          />
                        </React.Fragment>
                      ))}
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          ) : (
            <div>
              <div className="border bg-header-menu shadow-2xl rounded-xl mt-16 mx-4 pb-10">
                <h2 className="text-gray-800 text-left text-2xl font-bold ml-8 mt-8">
                  <span className="flex items-center">
                    <AiFillStar className="text-yellow-400" />
                    <span data-testid="title">あなたへのおすすめ</span>
                  </span>
                </h2>
                <p className="text-left text-gray ml-8 mt-1">
                  あなたと似たプロフィールの家計簿
                </p>
                <div
                  className={`${styles.wrap} md:flex mx-4 md:justify-between md:overflow-x-scroll`}
                >
                  {recomendAccountBooks.accountBook
                    ?.slice(random, random + 5)
                    .map((book, index) => (
                      <React.Fragment key={book.id}>
                        <AccountBookCard
                          id={book.id}
                          date={book.date}
                          user_id={book.user_id}
                          income={book.monthly_income}
                          likes={book.likes}
                          bookmarks={book.bookmarks}
                          costs={recomendAccountBooks.costs}
                          index={index}
                          icon={false}
                        />
                      </React.Fragment>
                    ))}
                </div>
              </div>
              <div className="border bg-header-menu shadow-2xl rounded-xl mt-16 mx-4 pb-10">
                <h2 className="text-gray-800 text-left text-2xl font-bold ml-8 mt-8">
                  <span className="flex items-center">
                    <FaCrown className="text-gold" />
                    <span>人気ランキング</span>
                  </span>
                </h2>
                <p className="text-left text-gray ml-8 mt-1">
                  今みんなに「いいね」されている人気の家計簿
                </p>
                <div
                  className={`${styles.wrap} md:flex mx-4 md:justify-between md:overflow-x-scroll`}
                >
                  {sort?.slice(0, 5).map((book, index) => (
                    <React.Fragment key={book.id}>
                      <AccountBookCard
                        id={book.id}
                        date={book.date}
                        user_id={book.user_id}
                        income={book.monthly_income}
                        likes={book.likes}
                        bookmarks={book.bookmarks}
                        costs={accountBooks.costs}
                        index={index}
                        icon={true}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;

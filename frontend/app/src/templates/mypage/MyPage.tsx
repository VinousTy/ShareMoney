import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import {
  editMessage,
  getMyProfile,
  isSignIn,
  selectMessage,
  selectProfile,
} from '../../features/auth/authSlice';
import {
  editAccountBookMessage,
  getSelectDateAccountBook,
  postAccountBookDetail,
  selectAccountBookChart,
  selectAccountBookMessage,
  selectPostMyAccountBook,
} from '../../features/accountBook/accountBookSlice';
import ProfileList from '../../components/profileList/ProfileList';
import HouseholdBooksList from '../../components/householdBookList/HouseholdBooksList';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import {
  isLoadingEnd,
  isLoadingStart,
  selectIsLoading,
} from '../../features/layout/layoutSlice';
import Loading from '../../components/loading/Loading';
import FlashMessage from '../../components/message/flashMessage/FlashMessage';

const MyPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [date, setDate] = useState(new Date()),
    [flash, setFlash] = useState(false),
    [monthlyIncome, setMonthlyIncome] = useState(0);
  const profile = useSelector(selectProfile),
    accountBook = useSelector(selectAccountBookChart),
    isLoading = useSelector(selectIsLoading),
    authMessage = useSelector(selectMessage),
    accountBookMessage = useSelector(selectAccountBookMessage),
    postAccountBook = useSelector(selectPostMyAccountBook);
  const [cookies, setCookie] = useCookies();
  const history = useHistory();

  useEffect(() => {
    const fetchBootLoader = async () => {
      dispatch(isLoadingStart());
      if (cookies) {
        await dispatch(getMyProfile(cookies));
        await dispatch(isSignIn());
      }
      dispatch(isLoadingEnd());
      if (authMessage !== '') {
        setFlash(true);
      } else if (accountBookMessage !== '') {
        setFlash(true);
      }
    };
    fetchBootLoader();

    // setTimeout(() => {
    //   dispatch(editMessage(''));
    //   dispatch(editAccountBookMessage(''));
    // }, 6000);
  }, []);

  useEffect(() => {
    const packet = {
      date: date,
      cookie: cookies,
    };
    const fetchBootLoader = async () => {
      dispatch(isLoadingStart());
      if (cookies) {
        await dispatch(getSelectDateAccountBook(packet));
        await dispatch(
          postAccountBookDetail({
            user_id: '',
            date: date,
            cookie: cookies,
          })
        );
        dispatch(isLoadingEnd());
      }
    };
    fetchBootLoader();
    setFlash(false);
  }, [dispatch, date]);

  useEffect(() => {
    if (profile === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'プロフィール未設定',
        text: 'プロフィール情報の登録を行ってください',
        color: '#333',
        background: '#fbf6f0',
        showConfirmButton: true,
        confirmButtonText: '設定画面へ',
      }).then((result) => {
        history.push('/profile');
      });
    }
  }, [profile]);

  useEffect(() => {
    let sum = 0;
    if (accountBook?.accountBook.length < 1) {
      setMonthlyIncome(0);
    }
    const totalMonthlyIncome = accountBook?.accountBook.forEach((income) => {
      sum += income.monthly_income;
      setMonthlyIncome(sum);
    });
  }, [accountBook]);

  const prevMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth() - 1;
    setDate(new Date(year, month));
  };

  const nextMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    setDate(new Date(year, month));
  };

  const selectedYear = String(date.getFullYear());
  const selectedMonth = String(date.getMonth() + 1);

  return (
    <>
      {isLoading ? (
        <div className="h-screen">
          <Loading title={'Loading...'} />
        </div>
      ) : (
        <>
          {flash && <FlashMessage />}
          <div className="mt-10 md:flex md:items-start">
            <div
              className={`w-10/12 mb-10 pt-2 mx-auto bg-white text-gray-700 rounded md:pt-6 md:h-auto md:w-5/12 md:ml-14 md:mr-14 lg:w-3/12`}
            >
              <ProfileList
                id={profile?.id}
                name={profile?.name}
                age={profile?.age}
                job={profile?.job}
                income={profile?.income}
                composition={profile?.composition}
                body={profile?.body}
                img={profile?.img}
                user_id={profile?.user_id}
              />
            </div>
            <div className="md:w-6/12">
              <div className="flex items-center justify-around">
                <div
                  className="flex items-center cursor-pointer bg-transparent pr-1 md:px-2 border border-gray-500 rounded hover:bg-gray-300 transition"
                  onClick={prevMonth}
                  data-testid="prevMonth"
                >
                  <FaAngleLeft />
                  <span>前月</span>
                </div>
                <div
                  className="text-lg px-2 border-t border-b border-gray-500"
                  data-testid="currentMonth"
                >{`${selectedYear}年${selectedMonth}月の家計簿`}</div>
                <div
                  className="flex items-center cursor-pointer bg-transparent pl-1 md:px-2 border border-gray-500 rounded hover:bg-gray-300 transition"
                  onClick={nextMonth}
                  data-testid="nextMonth"
                >
                  <span>次月</span>
                  <FaAngleRight />
                </div>
              </div>
              <HouseholdBooksList
                accountBook={accountBook?.accountBook}
                monthlyIncome={monthlyIncome}
                costs={accountBook?.costs}
                totalCost={Number(accountBook?.totalCost[0].cost)}
                postAccountBook={postAccountBook}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyPage;

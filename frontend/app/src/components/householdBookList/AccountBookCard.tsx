import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { selectProfiles, selectUserId } from '../../features/auth/authSlice';
import { Avatar } from '@material-ui/core';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { FaCrown } from 'react-icons/fa';
import { MdPlayArrow } from 'react-icons/md';
import { AiOutlineLike } from 'react-icons/ai';
import { AiFillLike } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';
import { BsBookmarkFill } from 'react-icons/bs';
import useMedia from 'use-media';
import PieChart from '../chart/PieChart';
import { useCookies } from 'react-cookie';
import {
  patchBookmark,
  patchLiked,
} from '../../features/accountBook/accountBookSlice';

interface PROPS {
  id: string;
  date: string;
  user_id: string;
  costs: {
    date: string;
    expenseItem: string;
    user_id: string;
    cost: number;
  }[];
  likes: {
    id: string;
    user_id: string;
    post_account_book_id: string;
  }[];
  bookmarks: {
    id: string;
    user_id: string;
    post_account_book_id: string;
  }[];
  income: number;
  index: number;
  icon: boolean;
}

interface HISTORY_STATE {
  id: string;
}

const AccountBookCard: React.FC<PROPS> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const [income, setIncome] = useState(0),
    [costs, setCosts] = useState<number[]>([]),
    [totalCost, setTotalCost] = useState(0),
    [expenseItem, setExpenseItem] = useState<string[]>([]);
  const loginUserId = useSelector(selectUserId);
  const profiles = useSelector(selectProfiles);
  const isWide = useMedia({ maxWidth: '768px' });
  const history = useHistory();
  const location = useLocation();
  const search = useLocation().search;
  const [cookies] = useCookies();

  const query = new URLSearchParams(search);
  const query_name = query.get('name');
  const query_income = query.get('income');
  const query_job = query.get('job');
  const query_composition = query.get('composition');

  let sortCost = [...props.costs];

  const home = location.pathname.includes('/home');
  const bookmark = location.pathname.includes('/bookmark');

  const expenseItemChart: Array<string> = [];
  sortCost
    .sort((a, b) => b.cost - a.cost)
    .filter((cost) => {
      if (cost.date === props.date && cost.user_id === props.user_id) {
        expenseItemChart.push(cost.expenseItem);
      }
    });

  const costChart: Array<number> = [];
  sortCost
    .sort((a, b) => b.cost - a.cost)
    .filter((cost) => {
      if (cost.date === props.date && cost.user_id === props.user_id) {
        costChart.push(Number(cost.cost));
      }
    });

  const prof = profiles?.filter((prof) => {
    return prof.user_id === props.user_id;
  });

  useEffect(() => {
    setExpenseItem(expenseItemChart);
    setCosts(costChart);
  }, [props]);

  useEffect(() => {
    let totalCost = costs.reduce((sum, element) => {
      return sum + element;
    }, 0);
    setTotalCost(totalCost);
  }, [costs]);

  const handlerLiked = async () => {
    let name = '';
    let type = '';
    if (query_name) {
      name = unescape(String(query_name));
      type = 'username';
    } else if (query_income) {
      name = unescape(String(query_income));
      type = 'income';
    } else if (query_job) {
      name = unescape(String(query_job));
      type = 'job';
    } else if (query_composition) {
      name = unescape(String(query_composition));
      type = 'composition';
    } else if (bookmark) {
      name = 'bookmark';
      type = 'bookmark';
    }
    const packet = {
      name: name,
      type: type,
      post_account_book_id: props.id,
      current: props.likes,
      push_icon_user_id: loginUserId,
      income: income,
      cookie: cookies,
    };
    await dispatch(patchLiked(packet));
  };

  const handlerBookmark = async () => {
    let name = '';
    let type = '';
    if (query_name) {
      name = unescape(String(query_name));
      type = 'username';
    } else if (query_income) {
      name = unescape(String(query_income));
      type = 'income';
    } else if (query_job) {
      name = unescape(String(query_job));
      type = 'job';
    } else if (query_composition) {
      name = unescape(String(query_composition));
      type = 'composition';
    } else if (bookmark) {
      name = 'bookmark';
      type = 'bookmark';
    }
    const packet = {
      name: name,
      type: type,
      post_account_book_id: props.id,
      current: props.bookmarks,
      push_icon_user_id: loginUserId,
      income: income,
      cookie: cookies,
    };

    await dispatch(patchBookmark(packet));
  };

  const historyState: HISTORY_STATE = {
    id: props.id,
  };

  return (
    <>
      <div
        className={`${
          home ? 'md:mr-10 relative' : 'md:mx-auto'
        } bg-white rounded-lg border shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 my-8 md:w-7/12 md:my-12 lg:w-5/12`}
      >
        {props.icon && (
          <FaCrown
            className={`${
              props.index === 0 &&
              'absolute top-0 right-0 bg-thin-gold text-gold'
            }
              ${
                props.index === 1 &&
                'absolute top-0 right-0 bg-thin-silver text-silver'
              } 
              ${
                props.index === 2 &&
                'absolute top-0 right-0 bg-thin-bronze text-bronze'
              } 
              ${props.index === 3 && 'hidden'} 
              ${props.index === 4 && 'hidden'} 
              text-4xl mt-1 mr-4 rounded-full py-2 px-2`}
          />
        )}
        <div className="flex flex-col items-center md:flex-wrap">
          <div className="flex my-3 md:w-96">
            <Avatar
              src={prof[0]?.img}
              style={
                isWide ? { width: 70, height: 70 } : { width: 80, height: 80 }
              }
              className="mt-8 mx-2"
            />
            <div>
              <div className="font-bold text-2xl text-left">
                {prof[0]?.name}
              </div>
              <div className="flex items-center" data-testid="card-age">
                <FaAngleDoubleRight className="text-button-color-orange" />
                <span>年齢：{prof[0]?.age}歳</span>
              </div>
              <div className="flex items-center" data-testid="card-job">
                <FaAngleDoubleRight className="text-button-color-orange" />
                <span
                  className={`${
                    prof[0]?.job == 'ソフトウエア・インターネット・通信' &&
                    'w-16'
                  }`}
                >
                  職業：
                </span>
                <span>{prof[0]?.job}</span>
              </div>
              <div className="flex items-center" data-testid="card-income">
                <FaAngleDoubleRight className="text-button-color-orange" />
                <span>年収：{prof[0]?.income}</span>
              </div>
              <div className="flex items-center" data-testid="card-composition">
                <FaAngleDoubleRight className="text-button-color-orange" />
                <span>世帯：{prof[0]?.composition}</span>
              </div>
            </div>
          </div>
          <hr className="text-gray-900 w-full" />
          <div>
            <div className="flex">
              <div className="rounded-t-lg w-8/12 md:h-auto md:w-7/12 md:rounded-none md:rounded-l-lg">
                <PieChart expenseItem={expenseItem} costs={costs} />
              </div>
              <div className="text-center text-gray-500 mt-16 text-2xl md:mt-20">
                <h5
                  className="mb-2 font-bold text-xl tracking-tight text-gray-900 md:text-xl dark:text-white md:w-6/12"
                  data-testid="card-asset"
                >
                  当月収入
                  <span className="text-red-500 text-xl md:text-xl">{`¥${props.income?.toLocaleString()}`}</span>
                </h5>
                <h5
                  className='"mb-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white md:text-xl md:w-6/12'
                  data-testid="card-cost"
                >
                  当月支出
                  <span className="text-blue-500 text-xl md:text-xl">{`¥${totalCost.toLocaleString()}`}</span>
                </h5>
              </div>
            </div>
            <div className="flex items-center w-full">
              {home ? (
                <div className="py-4 ml-3">
                  <span className="text-red-400">「いいね!」:&nbsp;</span>
                  <span
                    className="font-semibold text-black ml-1"
                    data-testid="card-like"
                  >
                    &nbsp;{props.likes?.length}件
                  </span>
                </div>
              ) : (
                <div
                  className="flex items-center border border-orange rounded-full cursor-pointer px-2 py-2 bg-header-menu shadow-2xl ml-6 mr-4 my-2"
                  onClick={() => handlerLiked()}
                >
                  {props.likes?.some((like) => like.user_id === loginUserId) ? (
                    <AiFillLike className="text-red-400" />
                  ) : (
                    <AiOutlineLike />
                  )}
                  {/* <AiOutlineLike /> */}
                  <span>{props.likes?.length}</span>
                </div>
              )}
              {home ? (
                <></>
              ) : (
                <div
                  className="flex items-center border border-orange rounded-full cursor-pointer px-2 py-2 bg-header-menu shadow-2xl my-2"
                  onClick={() => handlerBookmark()}
                >
                  {props.bookmarks.some(
                    (bookmark) => bookmark.user_id === loginUserId
                  ) ? (
                    <BsBookmarkFill className="text-green" />
                  ) : (
                    <BsBookmark />
                  )}
                  <span>{props.bookmarks?.length}</span>
                </div>
              )}
              <p
                className={`${
                  home && 'ml-10'
                } flex items-center cursor-pointer ml-20 lg:ml-32`}
                onClick={() =>
                  history.push(
                    `/accountBook/detail/${props.user_id}/${props.date}`,
                    historyState
                  )
                }
              >
                <MdPlayArrow />
                <span>詳しく見る</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountBookCard;

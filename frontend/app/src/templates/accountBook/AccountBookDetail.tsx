import React, { useEffect, useState } from 'react';
import styles from './AccountBookDetail.module.scss';
import { AppDispatch } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyProfile,
  getProfiles,
  isSignIn,
  selectProfile,
  selectProfiles,
} from '../../features/auth/authSlice';
import {
  accountBookDetail,
  getComments,
  getNotify,
  postComment,
  selectAccountBookDetail,
  selectComments,
} from '../../features/accountBook/accountBookSlice';
import ProfileList from '../../components/profileList/ProfileList';
import IconList from '../../components/icon/IconList';
import PieChart from '../../components/chart/PieChart';
import { useCookies } from 'react-cookie';
import useMedia from 'use-media';
import {
  Avatar,
  createStyles,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '80%',
      margin: 'auto',
      marginTop: '20px',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
  })
);

interface COSTS {
  expenseItem: string;
  cost: number;
}

interface HISTORY_STATE {
  id: string;
}

const AccountBookDetail: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [date, setDate] = useState(new Date()),
    [totalCost, setTotalCost] = useState(0),
    [asset, setAsset] = useState(0),
    [expenseItem, setExpenseItem] = useState<string[]>([]),
    [costs, setCosts] = useState<number[]>([]),
    [sortCosts, setSortCosts] = useState<Array<COSTS>>([]),
    [tabIndex, setTabIndex] = useState(0),
    [text, setText] = useState('');
  const accountBook = useSelector(selectAccountBookDetail);
  const profile = useSelector(selectProfile);
  const profiles = useSelector(selectProfiles);
  const comments = useSelector(selectComments);
  const [cookies, setCookie] = useCookies();
  const isWide = useMedia({ maxWidth: '768px' });
  const { state } = useLocation<HISTORY_STATE>();

  let id = window.location.pathname.split('/accountBook/detail')[1];
  if (id !== '') {
    id = id?.split('/')[1];
  }

  let search_date = window.location.pathname.split(
    `/accountBook/detail/${id}`
  )[1];
  if (search_date !== '') {
    search_date = search_date?.split('/')[1];
  }

  const array: Array<number> = [];
  accountBook.costs?.filter((cost) => {
    array.push(Number(cost.cost));
  });

  let sortCost = [...accountBook.costs];

  const expenseItemChart = sortCost
    .sort((a, b) => b.cost - a.cost)
    .map((cost) => {
      return cost.expenseItem;
    });
  const costChart = sortCost
    .sort((a, b) => b.cost - a.cost)
    .map((cost) => {
      return cost.cost;
    });

  const commentOnPost = [...comments];

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (cookies) {
        await dispatch(isSignIn());
        await dispatch(getNotify(cookies));
        await dispatch(
          accountBookDetail({
            user_id: id,
            date: search_date,
            cookie: cookies,
          })
        );
        await dispatch(getMyProfile(cookies));
        await dispatch(getProfiles(cookies));
        await dispatch(
          getComments({
            body: '',
            user_id: id,
            post_account_book_id: state.id,
            cookie: cookies,
          })
        );
      }
    };
    fetchBootLoader();
    setDate(new Date(search_date));
  }, [dispatch]);

  useEffect(() => {
    let totalCost = array.reduce((sum, element) => {
      return sum + element;
    }, 0);
    setTotalCost(totalCost);
  }, [array]);

  useEffect(() => {
    setAsset(Number(accountBook.income[0]?.monthly_income) - totalCost);
    setExpenseItem(expenseItemChart);
    setCosts(costChart);
    setSortCosts(sortCost?.sort((a, b) => b.cost - a.cost));
  }, [totalCost]);

  const submitComment = () => {
    dispatch(
      postComment({
        body: text,
        user_id: profile.user_id,
        post_account_book_id: state.id,
        cookie: cookies,
      })
    );
    setText('');
  };

  const selectedYear = String(date.getFullYear());
  const selectedMonth = String(date.getMonth() + 1);

  return (
    <div className="mt-10 md:flex md:items-start">
      <div
        className={`w-10/12 mb-10 pt-2 mx-auto bg-white text-gray-700 rounded md:pt-6 md:h-auto md:w-5/12 md:ml-14 md:mr-14 lg:w-3/12`}
      >
        <ProfileList
          id={accountBook.profile[0]?.id}
          name={accountBook.profile[0]?.name}
          age={accountBook.profile[0]?.age}
          job={accountBook.profile[0]?.job}
          income={accountBook.profile[0]?.income}
          composition={accountBook.profile[0]?.composition}
          body={accountBook.profile[0]?.body}
          img={accountBook.profile[0]?.img}
          user_id={accountBook.profile[0]?.user_id}
        />
      </div>
      <div className="md:w-6/12">
        <div className="flex items-center justify-around">
          <div className="text-lg px-2 border-t border-b border-gray-500">{`${selectedYear}年${selectedMonth}月の家計簿`}</div>
        </div>
        <div>
          <div className="text-center mt-2 md:flex md:items-center md:justify-center">
            <h3 className="text-lg font-bold md:text-2xl">当月の資産&nbsp;</h3>
            <p className="text-lg font-bold md:text-2xl">{`¥${asset.toLocaleString()}`}</p>
            <hr className={styles.border} />
          </div>
          <div className="md:flex md:justify-start">
            <div className={`${isWide && 'mx-auto'} w-9/12 md:w-7/12`}>
              <PieChart expenseItem={expenseItem} costs={costs} />
            </div>
            <div className="text-center mt-4 text-2xl md:mt-20 lg:mt-28">
              <h5 className="mb-2 font-bold">
                当月収入
                <span className="ml-4 text-red-500 md:ml-2 md:text-2xl lg:text-3xl">{`¥${Number(
                  accountBook.income[0]?.monthly_income
                ).toLocaleString()}`}</span>
              </h5>
              <h5 className="font-bold">
                当月支出
                <span className="ml-4 text-blue-500 md:ml-2 md:text-2xl lg:text-3xl">{`¥${totalCost.toLocaleString()}`}</span>
              </h5>
            </div>
          </div>
          <Tabs
            selectedIndex={tabIndex}
            onSelect={(index: number) => setTabIndex(index)}
            className="text-center mx-auto mt-10"
          >
            <TabList className="flex">
              <Tab className="bg-transparent cursor-pointer w-22 mx-auto">
                <div
                  className={clsx([
                    tabIndex === 0
                      ? 'text-black font-bold border-b-2 border-orange'
                      : 'text-disabled text-silver opacity-70',
                  ])}
                  data-testid="post-title"
                >
                  当月の支出
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
                  コメント
                </div>
              </Tab>
            </TabList>
            <TabPanel>
              <div className="pb-16">
                <Grid container>
                  <List
                    component="nav"
                    className={classes.root}
                    aria-label="mailbox folders"
                  >
                    <Divider />
                    <ListItem className={styles.cost} button divider>
                      <ListItemText
                        primary={
                          <Typography style={{ fontWeight: 'bold' }}>
                            支出内訳
                          </Typography>
                        }
                      />
                    </ListItem>
                    {asset === 0 ? (
                      <div className="text-left mt-4 pb-20 ml-4 md:pb-4">
                        家計簿の登録がありません
                      </div>
                    ) : (
                      sortCosts?.map((cost, index: number) => {
                        const costs = cost.cost;
                        const co = Number(costs).toLocaleString();
                        return (
                          <div key={index}>
                            <ListItem button>
                              <IconList expenseItem={cost.expenseItem} />
                              <ListItemText primary={cost.expenseItem} />
                              <Grid>
                                <ListItemText primary={`¥${co}`} />
                              </Grid>
                            </ListItem>
                          </div>
                        );
                      })
                    )}
                    <Divider light />
                  </List>
                </Grid>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="pb-16">
                <Grid container>
                  <List
                    component="nav"
                    className={classes.root}
                    aria-label="mailbox folders"
                  >
                    <Divider />
                    <ListItem className={styles.cost} button divider>
                      <ListItemText
                        primary={
                          <Typography style={{ fontWeight: 'bold' }}>
                            コメント一覧
                          </Typography>
                        }
                      />
                    </ListItem>
                    {commentOnPost?.length === 0 ? (
                      <div className="text-left my-2">コメントはありません</div>
                    ) : (
                      commentOnPost.reverse().map((comment) => (
                        <div key={comment.id} className="mt-4">
                          <div className="flex items-center break-all">
                            <Avatar
                              src={
                                profiles.find(
                                  (prof) => prof.user_id === comment.user_id
                                )?.img
                              }
                              style={
                                isWide
                                  ? { width: 30, height: 30 }
                                  : { width: 40, height: 40 }
                              }
                              className="mt-1 mr-3"
                            />
                            <p>
                              <strong className="mr-2">
                                {
                                  profiles.find(
                                    (prof) => prof.user_id === comment.user_id
                                  )?.name
                                }
                              </strong>
                              <br />
                              {comment.body}
                            </p>
                          </div>
                          <hr
                            className={`bg-gray-400 h-px border-none mt-3 mb-8 mx-auto`}
                          />
                        </div>
                      ))
                    )}
                    <div className="flex">
                      <Avatar
                        src={profile?.img === undefined ? '' : profile?.img}
                        style={
                          isWide
                            ? { width: 30, height: 30 }
                            : { width: 30, height: 30 }
                        }
                        className="mt-1 mx-1"
                      />
                      {profile.body ==
                      'ゲストユーザーとしてログインしています。ゲストユーザーのため、各種投稿やユーザー情報の変更等の一部機能の使用は制限されております。' ? (
                        <textarea
                          disabled={true}
                          className="flex-auto w-8/12 py-2 bg-thin-black rounded outline-none border border-gray-500"
                          rows={1}
                          placeholder="ゲストはコメント入力できません"
                          value={text}
                        />
                      ) : (
                        <>
                          <textarea
                            className="flex-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 w-9/12 py-2 px-3 mb-5"
                            rows={1}
                            placeholder="コメント入力"
                            value={text}
                            data-testid="input-comment"
                            onChange={(e) => setText(e.target.value)}
                          />
                          <button
                            disabled={!text.length}
                            className="bg-transparent mr-1 text-blue-500"
                            type="submit"
                            data-testid="button-comment"
                            onClick={submitComment}
                          >
                            送信
                          </button>
                        </>
                      )}
                    </div>
                  </List>
                </Grid>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountBookDetail;

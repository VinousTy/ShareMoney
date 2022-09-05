import React, { useEffect, useState } from 'react';
import styles from './AccountBookDetail.module.scss';
import { AppDispatch } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { isSignIn } from '../../features/auth/authSlice';
import {
  accountBookDetail,
  selectAccountBookDetail,
} from '../../features/accountBook/accountBookSlice';
import ProfileList from '../../components/profileList/ProfileList';
import IconList from '../../components/icon/IconList';
import PieChart from '../../components/chart/PieChart';
import { useCookies } from 'react-cookie';
import useMedia from 'use-media';
import {
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

const AccountBookDetail: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [date, setDate] = useState(new Date()),
    [totalCost, setTotalCost] = useState(0),
    [asset, setAsset] = useState(0),
    [expenseItem, setExpenseItem] = useState<string[]>([]),
    [costs, setCosts] = useState<number[]>([]),
    [sortCosts, setSortCosts] = useState<Array<COSTS>>([]);
  const accountBook = useSelector(selectAccountBookDetail);
  const [cookies, setCookie] = useCookies();
  const isWide = useMedia({ maxWidth: '768px' });

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

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (cookies) {
        await dispatch(isSignIn());
        await dispatch(
          accountBookDetail({
            user_id: id,
            date: search_date,
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
        </div>
      </div>
    </div>
  );
};

export default AccountBookDetail;

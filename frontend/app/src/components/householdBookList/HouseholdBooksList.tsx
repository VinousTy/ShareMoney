import React, { useEffect, useState } from 'react';
import styles from './HouseholdBooksList.module.scss';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Grid, Typography } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconList from '../icon/IconList';
import { useHistory } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import clsx from 'clsx';
import { useCookies } from 'react-cookie';
import { IoMdWallet } from 'react-icons/io';
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import {
  isDeleteModalOpen,
  isLoadingEnd,
  isLoadingStart,
  isPostModalOpen,
} from '../../features/layout/layoutSlice';
import Modals from '../modals/Modals';
import {
  createPostAccountBook,
  createPostCost,
  deleteAccountBook,
  deletePostCost,
  updatePostAccountBook,
  updatePostCost,
} from '../../features/accountBook/accountBookSlice';
import PieChart from '../chart/PieChart';
import useMedia from 'use-media';

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
    nest_income: {
      paddingLeft: theme.spacing(0),
      fontWeight: 'bold',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    income_text: {
      fontWeight: 'bold',
    },
  })
);

interface PROPS {
  accountBook: {
    id: string;
    date: string;
    user_id: number;
    monthly_income: number;
    expenses: {
      expenseItem: string;
      cost: number;
    }[];
  }[];
  monthlyIncome: number;
  costs: {
    expenseItem: string;
    cost: number;
  }[];
  totalCost: number;
  postAccountBook: {
    accountBook: {
      id: string;
      date: string;
      user_id: number;
      monthly_income: number;
      expenses: {
        expenseItem: string;
        cost: number;
      }[];
      likes: string[];
      bookmarks: string[];
    }[];
    costs: {
      expenseItem: string;
      cost: number;
    }[];
    totalCost: {
      cost: number;
    }[];
  };
}

interface COSTS {
  expenseItem: string;
  cost: number;
}

interface PACKET {
  id: string;
  cookie: {
    [x: string]: any;
  };
  expenses: {
    expenseItem: string;
    cost: number;
  }[];
}

interface ITEM {
  id: string;
  date: string;
  user_id: number;
  monthly_income: number;
  expenses: {
    expenseItem: string;
    cost: number;
  }[];
}

interface DELETE {
  id: string;
  date: any;
  cookie: {
    [x: string]: string;
  };
}

const HouseholdBooksList = (props: PROPS) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [cookies] = useCookies();
  const [sortCosts, setSortCosts] = useState<Array<COSTS>>([]),
    [costs, setCosts] = useState<number[]>([]),
    [expenseItem, setExpenseItem] = useState<string[]>([]),
    [asset, setAsset] = useState(0),
    [index, setIndex] = useState(0),
    [open, setOpen] = useState(false),
    [deleteOpen, setDeleteOpen] = useState(false),
    [shareOpen, setShareOpen] = useState(false),
    [deletePacket, setDeletePacket] = useState<DELETE>({
      id: '',
      date: '',
      cookie: cookies,
    }),
    [title, setTitle] = useState(''),
    [subText, setSubText] = useState(''),
    [body, setBody] = useState(''),
    [btnText, setBtnText] = useState(''),
    [path, setPath] = useState(''),
    [tabIndex, setTabIndex] = useState(0);
  const history = useHistory();
  const isWide = useMedia({ maxWidth: '768px' });

  let sortCost = [...props.costs];

  const expenseItemChart = sortCost
    .sort((a, b) => b.cost - a.cost)
    .map((cost) => cost.expenseItem);

  const costChart = sortCost
    .sort((a, b) => b.cost - a.cost)
    .map((cost) => cost.cost);

  useEffect(() => {
    setAsset(props.monthlyIncome - props.totalCost);
    setExpenseItem(expenseItemChart);
    setCosts(costChart);
    setSortCosts(sortCost?.sort((a, b) => b.cost - a.cost));
  }, [props]);

  const handleClick = (i: number) => {
    const openIndex = i;
    if (i === openIndex) {
      setOpen(!open);
    }
    setIndex(i);
  };

  const deleteHistory = async (book: ITEM) => {
    setDeleteOpen(true);
    setDeletePacket({
      id: book.id,
      date: book.date,
      cookie: cookies,
    });
    setTitle('履歴削除');
    setBody('本当に削除してもよろしいですか');
    setSubText('(削除すると元に戻せません)');
    setBtnText('削除');
    setPath('/mypage');
    await dispatch(isDeleteModalOpen());
  };

  const shareHistory = async () => {
    setShareOpen(true);
    setTitle('公開');
    setBody('当月の家計簿を公開します');
    setSubText('(既に当月の家計簿が公開済みの場合は更新されます)');
    setBtnText('OK');
    setPath('/accountBook/list');
    await dispatch(isPostModalOpen());
  };

  const createShareAccountBook = async () => {
    const packet = {
      date: props.accountBook[0]?.date,
      monthly_income: props.monthlyIncome,
      user_id: props.accountBook[0]?.user_id,
      cookie: cookies,
      expenses: props.costs,
    };

    const updatePacket = {
      id: props.postAccountBook.accountBook[0]?.id,
      date: props.accountBook[0]?.date,
      monthly_income: props.monthlyIncome,
      user_id: props.accountBook[0]?.user_id,
      cookie: cookies,
      expenses: getCostDiff(),
    };

    const createPacketCost: PACKET = {
      id: props.postAccountBook.accountBook[0]?.id,
      cookie: cookies,
      expenses: getCostDiff(),
    };

    const updatePacketCost: PACKET = {
      id: props.postAccountBook.accountBook[0]?.id,
      cookie: cookies,
      expenses: [],
    };

    const deletePacketCost: PACKET = {
      id: props.postAccountBook.accountBook[0]?.id,
      cookie: cookies,
      expenses: getPostAccountDiff(),
    };

    props.postAccountBook.costs?.filter((expense) => {
      props.costs.forEach((cost) => {
        if (cost.expenseItem === expense.expenseItem) {
          updatePacketCost.expenses.push(cost);
        }
      });
    });

    function getCostDiff() {
      const same = props.costs?.filter((cost) => {
        return props.postAccountBook.costs?.find(
          (expense) => expense.expenseItem === cost.expenseItem
        );
      });
      const sameIds = same.map((_item) => _item.expenseItem);

      return props.costs.filter((cost) => {
        return !sameIds.includes(cost.expenseItem);
      });
    }

    function getPostAccountDiff() {
      const same = props.costs?.filter((cost) => {
        return props.postAccountBook.costs?.find(
          (expense) => expense.expenseItem === cost.expenseItem
        );
      });
      const sameIds = same.map((_item) => _item.expenseItem);

      return props.postAccountBook.costs.filter((cost) => {
        return !sameIds.includes(cost.expenseItem);
      });
    }

    if (props.postAccountBook.accountBook.length === 0) {
      await dispatch(isLoadingStart());
      await dispatch(createPostAccountBook(packet));
      await dispatch(isLoadingEnd());
      await history.push('/accountBook/list');
    } else {
      await dispatch(isLoadingStart());
      await dispatch(updatePostAccountBook(updatePacket));
      await dispatch(createPostCost(createPacketCost));
      await dispatch(updatePostCost(updatePacketCost));
      await dispatch(deletePostCost(deletePacketCost));
      await dispatch(isLoadingEnd());
      await history.push('/accountBook/list');
    }
  };

  return (
    <div>
      {deleteOpen && (
        <Modals
          type={'delete'}
          title={title}
          body={body}
          subText={subText}
          btnText={btnText}
          func={deleteAccountBook}
          packet={deletePacket}
          path={path}
        />
      )}
      {shareOpen && (
        <Modals
          type={'share'}
          title={title}
          body={body}
          subText={subText}
          btnText={btnText}
          func={createShareAccountBook}
          packet={deletePacket}
          path={path}
        />
      )}
      <div className="text-center mt-2 md:flex md:items-center md:justify-center">
        {asset === 0 ? (
          <></>
        ) : (
          <h3 className="text-lg font-bold md:text-2xl">当月の資産&nbsp;</h3>
        )}
        {asset === 0 ? (
          <div>
            <p className="text-lg font-bold my-4 md:my-10 md:text-2xl">
              当月の家計簿の登録はありません
            </p>
            <button
              className={styles.button}
              onClick={() => history.push('/accountBook/regist')}
            >
              家計簿を登録する
            </button>
          </div>
        ) : (
          <>
            <p className="text-lg font-bold md:text-2xl">{`¥${asset.toLocaleString()}`}</p>
            <hr className={styles.border} />
          </>
        )}
      </div>
      <div className="md:flex md:justify-start">
        <div className={`${isWide && 'mx-auto'} w-9/12 md:w-7/12`}>
          <PieChart expenseItem={expenseItem} costs={costs} />
        </div>
        <div className="text-center mt-4 text-2xl md:mt-20 lg:mt-28">
          {asset === 0 ? (
            <></>
          ) : (
            <h5 className="mb-2 font-bold">
              当月収入
              <span
                className="ml-4 text-red-500 md:ml-2 md:text-2xl lg:text-3xl"
                date-testid="asset"
              >{`¥${props.monthlyIncome.toLocaleString()}`}</span>
            </h5>
          )}
          {asset === 0 ? (
            <></>
          ) : (
            <h5 className="font-bold">
              当月支出
              <span
                className="ml-4 text-blue-500 md:ml-2 md:text-2xl lg:text-3xl"
                date-testid="totalCost"
              >{`¥${props.totalCost.toLocaleString()}`}</span>
            </h5>
          )}
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
                tabIndex === 0 ? styles.underline : styles.disabled,
              ])}
              data-testid="post-title"
            >
              当月の支出
            </div>
          </Tab>
          <Tab className="bg-transparent cursor-pointer w-22 mx-auto">
            <div
              className={clsx([
                tabIndex === 1 ? styles.underline : styles.disabled,
              ])}
              data-testid="bookmark-title"
            >
              登録履歴
            </div>
          </Tab>
        </TabList>
        <TabPanel>
          <div className="pb-12">
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
                          <ListItemText
                            date-testid="expenseItem"
                            primary={cost.expenseItem}
                          />
                          <Grid>
                            <ListItemText
                              date-testid="cost"
                              primary={`¥${co}`}
                            />
                          </Grid>
                        </ListItem>
                      </div>
                    );
                  })
                )}
                {asset === 0 ? (
                  <></>
                ) : (
                  <div className="my-2">
                    <button
                      className={styles.button}
                      onClick={() => shareHistory()}
                    >
                      当月の家計簿をシェア
                    </button>
                  </div>
                )}
                <Divider light />
              </List>
            </Grid>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="pb-10">
            <div>
              <Grid container>
                <List
                  component="nav"
                  className={classes.root}
                  aria-label="mailbox folders"
                  // key={props.id}
                >
                  <Divider />
                  <ListItem className={styles.cost} button divider>
                    <ListItemText
                      primary={
                        <Typography style={{ fontWeight: 'bold' }}>
                          登録日
                        </Typography>
                      }
                    />
                  </ListItem>
                  {asset === 0 ? (
                    <div className="text-left mt-4 pb-20 ml-4 md:pb-4">
                      家計簿の登録がありません
                    </div>
                  ) : (
                    props.accountBook?.map((book, i: number) => {
                      return (
                        <div key={i}>
                          <ListItem button onClick={() => handleClick(i)}>
                            {open && index === i ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                            <ListItemText primary={book.date} />
                            <Grid>
                              <ListItemText>
                                <div className={styles.btn}>
                                  <button
                                    className="text-blue-500 underline ... cursor-pointer hover:text-blue-300 transition-all"
                                    onClick={() =>
                                      history.push(
                                        `/accountBook/regist/${book.id}`
                                      )
                                    }
                                  >
                                    変更
                                  </button>
                                </div>
                              </ListItemText>
                            </Grid>
                            <Grid>
                              <ListItemText>
                                <div className="ml-4">
                                  <button
                                    className="text-red-500 underline ... cursor-pointer hover:text-red-400 transition-all"
                                    onClick={() => deleteHistory(book)}
                                  >
                                    削除
                                  </button>
                                </div>
                              </ListItemText>
                            </Grid>
                          </ListItem>
                          <Collapse
                            in={open && index === i}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List component="div" disablePadding>
                              <div className="pl-8">
                                <ListItem
                                  className={classes.nest_income}
                                  button
                                  key={index}
                                >
                                  <div className="bg-thin-gold px-2 py-2 rounded-full mr-1 md:mr-2">
                                    <IoMdWallet className="text-bold" />
                                  </div>
                                  <ListItemText
                                    primary={
                                      <Typography
                                        style={{ fontWeight: 'bold' }}
                                      >
                                        収入
                                      </Typography>
                                    }
                                  />
                                  <Grid>
                                    <ListItemText
                                      primary={
                                        <Typography
                                          style={{ fontWeight: 'bold' }}
                                        >
                                          ¥
                                          {book.monthly_income
                                            ? book.monthly_income?.toLocaleString()
                                            : 0}
                                        </Typography>
                                      }
                                    />
                                  </Grid>
                                </ListItem>
                                {book.expenses.map((expense, index) => (
                                  <ListItem button key={index}>
                                    <IconList
                                      expenseItem={expense.expenseItem}
                                    />
                                    <ListItemText
                                      primary={expense.expenseItem}
                                    />
                                    <Grid>
                                      <ListItemText>
                                        ¥{expense.cost.toLocaleString()}
                                      </ListItemText>
                                    </Grid>
                                  </ListItem>
                                ))}
                              </div>
                            </List>
                          </Collapse>
                        </div>
                      );
                    })
                  )}
                  {asset === 0 ? (
                    <></>
                  ) : (
                    <div className="my-4">
                      <button
                        className={styles.button}
                        onClick={() => shareHistory()}
                      >
                        当月の家計簿をシェア
                      </button>
                    </div>
                  )}
                  <Divider light />
                </List>
              </Grid>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default HouseholdBooksList;

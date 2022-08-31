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
  id: number;
  date: any;
  cookie: {
    [x: string]: string;
  };
}

const HouseholdBooksList = (props: PROPS) => {
  const classes = useStyles();
  const [cookies] = useCookies();
  const [sortCosts, setSortCosts] = useState<Array<COSTS>>([]),
    [costs, setCosts] = useState<number[]>([]),
    [expenseItem, setExpenseItem] = useState<string[]>([]),
    [asset, setAsset] = useState(0),
    [index, setIndex] = useState(0),
    [open, setOpen] = useState(false),
    [tabIndex, setTabIndex] = useState(0);
  const history = useHistory();

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

  return (
    <div>
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
                    <button className={styles.button}>
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
                                  <button className="text-red-500 underline ... cursor-pointer hover:text-red-400 transition-all">
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
                      <button className={styles.button}>
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

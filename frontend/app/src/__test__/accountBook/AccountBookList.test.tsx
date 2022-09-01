import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import layoutReducer from '../../features/layout/layoutSlice';
import accountBookReducer from '../../features/accountBook/accountBookSlice';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import Modal from 'react-modal';
import AccountBookList from '../../templates/accountBook/AccountBookList';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const server = setupServer();

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe('AccountBookList Components Test Cases', () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        layout: layoutReducer,
        accountBook: accountBookReducer,
      },
    });
  });
  Modal.setAppElement = () => null;

  it('Should render Loading Component before data is retrieved', async () => {
    const history = createMemoryHistory();
    history.push('/accountBook/list');

    server.use(
      rest.get(`${apiUrl}api/profile/list`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: '1',
            name: 'user',
            job: '不動産',
            age: 21,
            income: '0~200万円',
            composition: '1人暮らし',
            body: 'test',
            img: '',
            user_id: 1,
          })
        );
      })
    );

    global.matchMedia =
      global.matchMedia ||
      function () {
        return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      };

    render(
      <Provider store={store}>
        <Router history={history}>
          <AccountBookList />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('Should render AccountBook Component before data is retrieved', async () => {
    const history = createMemoryHistory();
    history.push('/accountBook/list');

    server.use(
      rest.get(`${apiUrl}api/profile/list`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: '1',
              name: 'user',
              job: '不動産',
              age: 21,
              income: '0~200万円',
              composition: '1人暮らし',
              body: 'test',
              img: '',
              user_id: 1,
            },
          ])
        );
      })
    );

    server.use(
      rest.get(`${apiUrl}api/accountbook/list`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              accountBook: [
                {
                  id: 1,
                  date: '2022-08',
                  user_id: 1,
                  monthly_income: 100000,
                  likes: [
                    {
                      id: 1,
                      user_id: 1,
                      post_account_book_id: 1,
                    },
                  ],
                  bookmarks: [
                    {
                      id: 1,
                      user_id: 1,
                      post_account_book_id: 1,
                    },
                  ],
                },
              ],
              costs: [
                {
                  date: '2022-08',
                  expenseItem: '住居費',
                  cost: 10000,
                  user_id: 1,
                },
              ],
              income: [
                {
                  date: '2022-08',
                  monthly_income: 100000,
                  user_id: 1,
                },
              ],
            },
          ])
        );
      })
    );

    global.matchMedia =
      global.matchMedia ||
      function () {
        return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      };

    render(
      <Provider store={store}>
        <Router history={history}>
          <AccountBookList />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.findByTestId('search-input')).toBeTruthy();
      expect(screen.findByTestId('search-button')).toBeTruthy();
      expect(screen.findByTestId('card-age')).toBeTruthy();
      expect(screen.findByTestId('card-job')).toBeTruthy();
      expect(screen.findByTestId('card-income')).toBeTruthy();
      expect(screen.findByTestId('card-composition')).toBeTruthy();
    });
  });
});

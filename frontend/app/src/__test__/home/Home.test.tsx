import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import layoutReducer from '../../features/layout/layoutSlice';
import accountBookReducer from '../../features/accountBook/accountBookSlice';
import { createMemoryHistory } from 'history';
import Modal from 'react-modal';
import { Router } from 'react-router-dom';
import Home from '../../templates/home/Home';

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

describe('Home Components Test Cases', () => {
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

  it('Should check if home is rendering all elements correctly', async () => {
    const history = createMemoryHistory();
    history.push('/home');

    server.use(
      rest.get(`${apiUrl}api/accountbook/list`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              accountBooks: {
                accountBook: [
                  {
                    id: '1',
                    date: '2022-09',
                    user_id: '1',
                    monthly_income: 200000,
                    likes: [
                      {
                        id: '',
                        user_id: '',
                        post_account_book_id: '',
                      },
                    ],
                    bookmarks: [
                      {
                        id: '',
                        user_id: '',
                        post_account_book_id: '',
                      },
                    ],
                  },
                ],
                costs: [
                  {
                    date: '2022-09',
                    expenseItem: '住居費',
                    cost: 30000,
                    user_id: '1',
                  },
                ],
                income: [
                  {
                    date: '2022-09',
                    monthly_income: 3200000,
                    user_id: '1',
                  },
                ],
              },
            },
          ])
        );
      })
    );

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
          <Home />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.findByTestId('post-title')).toBeTruthy;
      expect(screen.findByTestId('bookmark-title')).toBeTruthy;
      expect(screen.findByTestId('card-age')).toBeTruthy;
      expect(screen.findByTestId('card-job')).toBeTruthy;
      expect(screen.findByTestId('card-income')).toBeTruthy;
      expect(screen.findByTestId('card-composition')).toBeTruthy;
    });
  });
});

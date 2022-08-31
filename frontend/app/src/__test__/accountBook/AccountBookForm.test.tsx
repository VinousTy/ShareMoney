import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import layoutReducer from '../../features/layout/layoutSlice';
import accountBookReducer from '../../features/accountBook/accountBookSlice';
import AccountBookForm from '../../templates/accountBook/AccountBookForm';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

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

describe('AccountBookForm Components Test Cases', () => {
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

  it('Should render AccountBook Component before data is retrieved', async () => {
    const history = createMemoryHistory();
    history.push('/accountBook/regist');

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
          <AccountBookForm />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('title')).toBeTruthy();
    expect(screen.getByTestId('cost-title')).toBeTruthy();
    expect(screen.getByTestId('input-date')).toBeTruthy();
    expect(screen.getByTestId('button-submit')).toBeTruthy();
  });

  it('Should render AccountBookForm before data is retrieved', async () => {
    const history = createMemoryHistory();
    history.push('/accountBook/regist');

    server.use(
      rest.get(`${apiUrl}api/accountbook`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: '1',
              date: '2022-08',
              monthly_income: 100000,
              user_id: 1,
              expenses: [
                {
                  expenseItem: '住居費',
                  cost: 20000,
                },
              ],
              likes: [''],
              bookmarks: [''],
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
          <AccountBookForm />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('expenseItem-icon')).toBeTruthy();
    expect(screen.getByTestId('cost-icon')).toBeTruthy();
  });

  it('SShould display an error if the entered value is invalid', async () => {
    const history = createMemoryHistory();
    history.push('/accountBook/regist');

    server.use(
      rest.get(`${apiUrl}api/accountbook`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: '1',
              date: '2022-08',
              monthly_income: 100000,
              user_id: 1,
              expenses: [
                {
                  expenseItem: '住居費',
                  cost: 20000,
                },
              ],
              likes: [''],
              bookmarks: [''],
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
          <AccountBookForm />
        </Router>
      </Provider>
    );

    const date = screen.getByTestId('input-date');
    const submitButton = screen.getByTestId('button-submit');

    userEvent.click(submitButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });

  it('Alert should not be displayed when AccountBookForm is successfull', async () => {
    const history = createMemoryHistory();
    history.push('/accountBook/regist');

    server.use(
      rest.get(`${apiUrl}api/accountbook`, (req, res, ctx) => {
        return res(ctx.status(400));
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
          <AccountBookForm />
        </Router>
      </Provider>
    );

    const date = screen.getByTestId('input-date');
    const submitButton = screen.getByTestId('button-submit');

    fireEvent.change(date, { target: { value: '2022/08' } });
    userEvent.click(submitButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });
});

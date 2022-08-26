import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SignIn from '../../templates/auth/SignIn';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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

describe('SignIn Components Test Cases', () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    };

  it('Should check if SignIn is rendering all elements correctly', async () => {
    const history = createMemoryHistory();
    history.push('/signin');

    render(
      <Provider store={store}>
        <Router history={history}>
          <SignIn />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('title')).toBeTruthy();
    expect(screen.getByTestId('img')).toBeTruthy();
    expect(screen.getByTestId('label-email')).toBeTruthy();
    expect(screen.getByTestId('label-password')).toBeTruthy();
    expect(screen.getByTestId('input-email')).toBeTruthy();
    expect(screen.getByTestId('input-password')).toBeTruthy();
    expect(screen.getByTestId('google-signin-button')).toBeTruthy();
    expect(screen.getByTestId('button-signin')).toBeTruthy();
  });

  it('Should display an error if the entered value is invalid', async () => {
    const history = createMemoryHistory();
    history.push('/signin');

    render(
      <Provider store={store}>
        <Router history={history}>
          <SignIn />
        </Router>
      </Provider>
    );
    const email = screen.getByTestId('input-email');
    const password = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('button-signin');

    userEvent.type(email, 'test');
    userEvent.type(password, 'test');
    userEvent.click(submitButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(2);
  });

  it('Alert should not be displayed when login is successfull', async () => {
    const history = createMemoryHistory();
    history.push('/signin');

    server.use(
      rest.post(`${apiUrl}api/login`, (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <SignIn />
        </Router>
      </Provider>
    );
    const email = screen.getByTestId('input-email');
    const password = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('button-signin');

    userEvent.type(email, 'test@mail.com');
    userEvent.type(password, 'kuresento4');
    userEvent.click(submitButton);

    expect(await screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it('Should show an alert when login fails', async () => {
    const history = createMemoryHistory();
    history.push('/signin');

    server.use(
      rest.post(`${apiUrl}api/login`, (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <SignIn />
        </Router>
      </Provider>
    );
    const email = screen.getByTestId('input-email');
    const password = screen.getByTestId('input-password');
    const submitButton = screen.getByTestId('button-signin');

    userEvent.type(email, 'test@mail.com');
    userEvent.type(password, 'kuresento4');
    userEvent.click(submitButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });
});

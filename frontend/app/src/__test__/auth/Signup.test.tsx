import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SignUp from '../../templates/auth/SignUp';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const apiUrl = process.env.REACT_APP_DEV_API_URL;
const pass = process.env.REACT_APP_TEST_PASSWORD;

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

describe('SignUp Components Test Cases', () => {
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
    history.push('/signup');

    render(
      <Provider store={store}>
        <Router history={history}>
          <SignUp />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('title')).toBeTruthy();
    expect(screen.getByTestId('img')).toBeTruthy();
    expect(screen.getByTestId('label-email')).toBeTruthy();
    expect(screen.getByTestId('label-password')).toBeTruthy();
    expect(screen.getByTestId('label-confirm-password')).toBeTruthy();
    expect(screen.getByTestId('input-email')).toBeTruthy();
    expect(screen.getByTestId('input-password')).toBeTruthy();
    expect(screen.getByTestId('input-confirm-password')).toBeTruthy();
    expect(screen.getByTestId('google-signin-button')).toBeTruthy();
    expect(screen.getByTestId('button-signup')).toBeTruthy();
  });

  it('Should display an error if the entered value is invalid', async () => {
    const history = createMemoryHistory();
    history.push('/signup');

    render(
      <Provider store={store}>
        <Router history={history}>
          <SignUp />
        </Router>
      </Provider>
    );
    const email = screen.getByTestId('input-email');
    const password = screen.getByTestId('input-password');
    const confirmPassword = screen.getByTestId('input-confirm-password');
    const submitButton = screen.getByTestId('button-signup');

    userEvent.type(email, 'test');
    userEvent.type(password, 'test');
    userEvent.type(confirmPassword, 'test');
    userEvent.click(submitButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(3);
  });

  it('Alert should not be displayed when signup is successful', async () => {
    const history = createMemoryHistory();
    history.push('/signup');

    server.use(
      rest.post(`${apiUrl}api/register`, (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <SignUp />
        </Router>
      </Provider>
    );
    const email = screen.getByTestId('input-email');
    const password = screen.getByTestId('input-password');
    const confirmPassword = screen.getByTestId('input-confirm-password');
    const submitButton = screen.getByTestId('button-signup');

    userEvent.type(email, 'test@mail.com');
    userEvent.type(password, String(pass));
    userEvent.type(confirmPassword, String(pass));
    userEvent.click(submitButton);

    expect(await screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it('Should show an alert when signup fails', async () => {
    const history = createMemoryHistory();
    history.push('/signup');

    server.use(
      rest.post(`${apiUrl}api/register`, (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <SignUp />
        </Router>
      </Provider>
    );
    const email = screen.getByTestId('input-email');
    const password = screen.getByTestId('input-password');
    const confirmPassword = screen.getByTestId('input-confirm-password');
    const submitButton = screen.getByTestId('button-signup');

    userEvent.type(email, 'test@mail.com');
    userEvent.type(password, String(pass));
    userEvent.type(confirmPassword, String(pass));
    userEvent.click(submitButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });
});

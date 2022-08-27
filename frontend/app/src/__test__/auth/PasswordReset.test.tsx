import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import PasswordReset from '../../templates/auth/PasswordReset';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';

const pass = process.env.REACT_APP_TEST_PASSWORD;
const token = process.env.REACT_APP_TEST_TOKEN;

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

describe('PasswordReset Components Test Cases', () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it('Should check if PasswordReset is rendering all elements correctly', async () => {
    const history = createMemoryHistory();
    history.push(`/password/reset/?token=${token}&email=test@mail.com`);

    render(
      <Provider store={store}>
        <Router history={history}>
          <PasswordReset />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId('title')).toBeTruthy();
    expect(screen.getByTestId('input-password')).toBeTruthy();
    expect(screen.getByTestId('input-confirm-password')).toBeTruthy();
    expect(screen.getByTestId('button-submit')).toBeTruthy();
  });

  it('Should display an error if the entered value is invalid', async () => {
    const history = createMemoryHistory();
    history.push(`/password/reset/?token=${token}&email=test@mail.com`);

    render(
      <Provider store={store}>
        <Router history={history}>
          <PasswordReset />
        </Router>
      </Provider>
    );

    const password = screen.getByTestId('input-password');
    const confirmPassword = screen.getByTestId('input-confirm-password');
    userEvent.type(password, 'test');
    userEvent.type(confirmPassword, 'test');

    userEvent.click(screen.getByTestId('button-submit'));
    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });

  it('Alert should not be displayed when PasswordReset is successful', async () => {
    const history = createMemoryHistory();
    history.push(`/password/reset/?token=${token}&email=test@mail.com`);

    render(
      <Provider store={store}>
        <Router history={history}>
          <PasswordReset />
        </Router>
      </Provider>
    );

    const password = screen.getByTestId('input-password');
    const confirmPassword = screen.getByTestId('input-confirm-password');
    userEvent.type(password, String(pass));
    userEvent.type(confirmPassword, String(pass));

    userEvent.click(screen.getByTestId('button-submit'));
    expect(await screen.queryAllByRole('alert')).toHaveLength(0);
  });
});

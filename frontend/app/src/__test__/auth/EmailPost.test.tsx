import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import { createMemoryHistory } from 'history';
import EmailPost from '../../templates/auth/EmailPost';
import { Router } from 'react-router-dom';

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

describe('EmailPost Components Test Cases', () => {
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

  it('Should check if EmailPost is rendering all elements correctly', async () => {
    const history = createMemoryHistory();
    history.push('/reset');

    render(
      <Provider store={store}>
        <Router history={history}>
          <EmailPost />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('title')).toBeTruthy();
    expect(screen.getByTestId('input-email')).toBeTruthy();
    expect(screen.getByTestId('button-submit')).toBeTruthy();
  });

  it('Should display an error if the entered value is invalid', async () => {
    const history = createMemoryHistory();
    history.push('/reset');

    render(
      <Provider store={store}>
        <Router history={history}>
          <EmailPost />
        </Router>
      </Provider>
    );

    const email = screen.getByTestId('input-email');
    userEvent.type(email, 'test');

    userEvent.click(screen.getByTestId('button-submit'));
    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });

  it('Alert should not be displayed when EmailPost is successful', async () => {
    server.use(
      rest.post(`${apiUrl}password/reset/`, (req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    const history = createMemoryHistory();
    history.push('/reset');

    render(
      <Provider store={store}>
        <Router history={history}>
          <EmailPost />
        </Router>
      </Provider>
    );

    const email = screen.getByTestId('input-email');
    userEvent.type(email, 'test@mail.com');

    userEvent.click(screen.getByTestId('button-submit'));

    expect(await screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it('Error should be displayed when entering an unregistered email address', async () => {
    server.use(
      rest.post(`${apiUrl}password/reset/`, (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    const history = createMemoryHistory();
    history.push('/reset');

    render(
      <Provider store={store}>
        <Router history={history}>
          <EmailPost />
        </Router>
      </Provider>
    );

    const email = screen.getByTestId('input-email');
    userEvent.type(email, 'test');

    userEvent.click(screen.getByTestId('button-submit'));
    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });
});

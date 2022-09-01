import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import layoutReducer from '../../features/layout/layoutSlice';
import { createMemoryHistory } from 'history';
import Profile from '../../templates/profile/Profile';
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

describe('Profile Components Test Cases', () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        layout: layoutReducer,
      },
    });
  });

  it('Should check if Profile is rendering all elements correctly', async () => {
    const history = createMemoryHistory();
    history.push('/profile');

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
          <Profile />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('title')).toBeTruthy();
    expect(screen.getByTestId('label-name')).toBeTruthy();
    expect(screen.getByTestId('label-age')).toBeTruthy();
    expect(screen.getByTestId('label-job')).toBeTruthy();
    expect(screen.getByTestId('label-composition')).toBeTruthy();
    expect(screen.getByTestId('label-income')).toBeTruthy();
    expect(screen.getByTestId('label-body')).toBeTruthy();
    expect(screen.getByTestId('input-name')).toBeTruthy();
    expect(screen.getByTestId('input-age')).toBeTruthy();
    expect(screen.getByTestId('select-job')).toBeTruthy();
    expect(screen.getByTestId('select-income')).toBeTruthy();
    expect(screen.getByTestId('select-composition')).toBeTruthy();
    expect(screen.getByTestId('input-body')).toBeTruthy();
    expect(screen.getByTestId('button-submit')).toBeTruthy();
  });

  it('Should display an error if the entered value is invalid', async () => {
    const history = createMemoryHistory();
    history.push('/profile');

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
          <Profile />
        </Router>
      </Provider>
    );

    const name = screen.getByTestId('input-name');
    const age = screen.getByTestId('input-age');
    const job = screen.getByTestId('select-job');
    const income = screen.getByTestId('select-income');
    const composition = screen.getByTestId('select-composition');
    const body = screen.getByTestId('input-body');
    const submitButton = screen.getByTestId('button-submit');

    userEvent.type(name, '');
    userEvent.type(age, '');
    userEvent.selectOptions(job, '');
    userEvent.selectOptions(income, '');
    userEvent.selectOptions(composition, '');
    userEvent.type(body, '');
    userEvent.click(submitButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(5);
  });

  it('Alert should not be displayed when Profile is successfull', async () => {
    const history = createMemoryHistory();
    history.push('/profile');

    server.use(
      rest.post(`${apiUrl}api/create/profile`, (req, res, ctx) => {
        return res(ctx.status(200));
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
          <Profile />
        </Router>
      </Provider>
    );

    const name = screen.getByTestId('input-name');
    const age = screen.getByTestId('input-age');
    const job = screen.getByTestId('select-job');
    const income = screen.getByTestId('select-income');
    const composition = screen.getByTestId('select-composition');
    const body = screen.getByTestId('input-body');
    const submitButton = screen.getByTestId('button-submit');

    userEvent.type(name, 'test');
    fireEvent.change(age, { target: { value: '15' } });
    userEvent.selectOptions(job, 'ソフトウエア・インターネット・通信');
    userEvent.selectOptions(income, '200~400万円');
    userEvent.selectOptions(composition, '1人暮らし');
    userEvent.type(body, 'test');
    userEvent.click(submitButton);

    expect(await screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it('Should show an alert when Profile fails', async () => {
    const history = createMemoryHistory();
    history.push('/profile');

    server.use(
      rest.post(`${apiUrl}api/create/profile`, (req, res, ctx) => {
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
          <Profile />
        </Router>
      </Provider>
    );

    const name = screen.getByTestId('input-name');
    const age = screen.getByTestId('input-age');
    const job = screen.getByTestId('select-job');
    const income = screen.getByTestId('select-income');
    const composition = screen.getByTestId('select-composition');
    const body = screen.getByTestId('input-body');
    const submitButton = screen.getByTestId('button-submit');

    userEvent.type(name, 'test');
    fireEvent.change(age, { target: { value: '15' } });
    userEvent.selectOptions(job, 'ソフトウエア・インターネット・通信');
    userEvent.selectOptions(income, '200~400万円');
    userEvent.selectOptions(composition, '1人暮らし');
    userEvent.type(body, 'test');
    userEvent.click(submitButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(1);
  });
});

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import userEvent from '@testing-library/user-event';
import Contact from '../../templates/contact/Contact';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

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

describe('Contact Components Test Cases', () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });
  it('Should check if Contact is rendering all elements correctly', async () => {
    const history = createMemoryHistory();
    history.push('/contact');

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
          <Contact />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('title')).toBeTruthy();
    expect(screen.getByTestId('img')).toBeTruthy();
    expect(screen.getByTestId('input-name')).toBeTruthy();
    expect(screen.getByTestId('input-email')).toBeTruthy();
    expect(screen.getByTestId('input-message')).toBeTruthy();
    expect(screen.getByTestId('button-submit')).toBeTruthy();
  });

  it('Should display an error if the entered value is invalid', async () => {
    const history = createMemoryHistory();
    history.push('/contact');

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
          <Contact />
        </Router>
      </Provider>
    );

    const name = screen.getByTestId('input-name');
    const email = screen.getByTestId('input-email');
    const message = screen.getByTestId('input-message');
    userEvent.type(name, '');
    userEvent.type(email, 'test');
    userEvent.type(message, '');

    userEvent.click(screen.getByTestId('button-submit'));
    expect(await screen.findAllByRole('alert')).toHaveLength(2);
  });

  it('Alert should not be displayed when Contact is successful', async () => {
    const history = createMemoryHistory();
    history.push('/contact');

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
          <Contact />
        </Router>
      </Provider>
    );

    const name = screen.getByTestId('input-name');
    const email = screen.getByTestId('input-email');
    const message = screen.getByTestId('input-message');
    userEvent.type(name, 'test');
    userEvent.type(email, 'test@mail.com');
    userEvent.type(message, 'test');

    userEvent.click(screen.getByTestId('button-submit'));
    expect(await screen.queryAllByRole('alert')).toHaveLength(0);
  });
});

import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import layoutReducer from '../../features/layout/layoutSlice';
import accountBookReducer from '../../features/accountBook/accountBookSlice';
import MyPage from '../../templates/mypage/MyPage';
import { createMemoryHistory } from 'history';
import Modal from 'react-modal';
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

describe('MyPage Components Test Cases', () => {
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

  // it('Should render Loading Component before data is retrieved', async () => {
  //   const history = createMemoryHistory();
  //   history.push('/mypage');

  //   global.matchMedia =
  //     global.matchMedia ||
  //     function () {
  //       return {
  //         addListener: jest.fn(),
  //         removeListener: jest.fn(),
  //       };
  //     };

  //   render(
  //     <Provider store={store}>
  //       <Router history={history}>
  //         <MyPage />
  //       </Router>
  //     </Provider>
  //   );

  //   expect(screen.getByTestId('loading')).toBeTruthy();
  // });

  // it('Should check if Mypage is rendering all elements correctly', async () => {
  //   const history = createMemoryHistory();
  //   history.push('/mypage');

  //   global.matchMedia =
  //     global.matchMedia ||
  //     function () {
  //       return {
  //         addListener: jest.fn(),
  //         removeListener: jest.fn(),
  //       };
  //     };

  //   render(
  //     <Provider store={store}>
  //       <Router history={history}>
  //         <MyPage />
  //       </Router>
  //     </Provider>
  //   );

  //   await waitFor(() => {
  //     expect(screen.findByTestId('currentMonth')).toBeTruthy;
  //     expect(screen.findByTestId('prevMonth')).toBeTruthy;
  //     expect(screen.findByTestId('nextMonth')).toBeTruthy;
  //   });
  // });

  // it('Make sure the click event is working fine', async () => {
  //   const history = createMemoryHistory();
  //   history.push('/mypage');

  //   global.matchMedia =
  //     global.matchMedia ||
  //     function () {
  //       return {
  //         addListener: jest.fn(),
  //         removeListener: jest.fn(),
  //       };
  //     };

  //   render(
  //     <Provider store={store}>
  //       <Router history={history}>
  //         <MyPage />
  //       </Router>
  //     </Provider>
  //   );

  //   const date = new Date();
  //   const selectedYear = String(date.getFullYear());
  //   const selectedMonth = String(date.getMonth() + 1);

  //   setTimeout(() => {
  //     const prevMonth: any = screen.findByTestId('prevMonth');
  //     const nextMonth: any = screen.findByTestId('nextMonth');

  //     userEvent.click(prevMonth);
  //     userEvent.click(nextMonth);

  //     expect(`${selectedYear}年${selectedMonth}月の家計簿`).toBeInTheDocument;
  //   }, 20000);
  // });

  // it('Check if the obtained profile is displayed', async () => {
  //   const history = createMemoryHistory();
  //   history.push('/mypage');

  //   server.use(
  //     rest.get(`${apiUrl}api/profile`, (req, res, ctx) => {
  //       return res(
  //         ctx.status(200),
  //         ctx.json([
  //           {
  //             id: '1',
  //             name: 'user',
  //             job: '不動産',
  //             age: 21,
  //             income: '0~200万円',
  //             composition: '1人暮らし',
  //             body: 'test',
  //             img: '',
  //             user_id: 1,
  //           },
  //         ])
  //       );
  //     })
  //   );

  //   global.matchMedia =
  //     global.matchMedia ||
  //     function () {
  //       return {
  //         addListener: jest.fn(),
  //         removeListener: jest.fn(),
  //       };
  //     };

  //   render(
  //     <Provider store={store}>
  //       <Router history={history}>
  //         <MyPage />
  //       </Router>
  //     </Provider>
  //   );

  //   expect(await screen.findByTestId('age'));
  //   expect(await screen.findByTestId('job'));
  //   expect(await screen.findByTestId('income'));
  //   expect(await screen.findByTestId('composition'));
  //   expect(await screen.findByTestId('body'));

  //   await expect('年齢：21歳').toBeInTheDocument;
  //   await expect('職業：不動産').toBeInTheDocument;
  //   await expect('年収：0~200万円').toBeInTheDocument;
  //   await expect('世帯：1人暮らし').toBeInTheDocument;
  //   await expect('test').toBeInTheDocument;
  // });

  // it('Check if the obtained profile is displayed', async () => {
  //   const history = createMemoryHistory();
  //   history.push('/mypage');

  //   server.use(
  //     rest.get(`${apiUrl}api/profile`, (req, res, ctx) => {
  //       return res(
  //         ctx.status(200),
  //         ctx.json([
  //           {
  //             id: '1',
  //             name: 'user',
  //             job: '不動産',
  //             age: 21,
  //             income: '0~200万円',
  //             composition: '1人暮らし',
  //             body: 'test',
  //             img: '',
  //             user_id: 1,
  //           },
  //         ])
  //       );
  //     })
  //   );

  //   global.matchMedia =
  //     global.matchMedia ||
  //     function () {
  //       return {
  //         addListener: jest.fn(),
  //         removeListener: jest.fn(),
  //       };
  //     };

  //   render(
  //     <Provider store={store}>
  //       <Router history={history}>
  //         <MyPage />
  //       </Router>
  //     </Provider>
  //   );

  //   expect(await screen.findByTestId('age'));
  //   expect(await screen.findByTestId('job'));
  //   expect(await screen.findByTestId('income'));
  //   expect(await screen.findByTestId('composition'));
  //   expect(await screen.findByTestId('body'));

  //   await expect('年齢：21歳').toBeInTheDocument;
  //   await expect('職業：不動産').toBeInTheDocument;
  //   await expect('年収：0~200万円').toBeInTheDocument;
  //   await expect('世帯：1人暮らし').toBeInTheDocument;
  //   await expect('test').toBeInTheDocument;
  // });
});

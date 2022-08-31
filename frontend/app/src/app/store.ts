import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import layoutReducer from '../features/layout/layoutSlice';
import accountBookReducer from '../features/accountBook/accountBookSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    accountBook: accountBookReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

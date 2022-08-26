import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { AUTH_STATE, AUTH_DATA } from '../../types/Types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const initialState: AUTH_STATE = {
  signIn: false,
  user: {
    id: 0,
    email: '',
  },
  message: '',
  successOrFailure: false,
};

export const registUser = createAsyncThunk(
  'auth/register',
  async (data: AUTH_DATA) => {
    const res = await axios.post(
      `${apiUrl}api/register/`,
      {
        email: data.email,
        password: data.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    isSignIn(state) {
      state.signIn = true;
    },
    isSignOut(state) {
      state.signIn = false;
    },
    editMessage(state, action) {
      state.message = action.payload;
    },
    isSuccessOrFailure(state, action) {
      state.successOrFailure = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { isSignIn, isSignOut, editMessage, isSuccessOrFailure } =
  authSlice.actions;

export const selectIsSignIn = (state: RootState) => state.auth.signIn;
export const selectUserId = (state: RootState) => state.auth.user.id;
export const selectMessage = (state: RootState) => state.auth.message;
export const selectSuccessOrFailure = (state: RootState) =>
  state.auth.successOrFailure;

export default authSlice.reducer;

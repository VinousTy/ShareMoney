import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { AUTH_STATE, AUTH_DATA, NEW_PASSWORD } from '../../types/Types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const initialState: AUTH_STATE = {
  signIn: false,
  isEmail: false,
  isNotEmail: false,
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

export const postEmail = createAsyncThunk(
  'auth/email',
  async (data: { email: string }) => {
    const res = await axios.post(`${apiUrl}api/password/request`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  }
);

export const newPassword = createAsyncThunk(
  'new/password',
  async (data: NEW_PASSWORD) => {
    const res = await axios.post(
      `${apiUrl}api/password/reset/${data.token}`,
      data,
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
  extraReducers: (builder) => {
    builder.addCase(postEmail.fulfilled, (state, action) => {
      state.isEmail = true;
      state.isNotEmail = false;
    });
    builder.addCase(postEmail.rejected, (state, action) => {
      state.isEmail = false;
      state.isNotEmail = true;
    });
    builder.addCase(newPassword.fulfilled, (state, action) => {
      state.message = action.payload;
      state.successOrFailure = true;
    });
    builder.addCase(newPassword.rejected, (state, action) => {
      state.message = action.payload;
      state.successOrFailure = false;
    });
  },
});

export const { isSignIn, isSignOut, editMessage, isSuccessOrFailure } =
  authSlice.actions;

export const selectIsSignIn = (state: RootState) => state.auth.signIn;
export const selectIsNotEmail = (state: RootState) => state.auth.isNotEmail;
export const selectIsEmail = (state: RootState) => state.auth.isEmail;
export const selectUserId = (state: RootState) => state.auth.user.id;
export const selectMessage = (state: RootState) => state.auth.message;
export const selectSuccessOrFailure = (state: RootState) =>
  state.auth.successOrFailure;

export default authSlice.reducer;

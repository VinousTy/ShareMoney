import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import {
  AUTH_STATE,
  AUTH_DATA,
  NEW_PASSWORD,
  PROFILE_CREATE,
  PROFILE_UPDATE,
  COOKIE,
} from '../../types/Types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const initialState: AUTH_STATE = {
  signIn: false,
  isEmail: false,
  isNotEmail: false,
  user: {
    id: '',
    email: '',
  },
  myProf: {
    id: '',
    name: '',
    job: '',
    age: 0,
    income: '',
    composition: '',
    body: '',
    img: '',
    user_id: '',
  },
  profiles: [
    {
      id: '',
      name: '',
      job: '',
      age: 0,
      income: '',
      composition: '',
      body: '',
      img: '',
      user_id: '',
    },
  ],
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

export const getUser = createAsyncThunk('get/user', async (cookie: COOKIE) => {
  const res = await axios.get(`${apiUrl}api/user/`, {
    headers: {
      Authorization: `Bearer ${cookie.Bearer}`,
    },
  });
  return res.data;
});

export const createProfile = createAsyncThunk(
  'profile/post',
  async (profile: PROFILE_CREATE) => {
    const uploadData = new FormData();
    uploadData.append('name', profile.name);
    uploadData.append('age', String(profile.age));
    uploadData.append('job', profile.job);
    uploadData.append('income', profile.income);
    uploadData.append('composition', profile.composition);
    uploadData.append('body', profile.body);
    profile.img && uploadData.append('img', profile.img, profile.img.name);
    const res = await axios.post(`${apiUrl}api/create/profile`, uploadData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${profile.cookie.Bearer}`,
      },
    });
    return res.data;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/put',
  async (profile: PROFILE_UPDATE) => {
    const uploadData = new FormData();
    uploadData.append('_method', 'put');
    uploadData.append('name', profile.name);
    uploadData.append('age', String(profile.age));
    uploadData.append('job', profile.job);
    uploadData.append('income', profile.income);
    uploadData.append('composition', profile.composition);
    uploadData.append('body', profile.body);
    profile.img && uploadData.append('img', profile.img, profile.img.name);
    const res = await axios.post(
      `${apiUrl}api/update/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${profile.cookie.Bearer}`,
        },
      }
    );
    return res.data;
  }
);

export const getMyProfile = createAsyncThunk(
  'profile/get',
  async (cookie: COOKIE) => {
    const res = await axios.get(`${apiUrl}api/profile/`, {
      headers: {
        Authorization: `Bearer ${cookie.Bearer}`,
      },
    });
    return res.data[0];
  }
);

export const getProfiles = createAsyncThunk(
  'profile/list',
  async (cookie: COOKIE) => {
    const res = await axios.get(`${apiUrl}api/profile/list`, {
      headers: {
        Authorization: `Bearer ${cookie.Bearer}`,
      },
    });
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
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
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
    builder.addCase(createProfile.fulfilled, (state, action) => {
      state.myProf = action.payload;
      state.message = 'ログインしました';
      state.successOrFailure = true;
    });
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      state.myProf = action.payload;
    });
    builder.addCase(getProfiles.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.myProf = action.payload;
      state.profiles = state.profiles.map((prof) =>
        prof.id === action.payload.id ? action.payload : prof
      );
      state.message = action.payload.message;
      state.successOrFailure = true;
    });
  },
});

export const { isSignIn, isSignOut, editMessage, isSuccessOrFailure } =
  authSlice.actions;

export const selectIsSignIn = (state: RootState) => state.auth.signIn;
export const selectIsNotEmail = (state: RootState) => state.auth.isNotEmail;
export const selectIsEmail = (state: RootState) => state.auth.isEmail;
export const selectUserId = (state: RootState) => state.auth.user.id;
export const selectProfile = (state: RootState) => state.auth.myProf;
export const selectProfiles = (state: RootState) => state.auth.profiles;
export const selectMessage = (state: RootState) => state.auth.message;
export const selectSuccessOrFailure = (state: RootState) =>
  state.auth.successOrFailure;

export default authSlice.reducer;

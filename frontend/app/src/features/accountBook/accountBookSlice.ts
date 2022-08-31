import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import {
  ACCOUNTBOOK_STATE,
  COOKIE,
  CREATE_ACCOUNT_BOOK,
  UPDATE_ACCOUNT_BOOK,
  DELETE_COST,
} from '../../types/Types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const initialState: ACCOUNTBOOK_STATE = {
  accountBook: [
    {
      id: '',
      date: '',
      monthly_income: 0,
      user_id: 0,
      expenses: [
        {
          expenseItem: '',
          cost: 0,
        },
      ],
      likes: [''],
      bookmarks: [''],
    },
  ],
  message: '',
  successOrFailure: true,
};

export const createAccountBook = createAsyncThunk(
  'create/accountBook',
  async (data: CREATE_ACCOUNT_BOOK) => {
    const uploadData = new FormData();
    const res = await axios
      .post(`${apiUrl}api/create/accountbook`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      })
      .then((res) => {
        uploadData.append('expenses', JSON.stringify(data.expenses));
        console.log(res.data);
        uploadData.append('account_book_id', res.data.id);
        axios.post(`${apiUrl}api/create/expense`, uploadData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        });
        return res.data;
      });
    return res.data;
  }
);

export const getMyAccountBook = createAsyncThunk(
  'get/accountBook',
  async (cookie: COOKIE) => {
    const res = await axios.get(`${apiUrl}api/accountbook`, {
      headers: {
        Authorization: `Bearer ${cookie.Bearer}`,
      },
    });
    return res.data;
  }
);

export const updateAccountBook = createAsyncThunk(
  'update/accountBook',
  async (data: UPDATE_ACCOUNT_BOOK) => {
    const uploadData = new FormData();
    uploadData.append('_method', 'put');
    uploadData.append('date', data.date);
    uploadData.append('monthly_income', String(data.monthly_income));
    const res = await axios.post(
      `${apiUrl}api/update/accountbook/${data.id}`,
      uploadData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      }
    );
    return res.data;
  }
);

export const postCosts = createAsyncThunk('post/costs', async (data: any) => {
  console.log(data);
  const uploadData = new FormData();
  uploadData.append('expenses', JSON.stringify(data.expenses));
  uploadData.append('account_book_id', data.account_book_id);
  const res = await axios.post(`${apiUrl}api/create/expense`, uploadData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.cookie.Bearer}`,
    },
  });
  return res.data;
});

export const updateCost = createAsyncThunk(
  'update/costs',
  async (data: any) => {
    const uploadData = new FormData();
    uploadData.append('_method', 'put');
    uploadData.append('expenses', JSON.stringify(data.expenses));
    uploadData.append('account_book_id', data.account_book_id);
    const res = await axios.post(
      `${apiUrl}api/update/expense/${data.account_book_id}`,
      uploadData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      }
    );
    return res.data;
  }
);

export const deleteCost = createAsyncThunk(
  'delete/costs',
  async (data: DELETE_COST) => {
    const res = await axios.post(
      `${apiUrl}api/destroy/expense/${data.id}`,
      { id: data.id },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      }
    );
    return res.data;
  }
);

export const accountBookSlice = createSlice({
  name: 'accountBook',
  initialState,
  reducers: {
    editAccountBookMessage(state, action) {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMyAccountBook.fulfilled, (state, action) => {
      return {
        ...state,
        accountBook: action.payload,
      };
    });
    builder.addCase(createAccountBook.fulfilled, (state, action) => {
      state.accountBook = action.payload;
      state.successOrFailure = true;
      state.message = '家計簿の登録が完了しました';
    });
    builder.addCase(updateAccountBook.fulfilled, (state, action) => {
      state.accountBook = state.accountBook.map((accountId) =>
        accountId.id === action.payload.id ? action.payload : accountId
      );
      state.successOrFailure = true;
      state.message = action.payload;
    });
  },
});

export const { editAccountBookMessage } = accountBookSlice.actions;

export const selectAccountBook = (state: RootState) =>
  state.accountBook.accountBook;
export const selectAccountBookMessage = (state: RootState) =>
  state.accountBook.message;
export const selectAccountBookSuccessOrFailure = (state: RootState) =>
  state.accountBook.successOrFailure;

export default accountBookSlice.reducer;
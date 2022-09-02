import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import {
  ACCOUNTBOOK_STATE,
  COOKIE,
  CREATE_ACCOUNT_BOOK,
  UPDATE_ACCOUNT_BOOK,
  DELETE_COST,
  DATE,
  DELETE_ACCOUNT_BOOK,
  DETAIL_POST_ACCOUNT_BOOK_DATA,
  POST_ACCOUNT_BOOK,
  UPDATE_POST_ACCOUNT_BOOK,
  LIKE_BOOKMARK,
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
  accountBookChart: {
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
    costs: [
      {
        expenseItem: '',
        cost: 0,
      },
    ],
    totalCost: [
      {
        cost: 0,
      },
    ],
  },
  accountBooks: {
    accountBook: [
      {
        id: 0,
        date: '',
        user_id: 0,
        monthly_income: 0,
        likes: [
          {
            id: 0,
            user_id: 0,
            post_account_book_id: 0,
          },
        ],
        bookmarks: [
          {
            id: 0,
            user_id: 0,
            post_account_book_id: 0,
          },
        ],
      },
    ],
    costs: [
      {
        date: '',
        expenseItem: '',
        cost: 0,
        user_id: 0,
      },
    ],
    income: [
      {
        date: '',
        monthly_income: 0,
        user_id: 0,
      },
    ],
  },
  postMyAccountBook: {
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
    costs: [
      {
        expenseItem: '',
        cost: 0,
      },
    ],
    totalCost: [
      {
        cost: 0,
      },
    ],
  },
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

export const getSelectDateAccountBook = createAsyncThunk(
  'edit/accountBook',
  async (data: DATE) => {
    const pad2 = (n: number) => {
      return n < 10 ? '0' + n : n;
    };
    const str =
      data.date.getFullYear().toString() +
      '-' +
      pad2(data.date.getMonth() + 1) +
      '-' +
      pad2(data.date.getDate());

    const result = str.substring(0, 7);
    const res = await axios.post(
      `${apiUrl}api/edit/accountbook`,
      { date: result },
      {
        headers: {
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      }
    );
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

export const deleteAccountBook = createAsyncThunk(
  'delete/accountBook',
  async (data: DELETE_ACCOUNT_BOOK) => {
    const result = data.date.slice(0, 7);
    const res = await axios.post(
      `${apiUrl}api/destroy/accountbook/${data.id}`,
      { id: data.id, date: result },
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

export const getAccountBookList = createAsyncThunk(
  'get/accountBookList',
  async (cookie: COOKIE) => {
    const res = await axios.get(`${apiUrl}api/accountbook/list`, {
      headers: {
        Authorization: `Bearer ${cookie.Bearer}`,
      },
    });
    return res.data;
  }
);

export const createPostAccountBook = createAsyncThunk(
  'share/accountBook',
  async (data: POST_ACCOUNT_BOOK) => {
    const uploadData = new FormData();
    const result = data.date.slice(0, 7);
    uploadData.append('date', result);
    uploadData.append('monthly_income', String(data.monthly_income));
    uploadData.append('user_id', String(data.user_id));

    const res = await axios
      .post(`${apiUrl}api/create/postAccountBook`, uploadData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      })
      .then((res) => {
        console.log(res.data.post_account_book.id);
        uploadData.append('expenses', JSON.stringify(data.expenses));
        uploadData.append(
          'post_account_book_id',
          res.data.post_account_book.id
        );
        axios.post(`${apiUrl}api/create/postExpense`, uploadData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        });
      });
  }
);

export const updatePostAccountBook = createAsyncThunk(
  'shareUpdate/accountBook',
  async (data: UPDATE_POST_ACCOUNT_BOOK) => {
    const uploadData = new FormData();
    const result = data.date.slice(0, 7);
    uploadData.append('date', result);
    uploadData.append('monthly_income', String(data.monthly_income));
    uploadData.append('user_id', String(data.user_id));

    const res = await axios.post(
      `${apiUrl}api/update/postAccountBook/${data.id}`,
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

export const createPostCost = createAsyncThunk(
  'create/postCosts',
  async (data: any) => {
    const uploadData = new FormData();
    uploadData.append('expenses', JSON.stringify(data.expenses));
    uploadData.append('post_account_book_id', data.id);
    const res = await axios.post(
      `${apiUrl}api/create/postExpense`,
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

export const updatePostCost = createAsyncThunk(
  'update/postCosts',
  async (data: any) => {
    const uploadData = new FormData();
    uploadData.append('_method', 'put');
    uploadData.append('expenses', JSON.stringify(data.expenses));
    uploadData.append('post_account_book_id', data.id);
    const res = await axios.post(
      `${apiUrl}api/update/postExpense/${data.id}`,
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

export const deletePostCost = createAsyncThunk(
  'update/postCosts',
  async (data: any) => {
    const uploadData = new FormData();
    uploadData.append('expenses', JSON.stringify(data.expenses));
    uploadData.append('post_account_book_id', data.id);
    const res = await axios.post(
      `${apiUrl}api/destroy/postExpense/${data.id}`,
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

export const postAccountBookDetail = createAsyncThunk(
  'post/postAccountBookDetail',
  async (data: DETAIL_POST_ACCOUNT_BOOK_DATA) => {
    const pad2 = (n: number) => {
      return n < 10 ? '0' + n : n;
    };
    const str =
      data.date.getFullYear().toString() +
      '-' +
      pad2(data.date.getMonth() + 1) +
      '-' +
      pad2(data.date.getDate());

    const result = str.substring(0, 7);
    const res = await axios.post(
      `${apiUrl}api/detail/postAccountBook`,
      {
        date: result,
      },
      {
        headers: {
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      }
    );
    return res.data;
  }
);

export const patchLiked = createAsyncThunk(
  'post/like',
  async (data: LIKE_BOOKMARK) => {
    const currentLiked = data.current;
    const uploadData = new FormData();

    let overlapped = false;
    currentLiked.forEach((current) => {
      if (current.user_id === data.push_icon_user_id) {
        overlapped = true;
      } else {
        uploadData.append('liked', String(current));
      }
    });

    if (!overlapped) {
      uploadData.append('user_id', String(data.push_icon_user_id));
      uploadData.append(
        'post_account_book_id',
        String(data.post_account_book_id)
      );
      const res = await axios.post(`${apiUrl}api/like`, uploadData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      });
      return res.data;
    }
    uploadData.append('user_id', String(data.push_icon_user_id));
    uploadData.append(
      'post_account_book_id',
      String(data.post_account_book_id)
    );
    const res = await axios.post(`${apiUrl}api/destroy/like`, uploadData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.cookie.Bearer}`,
      },
    });
    return res.data;
  }
);

export const patchBookmark = createAsyncThunk(
  'post/bookmark',
  async (data: LIKE_BOOKMARK) => {
    const currentBookmarked = data.current;
    const uploadData = new FormData();

    let overlapped = false;
    currentBookmarked.forEach((current) => {
      if (current.user_id === data.push_icon_user_id) {
        overlapped = true;
      } else {
        uploadData.append('bookmarked', String(current));
      }
    });

    if (!overlapped) {
      uploadData.append('user_id', String(data.push_icon_user_id));
      uploadData.append(
        'post_account_book_id',
        String(data.post_account_book_id)
      );

      const res = await axios.post(`${apiUrl}api/bookmark`, uploadData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      });
      return res.data;
    }
    uploadData.append('user_id', String(data.push_icon_user_id));
    uploadData.append(
      'post_account_book_id',
      String(data.post_account_book_id)
    );

    const res = await axios.post(`${apiUrl}api/destroy/bookmark`, uploadData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.cookie.Bearer}`,
      },
    });
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
    builder.addCase(getSelectDateAccountBook.fulfilled, (state, action) => {
      return {
        ...state,
        accountBookChart: action.payload,
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
    builder.addCase(deleteAccountBook.fulfilled, (state, action) => {
      return {
        ...state,
        accountBookChart: action.payload,
        showMessage: true,
        message: '削除が完了しました',
        successOrFailure: true,
      };
    });
    builder.addCase(getAccountBookList.fulfilled, (state, action) => {
      return {
        ...state,
        accountBooks: action.payload,
      };
    });
    builder.addCase(createPostAccountBook.fulfilled, (state, action) => {
      state.successOrFailure = true;
      state.message = '家計簿をシェアしました';
    });
    builder.addCase(updatePostAccountBook.fulfilled, (state, action) => {
      state.accountBook = state.accountBook.map((accountId) =>
        accountId.id === action.payload.id ? action.payload : accountId
      );
      state.successOrFailure = true;
      state.message = action.payload;
    });
    builder.addCase(postAccountBookDetail.fulfilled, (state, action) => {
      return {
        ...state,
        postMyAccountBook: action.payload,
      };
    });
    builder.addCase(patchLiked.fulfilled, (state, action) => {
      return {
        ...state,
        accountBooks: action.payload,
      };
    });
    builder.addCase(patchBookmark.fulfilled, (state, action) => {
      return {
        ...state,
        accountBooks: action.payload,
      };
    });
  },
});

export const { editAccountBookMessage } = accountBookSlice.actions;

export const selectAccountBook = (state: RootState) =>
  state.accountBook.accountBook;
export const selectAccountBookChart = (state: RootState) =>
  state.accountBook.accountBookChart;
export const selectAccountBooks = (state: RootState) =>
  state.accountBook.accountBooks;
export const selectPostMyAccountBook = (state: RootState) =>
  state.accountBook.postMyAccountBook;
export const selectAccountBookMessage = (state: RootState) =>
  state.accountBook.message;
export const selectAccountBookSuccessOrFailure = (state: RootState) =>
  state.accountBook.successOrFailure;

export default accountBookSlice.reducer;

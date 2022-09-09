import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import {
  ACCOUNTBOOK_STATE,
  COOKIE,
  CREATE_ACCOUNT_BOOK,
  UPDATE_ACCOUNT_BOOK,
  DATE,
  DELETE_ACCOUNT_BOOK,
  DETAIL_POST_ACCOUNT_BOOK_DATA,
  POST_ACCOUNT_BOOK,
  UPDATE_POST_ACCOUNT_BOOK,
  LIKE_BOOKMARK,
  SEARCH_NAME,
  DETAIL_DATA,
  ID_COOKIE,
} from '../../types/Types';

const apiUrl = process.env.REACT_APP_DEV_API_URL;

const initialState: ACCOUNTBOOK_STATE = {
  accountBook: [
    {
      id: '',
      date: '',
      monthly_income: 0,
      user_id: '',
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
        user_id: '',
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
        id: '',
        date: '',
        user_id: '',
        monthly_income: 0,
        likes: [
          {
            id: '',
            user_id: '',
            post_account_book_id: '',
          },
        ],
        bookmarks: [
          {
            id: '',
            user_id: '',
            post_account_book_id: '',
          },
        ],
      },
    ],
    costs: [
      {
        date: '',
        expenseItem: '',
        cost: 0,
        user_id: '',
      },
    ],
    income: [
      {
        date: '',
        monthly_income: 0,
        user_id: '',
      },
    ],
  },
  accountBookDetail: {
    profile: [
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
    costs: [
      {
        expenseItem: '',
        cost: 0,
      },
    ],
    income: [
      {
        monthly_income: 0,
      },
    ],
  },
  postMyAccountBook: {
    accountBook: [
      {
        id: '',
        date: '',
        monthly_income: 0,
        user_id: '',
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
  recomendAccountBooks: {
    accountBook: [
      {
        id: '',
        date: '',
        user_id: '',
        monthly_income: 0,
        likes: [
          {
            id: '',
            user_id: '',
            post_account_book_id: '',
          },
        ],
        bookmarks: [
          {
            id: '',
            user_id: '',
            post_account_book_id: '',
          },
        ],
      },
    ],
    costs: [
      {
        date: '',
        expenseItem: '',
        cost: 0,
        user_id: '',
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
  async (data: ID_COOKIE) => {
    const res = await axios.get(`${apiUrl}api/accountbook/`, {
      headers: {
        Authorization: `Bearer ${data.cookie.Bearer}`,
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

export const accountBookDetail = createAsyncThunk(
  'get/accountBookDetail',
  async (data: DETAIL_DATA) => {
    const res = await axios.post(
      `${apiUrl}api/detail/accountbook`,
      {
        user_id: data.user_id,
        search_date: data.date,
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
  async (data: ID_COOKIE) => {
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

export const searchGetAccountBook = createAsyncThunk(
  'search/accountBook',
  async (data: SEARCH_NAME) => {
    if (data.type === 'username') {
      const res = await axios.get(
        `${apiUrl}api/accountbook/list?name=${data.name}`,
        {
          headers: {
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'income') {
      const res = await axios.get(
        `${apiUrl}api/accountbook/list?income=${data.name}`,
        {
          headers: {
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'job') {
      const res = await axios.get(
        `${apiUrl}api/accountbook/list?job=${data.name}`,
        {
          headers: {
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'composition') {
      const res = await axios.get(
        `${apiUrl}api/accountbook/list?composition=${data.name}`,
        {
          headers: {
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    }
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

export const recomendAccountBookList = createAsyncThunk(
  'recomend/accountBookList',
  async (data: any) => {
    const uploadData = new FormData();
    uploadData.append('name', data.name);
    uploadData.append('job', data.job);
    uploadData.append('income', data.income);
    uploadData.append('composition', data.composition);
    const res = await axios.post(
      `${apiUrl}api/recomend/accountbook`,
      uploadData,
      {
        headers: {
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

export const getBookmarkAccountBook = createAsyncThunk(
  'get/bookmarkAccountBook',
  async (cookie: COOKIE) => {
    const res = await axios.get(`${apiUrl}api/bookmark/accountbook`, {
      headers: {
        Authorization: `Bearer ${cookie.Bearer}`,
      },
    });
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
      if (data.type === 'username') {
        const res = await axios.post(
          `${apiUrl}api/like?name=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else if (data.type === 'income') {
        const res = await axios.post(
          `${apiUrl}api/like?income=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else if (data.type === 'job') {
        const res = await axios.post(
          `${apiUrl}api/like?job=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else if (data.type === 'composition') {
        const res = await axios.post(
          `${apiUrl}api/like?composition=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else if (data.type === 'bookmark') {
        const res = await axios.post(
          `${apiUrl}api/like?bookmark=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else {
        const res = await axios.post(`${apiUrl}api/like`, uploadData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        });
        return res.data;
      }
    }
    uploadData.append('user_id', String(data.push_icon_user_id));
    uploadData.append(
      'post_account_book_id',
      String(data.post_account_book_id)
    );
    if (data.type === 'username') {
      const res = await axios.post(
        `${apiUrl}api/destroy/like?name=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'income') {
      const res = await axios.post(
        `${apiUrl}api/destroy/like?income=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'job') {
      const res = await axios.post(
        `${apiUrl}api/destroy/like?job=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'composition') {
      const res = await axios.post(
        `${apiUrl}api/destroy/like?composition=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'bookmark') {
      const res = await axios.post(
        `${apiUrl}api/destroy/like?bookmark=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else {
      const res = await axios.post(`${apiUrl}api/destroy/like`, uploadData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.cookie.Bearer}`,
        },
      });
      return res.data;
    }
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
      if (data.type === 'username') {
        const res = await axios.post(
          `${apiUrl}api/bookmark?name=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else if (data.type === 'income') {
        const res = await axios.post(
          `${apiUrl}api/bookmark?income=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else if (data.type === 'job') {
        const res = await axios.post(
          `${apiUrl}api/bookmark?job=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else if (data.type === 'composition') {
        const res = await axios.post(
          `${apiUrl}api/bookmark?composition=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else if (data.type === 'bookmark') {
        const res = await axios.post(
          `${apiUrl}api/bookmark?bookmark=${data.name}`,
          uploadData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.cookie.Bearer}`,
            },
          }
        );
        return res.data;
      } else {
        const res = await axios.post(`${apiUrl}api/bookmark`, uploadData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        });
        return res.data;
      }
    }
    uploadData.append('user_id', String(data.push_icon_user_id));
    uploadData.append(
      'post_account_book_id',
      String(data.post_account_book_id)
    );
    if (data.type === 'username') {
      const res = await axios.post(
        `${apiUrl}api/destroy/bookmark?name=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'income') {
      const res = await axios.post(
        `${apiUrl}api/destroy/bookmark?income=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'job') {
      const res = await axios.post(
        `${apiUrl}api/destroy/bookmark?job=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'composition') {
      const res = await axios.post(
        `${apiUrl}api/destroy/bookmark?composition=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else if (data.type === 'bookmark') {
      const res = await axios.post(
        `${apiUrl}api/destroy/bookmark?bookmark=${data.name}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.cookie.Bearer}`,
          },
        }
      );
      return res.data;
    } else {
      const res = await axios.post(
        `${apiUrl}api/destroy/bookmark`,
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
    builder.addCase(accountBookDetail.fulfilled, (state, action) => {
      return {
        ...state,
        accountBookDetail: action.payload,
      };
    });
    builder.addCase(getAccountBookList.fulfilled, (state, action) => {
      return {
        ...state,
        accountBooks: action.payload,
      };
    });
    builder.addCase(searchGetAccountBook.fulfilled, (state, action) => {
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
    builder.addCase(recomendAccountBookList.fulfilled, (state, action) => {
      return {
        ...state,
        recomendAccountBooks: action.payload,
      };
    });
    builder.addCase(getBookmarkAccountBook.fulfilled, (state, action) => {
      return {
        ...state,
        accountBooks: action.payload,
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
export const selectAccountBookDetail = (state: RootState) =>
  state.accountBook.accountBookDetail;
export const selectPostMyAccountBook = (state: RootState) =>
  state.accountBook.postMyAccountBook;
export const selectRecomendAccountBooks = (state: RootState) =>
  state.accountBook.recomendAccountBooks;
export const selectAccountBookMessage = (state: RootState) =>
  state.accountBook.message;
export const selectAccountBookSuccessOrFailure = (state: RootState) =>
  state.accountBook.successOrFailure;

export default accountBookSlice.reducer;

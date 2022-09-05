export interface File extends Blob {
  readonly lastModified: string;
  readonly name: string;
}

export interface COOKIE {
  [x: string]: string;
}

export interface DATE {
  date: any;
  cookie: {
    [x: string]: string;
  };
}

export interface AUTH_STATE {
  signIn: boolean;
  isEmail: boolean;
  isNotEmail: boolean;
  user: {
    id: string;
    email: string;
  };
  myProf: {
    id: string;
    name: string;
    age: number;
    job: string;
    income: string;
    composition: string;
    body: string;
    img: any;
    user_id: string;
  };
  profiles: {
    id: string;
    name: string;
    age: number;
    job: string;
    income: string;
    composition: string;
    body: string;
    img: any;
    user_id: string;
  }[];
  message: any;
  successOrFailure: boolean;
}

export interface AUTH_DATA {
  email: string;
  password: string;
}

export interface NEW_PASSWORD {
  email: string | null;
  password: string;
  token: string | null;
}

export interface PROFILE_CREATE {
  name: string;
  age: number;
  job: string;
  income: string;
  composition: string;
  body: string;
  img: any;
  user_id: string;
  cookie: {
    [x: string]: string;
  };
}

export interface PROFILE_UPDATE {
  id: string;
  name: string;
  age: number;
  job: string;
  income: string;
  composition: string;
  body: string;
  img: any;
  user_id: string;
  cookie: {
    [x: string]: string;
  };
}

export interface LAYOUT_STATE {
  isLoading: boolean;
  isDrawer: boolean;
  isDeleteModal: boolean;
  isPostModal: boolean;
  isSearchModal: boolean;
}

export interface ACCOUNTBOOK_STATE {
  accountBook: {
    id: string;
    date: string;
    user_id: string;
    monthly_income: number;
    expenses: {
      expenseItem: string;
      cost: number;
    }[];
    likes: string[];
    bookmarks: string[];
  }[];
  accountBookChart: {
    accountBook: {
      id: string;
      date: string;
      user_id: string;
      monthly_income: number;
      expenses: {
        expenseItem: string;
        cost: number;
      }[];
      likes: string[];
      bookmarks: string[];
    }[];
    costs: {
      expenseItem: string;
      cost: number;
    }[];
    totalCost: {
      cost: number;
    }[];
  };
  accountBooks: {
    accountBook: {
      id: string;
      date: string;
      user_id: string;
      monthly_income: number;
      likes: {
        id: string;
        user_id: string;
        post_account_book_id: string;
      }[];
      bookmarks: {
        id: string;
        user_id: string;
        post_account_book_id: string;
      }[];
    }[];
    costs: {
      date: string;
      expenseItem: string;
      cost: number;
      user_id: string;
    }[];
    income: {
      date: string;
      monthly_income: number;
      user_id: string;
    }[];
  };
  accountBookDetail: {
    profile: {
      id: string;
      name: string;
      age: number;
      job: string;
      income: string;
      composition: string;
      body: string;
      img: any;
      user_id: string;
    }[];
    costs: {
      expenseItem: string;
      cost: number;
    }[];
    income: {
      monthly_income: number;
    }[];
  };
  postMyAccountBook: {
    accountBook: {
      id: string;
      date: string;
      user_id: string;
      monthly_income: number;
      expenses: {
        expenseItem: string;
        cost: number;
      }[];
      likes: string[];
      bookmarks: string[];
    }[];
    costs: {
      expenseItem: string;
      cost: number;
    }[];
    totalCost: {
      cost: number;
    }[];
  };
  message: string;
  successOrFailure: boolean;
}

export interface CREATE_ACCOUNT_BOOK {
  date: string;
  monthly_income: number;
  cookie: {
    [x: string]: string;
  };
  expenses: any;
}

export interface UPDATE_ACCOUNT_BOOK {
  id: string;
  date: string;
  monthly_income: number;
  cookie: {
    [x: string]: string;
  };
}

export interface DETAIL_DATA {
  user_id: string;
  date: string;
  cookie: {
    [x: string]: string;
  };
}

export interface DELETE_ACCOUNT_BOOK {
  id: string;
  date: any;
  cookie: {
    [x: string]: string;
  };
}

export interface ID_COOKIE {
  id: string;
  cookie: {
    [x: string]: string;
  };
}

export interface POST_ACCOUNT_BOOK {
  date: string;
  monthly_income: number;
  user_id: string;
  expenses: any;
  cookie: {
    [x: string]: string;
  };
}

export interface UPDATE_POST_ACCOUNT_BOOK {
  id: string;
  date: string;
  monthly_income: number;
  user_id: string;
  expenses: any;
  cookie: {
    [x: string]: string;
  };
}

export interface DETAIL_POST_ACCOUNT_BOOK_DATA {
  user_id: string;
  date: any;
  cookie: {
    [x: string]: string;
  };
}

export interface SEARCH_NAME {
  name: string;
  type: string;
  cookie: {
    [x: string]: string;
  };
}

export interface LIKE_BOOKMARK {
  post_account_book_id: string;
  current: {
    id: string;
    user_id: string;
    post_account_book_id: string;
  }[];
  income: number;
  push_icon_user_id: string;
  cookie: {
    [x: string]: string;
  };
}

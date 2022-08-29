export interface File extends Blob {
  readonly lastModified: string;
  readonly name: string;
}

export interface COOKIE {
  [x: string]: string;
}

export interface AUTH_STATE {
  signIn: boolean;
  isEmail: boolean;
  isNotEmail: boolean;
  user: {
    id: number;
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
    user_id: number;
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
    user_id: number;
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
  user_id: number;
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
  user_id: number;
  cookie: {
    [x: string]: string;
  };
}

export interface LAYOUT_STATE {
  isDrawer: boolean;
}

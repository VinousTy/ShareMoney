export interface File extends Blob {
  readonly lastModified: string;
  readonly name: string;
}

export interface AUTH_STATE {
  signIn: boolean;
  isEmail: boolean;
  isNotEmail: boolean;
  user: {
    id: number;
    email: string;
  };
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

export interface LAYOUT_STATE {
  isDrawer: boolean;
}

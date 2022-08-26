export interface File extends Blob {
  readonly lastModified: string;
  readonly name: string;
}

export interface AUTH_STATE {
  signIn: boolean;
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

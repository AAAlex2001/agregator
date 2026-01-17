export interface LoginFormData {
  login: string;
  password: string;
}

export interface LoginState {
  login: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  access_token?: string;
  token_type?: string;
}

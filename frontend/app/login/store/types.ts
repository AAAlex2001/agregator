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
  id: number;
  email: string | null;
  phone: string | null;
  created_at: string;
}

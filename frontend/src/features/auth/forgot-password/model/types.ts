export type ForgotPasswordStep = 1 | 2 | 3 | 4;

export interface ForgotPasswordState {
  step: ForgotPasswordStep;
  email: string;
  code: string;
  password: string;
  repeatPassword: string;
  isLoading: boolean;
  error: string | null;
}

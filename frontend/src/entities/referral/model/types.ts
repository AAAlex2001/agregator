/** Ссылка и результаты приглашений; суммы выражены во внутренних баллах. */
export interface ReferralOverview {
  referral_url: string;
  reward_points: number;
  balance_points: number;
  pool_total_points: number;
  pool_remaining_points: number;
  accepting_referrals: boolean;
  invited_count: number;
  pending_count: number;
  rewarded_count: number;
  pool_exhausted_count: number;
  rejected_count: number;
}

/** Загрузка данных реферальной программы текущего аккаунта. */
export interface ReferralState {
  overview: ReferralOverview | null;
  error: string | null;
  isLoading: boolean;
  attempt: number;
}

/** Результат запроса приглашений или повтор загрузки после ошибки. */
export type ReferralAction =
  | { type: "load/retry" }
  | { type: "load/success"; overview: ReferralOverview }
  | { type: "load/error"; error: string };

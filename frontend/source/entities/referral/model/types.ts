/** Данные реферальной программы. Суммы — во внутренних баллах («плюсах»), не в рублях. */
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

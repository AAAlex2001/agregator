/** Данные реферальной программы. Денежные суммы приходят в копейках. */
export interface ReferralOverview {
  referral_code: string;
  referral_url: string;
  reward_kopecks: number;
  balance_kopecks: number;
  pool_total_kopecks: number;
  pool_remaining_kopecks: number;
  accepting_referrals: boolean;
  invited_count: number;
  pending_count: number;
  rewarded_count: number;
  pool_exhausted_count: number;
  rejected_count: number;
  withdrawal_allowed: boolean;
}

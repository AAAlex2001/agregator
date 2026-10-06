/** Данные реферальной программы. Денежные суммы приходят в копейках. */
export interface ReferralOverview {
  referral_url: string;
  reward_kopecks: number;
  balance_kopecks: number;
  accepting_referrals: boolean;
  invited_count: number;
  pending_count: number;
  rewarded_count: number;
  pool_exhausted_count: number;
  rejected_count: number;
}

import type { ReferralOverview } from "@/source/entities/referral";

export interface ReferralState {
  overview: ReferralOverview | null;
  error: string | null;
  isLoading: boolean;
  attempt: number;
}

export type ReferralAction =
  | { type: "load/retry" }
  | { type: "load/success"; overview: ReferralOverview }
  | { type: "load/error"; error: string };

import type { ReferralOverview } from "@/source/entities/referral";

export interface ReferralState {
  overview: ReferralOverview | null;
  error: string | null;
  isLoading: boolean;
  requestNumber: number;
}

export type ReferralAction =
  | { type: "LOAD_REQUESTED" }
  | { type: "LOAD_SUCCEEDED"; overview: ReferralOverview }
  | { type: "LOAD_FAILED"; error: string };

export interface CopyLinkState {
  copied: boolean;
  isCopying: boolean;
  error: string | null;
}

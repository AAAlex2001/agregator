import type {
  TechExpertDocumentCard,
  TechExpertDocumentsResult,
  TechExpertTip,
} from "@/source/entities/tech-expert";

export interface TechExpertState {
  query: string;
  tips: TechExpertTip[];
  tipsOpen: boolean;
  results: TechExpertDocumentsResult | null;
  searching: boolean;
  error: string | null;
  detail: TechExpertDocumentCard | null;
  detailLoading: boolean;
}

export type TechExpertAction =
  | { type: "query"; value: string }
  | { type: "tips"; tips: TechExpertTip[] }
  | { type: "tipsOpen"; value: boolean }
  | { type: "searchStart" }
  | { type: "searchSuccess"; results: TechExpertDocumentsResult }
  | { type: "searchError"; error: string }
  | { type: "detailStart" }
  | { type: "detailSuccess"; detail: TechExpertDocumentCard }
  | { type: "detailError"; error: string }
  | { type: "detailClose" }
  | { type: "reset" };

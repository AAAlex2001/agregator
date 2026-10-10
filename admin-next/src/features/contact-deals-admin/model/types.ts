import type { Deal, DealList } from "@/entities/contact-deal";

export type DealsState = {
  filter: string;
  list: DealList | null;
  loading: boolean;
  failed: boolean;
};

export type DealsAction =
  | { type: "load/start"; filter: string }
  | { type: "load/success"; list: DealList }
  | { type: "load/error" };

export type DealState = {
  status: "loading" | "ready" | "failed";
  deal: Deal | null;
  note: string;
  pending: boolean;
};

export type DealAction =
  | { type: "load/success"; deal: Deal }
  | { type: "load/error" }
  | { type: "note/change"; value: string }
  | { type: "release/start" }
  | { type: "release/finish" };

import type { Lead } from "@/entities/lead";
import type { LeadList } from "../api/leads";

export type LeadsState = {
  filter: string;
  page: number;
  list: LeadList | null;
  loading: boolean;
  failed: boolean;
  pendingId: number | null;
  noteFor: number | null;
  noteDraft: string;
};

export type LeadsAction =
  | { type: "load/start"; filter: string; page: number }
  | { type: "load/success"; list: LeadList }
  | { type: "load/error" }
  | { type: "request/start"; id: number }
  | { type: "request/finish" }
  | { type: "lead/changed"; lead: Lead }
  | { type: "note/open"; lead: Lead }
  | { type: "note/change"; value: string }
  | { type: "note/close" };

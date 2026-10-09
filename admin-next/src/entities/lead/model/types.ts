import type { BadgeTone } from "@/shared/ui/badge";

export type LeadStatus = "NEW" | "IN_WORK" | "DONE" | "SPAM";

export type Lead = {
  id: number;
  direction: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  inn: string;
  region: string;
  work_kinds: string;
  object_name: string;
  task: string;
  deadline: string;
  budget: string;
  source_url: string;
  comment: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Новая",
  IN_WORK: "В работе",
  DONE: "Обработана",
  SPAM: "Спам",
};

export const LEAD_STATUS_TONES: Record<LeadStatus, BadgeTone> = {
  NEW: "info",
  IN_WORK: "warning",
  DONE: "success",
  SPAM: "neutral",
};

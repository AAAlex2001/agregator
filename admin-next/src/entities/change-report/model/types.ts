import type { BadgeTone } from "@/shared/ui/badge";

export type ChangeReportStatus = "NEW" | "REVIEWED" | "APPLIED";

export type ChangeReport = {
  id: number;
  clarification_id: number;
  description: string;
  status: ChangeReportStatus;
  created_at: string;
};

export type ChangeReportList = {
  items: ChangeReport[];
};

export const CHANGE_REPORT_STATUS_LABELS: Record<ChangeReportStatus, string> = {
  NEW: "Новое",
  REVIEWED: "Рассмотрено",
  APPLIED: "Применено",
};

export const CHANGE_REPORT_STATUS_TONES: Record<ChangeReportStatus, BadgeTone> = {
  NEW: "info",
  REVIEWED: "warning",
  APPLIED: "success",
};

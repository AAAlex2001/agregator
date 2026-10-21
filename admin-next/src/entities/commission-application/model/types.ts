import type { BadgeTone } from "@/shared/ui/badge";

export type ApplicationStatus = "new" | "reviewing" | "accepted" | "rejected";

export type Attestation = {
  area_code: string;
  object_code: string;
  category: number;
};

export type CommissionApplication = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  attestations: Attestation[];
  message: string | null;
  status: ApplicationStatus;
  decision: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export type ApplicationList = {
  items: CommissionApplication[];
  total: number;
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "Новая",
  reviewing: "На рассмотрении",
  accepted: "Принят",
  rejected: "Отказ",
};

export const APPLICATION_STATUS_TONES: Record<ApplicationStatus, BadgeTone> = {
  new: "accent",
  reviewing: "info",
  accepted: "success",
  rejected: "danger",
};

export const APPLICATION_STATUSES = Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[];

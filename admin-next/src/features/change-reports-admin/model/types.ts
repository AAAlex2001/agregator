import type { ChangeReport } from "@/entities/change-report";

export type ChangeReportsState = {
  filter: string;
  items: ChangeReport[] | null;
  loading: boolean;
  failed: boolean;
  pendingId: number | null;
};

export type ChangeReportsAction =
  | { type: "load/start"; filter: string }
  | { type: "load/success"; items: ChangeReport[] }
  | { type: "load/error" }
  | { type: "request/start"; id: number }
  | { type: "request/finish" }
  | { type: "report/changed"; report: ChangeReport };

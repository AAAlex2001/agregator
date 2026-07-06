import type { ExpertiseType } from "@/entites/expertise";

export type StringField = "title" | "sum" | "startDate" | "deadline" | "responsesDeadline" | "comment";
export type FileKey = "technical" | "contract" | "company";
export type FlagKey = "requiresExpert" | "requiresLicense";

export interface CreateOrderState {
  step: number;
  busy: boolean;
  done: boolean;
  title: string;
  sum: string;
  startDate: string;
  deadline: string;
  responsesDeadline: string;
  requiresExpert: boolean;
  requiresLicense: boolean;
  types: ExpertiseType[];
  opos: string[];
  comment: string;
  files: Record<FileKey, File | null>;
  otherFiles: File[];
}

export type CreateOrderAction =
  | { type: "set"; key: StringField; value: string }
  | { type: "flag"; key: FlagKey; value: boolean }
  | { type: "types"; value: ExpertiseType[] }
  | { type: "opos"; value: string[] }
  | { type: "file"; key: FileKey; file: File | null }
  | { type: "addOther"; files: File[] }
  | { type: "removeOther"; index: number }
  | { type: "step"; value: number }
  | { type: "busy"; value: boolean }
  | { type: "done" }
  | { type: "reset" };

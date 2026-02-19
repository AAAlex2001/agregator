import type { Badge } from "@/app/expert/orders/types";
export type { Badge } from "@/app/expert/orders/types";

export interface OrderDetails {
  id: number;
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  sum: string;
  commissionAmount: string;
  commissionAmountRaw: number;
  comment: string;
  technicalFiles: string[];
}

export interface Step2FormData {
  deadline: string;
  costEstimate: number;
  comment: string;
  files: File[];
  keepFiles: string[];
}

export interface Step2InitialData {
  deadline: string;
  costEstimate: string;
  comment: string;
  existingFiles: string[];
}

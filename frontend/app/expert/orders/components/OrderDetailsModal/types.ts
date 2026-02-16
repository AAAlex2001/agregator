import type { Badge } from "@/app/expert/orders/types";
export type { Badge } from "@/app/expert/orders/types";

export interface OrderDetails {
  id: number;
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  sum: string;
  comment: string;
  technicalFiles: string[];
}

export interface Step2FormData {
  deadline: string;
  costEstimate: number;
  comment: string;
  files: File[];
}

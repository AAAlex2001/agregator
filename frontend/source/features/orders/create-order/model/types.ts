import type { Dispatch } from "react";
import type { DirectionOrderDetails } from "@/source/entities/directions/order";
import type { ApplicantBlock } from "@/source/entities/directions/shared";
import type { OrderDocuments, OrderFilesPayload, OrderWorkType, SingleDocumentCategory } from "@/source/entities/order";

export type OrderTextField = "title" | "company" | "startDate" | "deadline" | "responsesDeadline" | "budget" | "comment";

export interface OrderFormState {
  title: string;
  company: string;
  startDate: string;
  deadline: string;
  responsesDeadline: string;
  budget: string;
  comment: string;
  workType: OrderWorkType;
  requiresExpert: boolean;
  requiresLicense: boolean;
  badgeCodes: string[];
  details: DirectionOrderDetails | null;
  applicant: ApplicantBlock;
  documents: OrderDocuments;
  files: OrderFilesPayload;
  copySourceOrderId: number | null;
  notifyResponders: boolean;
}

export type OrderFormAction =
  | { type: "field"; field: OrderTextField; value: string }
  | { type: "workType"; value: OrderWorkType }
  | { type: "requiresExpert"; value: boolean }
  | { type: "requiresLicense"; value: boolean }
  | { type: "badgeCodes"; value: string[] }
  | { type: "details"; value: DirectionOrderDetails }
  | { type: "file"; category: SingleDocumentCategory; file: File | null }
  | { type: "otherFiles"; files: File[] }
  | { type: "removeFile"; file: File }
  | { type: "removeDocument"; category: SingleDocumentCategory }
  | { type: "removeOtherDocument"; path: string }
  | { type: "notifyResponders"; value: boolean };

export interface OrderFormProps {
  state: OrderFormState;
  dispatch: Dispatch<OrderFormAction>;
}

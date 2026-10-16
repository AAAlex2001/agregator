import type { LocalFile } from "@/shared/lib/local-file";
import type { OrderApplicant } from "./details/applicant";
import type { AuditOrderDocument, AuditOrderDocumentKey } from "./details/audit";
import type { OrderListItem } from "./order-list-item";
import type { SingleOrderDocumentCategory } from "./order-request";
import type { OrderDocuments } from "./types";

/** Направление, доступное заказчику при выборе вида работ. */
export interface OrderWorkOption {
  value: OrderListItem["work_type"];
  label: string;
  description: string;
}

/** Профиль заказчика, из которого форма берёт заявителя, организацию и направления. */
export interface OrderCustomer {
  first_name: string | null;
  last_name: string | null;
  inn: string | null;
  phone: string | null;
  email: string | null;
  company_data: { value?: string } | null;
  directions: string[];
}

/** Профиль заказчика и необязательный образец для заполнения формы. */
export interface OrderFormSource {
  customer: OrderCustomer;
  badgeCodes: string[];
  template?: OrderListItem;
  copySourceOrderId: number | null;
}

/** Новые документы с временными адресами для галереи и предпросмотра заказа. */
export interface OrderFormFiles {
  technical: LocalFile | null;
  contract: LocalFile | null;
  company: LocalFile | null;
  other: LocalFile[];
}

/** Редактируемые условия и документы нового, копируемого или существующего заказа. */
export interface OrderFormValues {
  title: string;
  company: string;
  startDate: string;
  deadline: string;
  responsesDeadline: string;
  budget: string;
  comment: string;
  workType: OrderListItem["work_type"];
  requiresExpert: boolean;
  requiresLicense: boolean;
  badgeCodes: string[];
  details: OrderListItem["details"];
  applicant: OrderApplicant;
  documents: OrderDocuments;
  files: OrderFormFiles;
  copySourceOrderId: number | null;
  notifyResponders: boolean;
}

/** Текстовые поля, изменяемые независимо от направления заказа. */
export type OrderTextField =
  | "title"
  | "company"
  | "startDate"
  | "deadline"
  | "responsesDeadline"
  | "budget"
  | "comment";

/** Изменения полей, требований и документов формы заказа. */
export type OrderFormAction =
  | { type: "field/changed"; field: OrderTextField; value: string }
  | { type: "direction/changed"; workType: OrderListItem["work_type"] }
  | { type: "expert/changed"; isRequired: boolean }
  | { type: "license/changed"; isRequired: boolean }
  | { type: "badges/changed"; codes: string[] }
  | {
      type: "details/changed";
      workType: OrderListItem["work_type"];
      details: OrderListItem["details"];
    }
  | {
      type: "audit-document/changed";
      field: AuditOrderDocumentKey;
      document: AuditOrderDocument | null;
    }
  | {
      type: "file/selected";
      category: SingleOrderDocumentCategory;
      file: LocalFile;
    }
  | { type: "other-files/added"; files: LocalFile[] }
  | { type: "file/removed"; file: File }
  | { type: "document/removed"; category: SingleOrderDocumentCategory }
  | { type: "other-document/removed"; path: string }
  | { type: "notifications/changed"; isEnabled: boolean };

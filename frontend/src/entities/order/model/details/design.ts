import type { OrderApplicant } from "./applicant";

/** Объект, состав документации и согласования в заказе на проектирование. */
export interface DesignOrderDetails extends OrderApplicant {
  object_name: string;
  construction_city: string;
  doc_categories: string[];
  documentation_kinds: string[];
  scope: "FULL" | "SECTIONS";
  sections: string[];
  approvals: string[];
  approvals_other: string;
}

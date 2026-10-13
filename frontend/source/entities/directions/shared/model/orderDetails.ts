import type { CatalogOption } from "./catalog";

export type OrderDetailKind = "text" | "flag" | "list" | "file" | "opo_list";

export interface OrderDetailField {
  key: string;
  label: string;
  kind: OrderDetailKind;
  wide?: boolean;
  valueLabels?: Record<string, string>;
}

export interface OrderDetailGroup {
  title: string;
  fields: OrderDetailField[];
}

export const APPLICANT_GROUP: OrderDetailGroup = {
  title: "Заявитель",
  fields: [
    { key: "applicant_full_name", label: "ФИО представителя", kind: "text" },
    { key: "applicant_position", label: "Должность", kind: "text" },
    { key: "applicant_organization", label: "Организация", kind: "text" },
    { key: "applicant_inn", label: "ИНН", kind: "text" },
    { key: "applicant_phone", label: "Телефон", kind: "text" },
    { key: "applicant_email", label: "Email", kind: "text" },
  ],
};

export function catalogLabels(items: CatalogOption[]): Record<string, string> {
  return Object.fromEntries(items.map((item) => [item.code, item.title]));
}

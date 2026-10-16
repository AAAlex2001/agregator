import { AuditCustomerProfileEditor } from "@/widgets/audit-customer-profile";
import type { DirectionTab } from "../model/types";

/** Анкета заказчика: отдельно заполняется только аудит СУПБ. */
export const CUSTOMER_DIRECTIONS: DirectionTab[] = [
  {
    id: "AUDIT_SUPB",
    label: "Аудит СУПБ",
    editor: <AuditCustomerProfileEditor />,
  },
];

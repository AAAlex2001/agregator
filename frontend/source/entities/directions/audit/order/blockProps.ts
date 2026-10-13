import type { AuditOrderDetails } from "./types";

export interface AuditBlockProps {
  value: AuditOrderDetails;
  onChange: (value: AuditOrderDetails) => void;
}

import { auditOrderDetails } from "@/source/entities/directions/audit";
import { cadastralOrderDetails } from "@/source/entities/directions/cadastral";
import { designOrderDetails } from "@/source/entities/directions/design";
import { ecologyOrderDetails } from "@/source/entities/directions/ecology";
import { forensicOrderDetails } from "@/source/entities/directions/forensic";
import { laboratoryOrderDetails } from "@/source/entities/directions/laboratory";
import { researchOrderDetails } from "@/source/entities/directions/research";
import type { OrderDetailField, OrderDetailGroup } from "@/source/entities/directions/shared";
import { surveyOrderDetails } from "@/source/entities/directions/survey";
import { techDiagOrderDetails } from "@/source/entities/directions/tech-diag";
import type { OrderWorkType } from "./workTypes";

export const EXECUTOR_REQUIREMENT_HINTS = ["Звание", "Должность", "Стаж"] as const;

const GROUPS: Partial<Record<OrderWorkType, OrderDetailGroup[]>> = {
  CADASTRAL: cadastralOrderDetails,
  FORENSIC: forensicOrderDetails,
  RESEARCH: researchOrderDetails,
  LABORATORY: laboratoryOrderDetails,
  AUDIT_SUPB: auditOrderDetails,
  TECH_DIAG: techDiagOrderDetails,
  DESIGN: designOrderDetails,
  ECOLOGY: ecologyOrderDetails,
  SURVEY: surveyOrderDetails,
};

export function orderDetailGroups(workType: OrderWorkType): OrderDetailGroup[] {
  return GROUPS[workType] ?? [];
}

export function formatOrderDetailValue(field: OrderDetailField, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (field.kind === "flag") return value ? "Да" : "Нет";
  if (field.kind === "list") return (value as string[]).map((item) => field.valueLabels?.[item] ?? item).join(", ");
  if (field.kind === "file") return (value as { name: string }).name;
  if (field.kind === "opo_list") {
    return (value as { registration_number: string; name: string }[])
      .map((item) => [item.registration_number, item.name].filter(Boolean).join(" — "))
      .filter(Boolean)
      .join("\n");
  }
  return field.valueLabels?.[String(value)] ?? String(value);
}

import type { OrderCardData } from "@/source/entities/order";
import { TABLE, type ExpertiseType } from "@/source/shared/ui/ExpertiseCodesModal/expertiseCodes.data";
import type { OrderFormValues } from "./schema";

export function getDefaultValues(editTarget?: OrderCardData): OrderFormValues {
  if (!editTarget) {
    return {
      title: "",
      company: "",
      deadline: "",
      responsesDeadline: "",
      budget: "",
      selectionsByType: {},
      comment: "",
    };
  }

  return {
    title: editTarget.title,
    company: editTarget.company,
    deadline: editTarget.deadlineRaw,
    responsesDeadline: editTarget.responsesDeadline ?? "",
    budget: editTarget.sumAmountRaw > 0 ? String(editTarget.sumAmountRaw / 100) : "",
    selectionsByType: {},
    comment: editTarget.comment,
  };
}

function flattenCodes(selections: Record<string, string[]>): string[] {
  return Object.entries(selections).flatMap(([type, opos]) =>
    opos.flatMap((opo) => TABLE[opo]?.[type as ExpertiseType] ?? []),
  );
}

export function buildCreatePayload(values: OrderFormValues, files: File[], userId: number) {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    deadline: values.deadline,
    responses_deadline: values.responsesDeadline || undefined,
    sum_amount: values.budget ? Number.parseInt(values.budget, 10) * 100 : 0,
    badge_codes: flattenCodes(values.selectionsByType),
    comment: values.comment.trim(),
    customer_id: userId,
    files,
  };
}

export function buildUpdatePayload(values: OrderFormValues, files: File[], keepFiles: string[]) {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    deadline: values.deadline,
    responses_deadline: values.responsesDeadline || undefined,
    sum_amount: values.budget ? Number.parseInt(values.budget, 10) * 100 : 0,
    badge_codes: flattenCodes(values.selectionsByType),
    comment: values.comment.trim(),
    files,
    keepFiles,
  };
}

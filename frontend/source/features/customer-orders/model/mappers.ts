import type { OrderCardData } from "@/source/entities/order";
import {
  cell,
  type ExpertiseType,
} from "@/source/entities/expertise";
import type { OrderFormValues } from "./schema";

function parseBadges(badges: { text: string }[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const { text } of badges) {
    const match = text.trim().match(/^Э([\d.]+)\s+(.+)$/);
    if (!match) continue;
    const [, opo, rawType] = match;
    const type = rawType as ExpertiseType;
    if (cell(opo, type).length === 0) continue;
    const list = result[type] ?? (result[type] = []);
    if (!list.includes(opo)) list.push(opo);
  }
  return result;
}

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
    selectionsByType: parseBadges(editTarget.badgesRaw),
    comment: editTarget.comment,
  };
}

function flattenCodes(selections: Record<string, string[]>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const [type, opos] of Object.entries(selections)) {
    for (const opo of opos) {
      for (const code of cell(opo, type as ExpertiseType)) {
        if (!seen.has(code)) {
          seen.add(code);
          result.push(code);
        }
      }
    }
  }
  return result;
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

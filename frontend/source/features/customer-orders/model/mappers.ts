import type { Badge, BadgeVariant, OrderCardData } from "@/source/entities/order";
import {
  cell,
  type ExpertiseType,
} from "@/source/entities/expertise";
import type { DocumentsFormState } from "./formFiles";
import type { OrderFormValues } from "./schema";

const TYPE_VARIANT: Record<string, BadgeVariant> = {
  "ТУ": "orange",
  "КЛ": "blue",
  "ТП": "blue",
  "КЛ/ТП": "blue",
  "ЗС": "green",
  "Д": "brown",
  "ОБ": "gray",
};

function codeToVariant(code: string): BadgeVariant {
  const parts = code.split(" ", 2);
  if (parts.length < 2) return "orange";
  return TYPE_VARIANT[parts[1].trim()] ?? "orange";
}

export function buildPreviewBadges(selections: Record<string, string[]>): Badge[] {
  const seen = new Set<string>();
  const result: Badge[] = [];
  for (const [type, opos] of Object.entries(selections)) {
    for (const opo of opos) {
      for (const code of cell(opo, type as ExpertiseType)) {
        if (!seen.has(code)) {
          seen.add(code);
          result.push({ text: code, variant: codeToVariant(code) });
        }
      }
    }
  }
  return result;
}

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

export function buildCreatePayload(values: OrderFormValues, documents: DocumentsFormState, userId: number) {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    deadline: values.deadline,
    responses_deadline: values.responsesDeadline || undefined,
    sum_amount: values.budget ? Number.parseInt(values.budget, 10) * 100 : 0,
    badge_codes: flattenCodes(values.selectionsByType),
    comment: values.comment.trim(),
    customer_id: userId,
    documents,
  };
}

export function buildUpdatePayload(values: OrderFormValues, documents: DocumentsFormState) {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    deadline: values.deadline,
    responses_deadline: values.responsesDeadline || undefined,
    sum_amount: values.budget ? Number.parseInt(values.budget, 10) * 100 : 0,
    badge_codes: flattenCodes(values.selectionsByType),
    comment: values.comment.trim(),
    documents,
  };
}

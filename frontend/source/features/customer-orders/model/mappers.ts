import type { OrderCardData } from "@/source/entities/order";
import type { OrderFormValues } from "./schema";

export function getDefaultValues(editTarget?: OrderCardData): OrderFormValues {
  if (!editTarget) {
    return {
      title: "",
      company: "",
      deadline: "",
      responsesDeadline: "",
      budget: "",
      selectedBadgeVariants: [],
      typicalNamesMap: {},
      comment: "",
    };
  }

  const selectedBadgeVariants = [...new Set(editTarget.badgesRaw.map((badge) => badge.variant))];
  const typicalNamesMap: Record<string, string> = {};

  for (const variant of selectedBadgeVariants) {
    const names = editTarget.badgesRaw
      .filter((badge) => badge.variant === variant)
      .map((badge) => {
        const [prefix, ...rest] = badge.text.trim().split(/\s+/);
        if (!rest.length) return "";
        return badge.text.slice(prefix.length).trim();
      })
      .filter(Boolean);

    typicalNamesMap[variant] = names.join(", ");
  }

  return {
    title: editTarget.title,
    company: editTarget.company,
    deadline: editTarget.deadlineRaw,
    responsesDeadline: editTarget.responsesDeadline ?? "",
    budget: editTarget.sumAmountRaw > 0 ? String(editTarget.sumAmountRaw / 100) : "",
    selectedBadgeVariants,
    typicalNamesMap,
    comment: editTarget.comment,
  };
}

function buildBadgeInputs(selectedBadgeVariants: string[], typicalNamesMap: Record<string, string>) {
  return selectedBadgeVariants.map((variant) => ({
    variant,
    names: (typicalNamesMap[variant] ?? "").trim(),
  }));
}

export function buildCreatePayload(values: OrderFormValues, files: File[], userId: number) {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    deadline: values.deadline,
    responses_deadline: values.responsesDeadline || undefined,
    sum_amount: values.budget ? Number.parseInt(values.budget, 10) * 100 : 0,
    badge_inputs: buildBadgeInputs(values.selectedBadgeVariants, values.typicalNamesMap),
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
    badge_inputs: buildBadgeInputs(values.selectedBadgeVariants, values.typicalNamesMap),
    comment: values.comment.trim(),
    files,
    keepFiles,
  };
}
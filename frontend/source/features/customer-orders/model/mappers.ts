import type { OrderCardData } from "@/source/entities/order";
import { flattenCodes, parseBadges } from "./expertiseBadges";
import {
  activeDirectionDetails,
  directionDetailsFromServer,
  emptyDirectionDetails,
} from "./orderDetails";
import type { DocumentsFormState } from "@/source/entities/order";
import type { OrderFormValues } from "./orderForm";

export function getDefaultValues(editTarget?: OrderCardData): OrderFormValues {
  if (!editTarget) {
    return {
      title: "",
      company: "",
      startDate: "",
      deadline: "",
      responsesDeadline: "",
      budget: "",
      selectionsByType: {},
      comment: "",
      requiresExpert: false,
      requiresLicense: false,
      workType: "EXPERTISE",
      ...emptyDirectionDetails(),
    };
  }

  return {
    title: editTarget.title,
    company: editTarget.company,
    startDate: editTarget.startDateRaw,
    deadline: editTarget.deadlineRaw,
    responsesDeadline: editTarget.responsesDeadline ?? "",
    budget: editTarget.sumAmountRaw > 0 ? String(editTarget.sumAmountRaw / 100) : "",
    selectionsByType: parseBadges(editTarget.badgesRaw),
    comment: editTarget.comment,
    requiresExpert: editTarget.requiresExpert,
    requiresLicense: editTarget.requiresLicense,
    workType: editTarget.workType,
    ...directionDetailsFromServer(editTarget.workType, editTarget.details),
  };
}

export function buildCreatePayload(values: OrderFormValues, documents: DocumentsFormState, userId: number) {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    start_date: values.startDate || undefined,
    deadline: values.deadline,
    responses_deadline: values.responsesDeadline || undefined,
    sum_amount: values.budget ? Number.parseInt(values.budget, 10) * 100 : 0,
    badge_codes: flattenCodes(values.selectionsByType),
    requires_expert: values.requiresExpert,
    requires_license: values.requiresLicense,
    work_type: values.workType,
    details: activeDirectionDetails(values.workType, values),
    comment: values.comment.trim(),
    customer_id: userId,
    documents,
  };
}

export function buildUpdatePayload(
  values: OrderFormValues,
  documents: DocumentsFormState,
  notifyResponders: boolean,
) {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    start_date: values.startDate || undefined,
    deadline: values.deadline,
    responses_deadline: values.responsesDeadline || undefined,
    sum_amount: values.budget ? Number.parseInt(values.budget, 10) * 100 : 0,
    badge_codes: flattenCodes(values.selectionsByType),
    requires_expert: values.requiresExpert,
    requires_license: values.requiresLicense,
    work_type: values.workType,
    details: activeDirectionDetails(values.workType, values),
    comment: values.comment.trim(),
    documents,
    notify_responders: notifyResponders,
  };
}

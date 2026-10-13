import type { OrderDocumentsPayload, OrderPayload } from "@/source/entities/order";
import type { OrderFormState } from "./types";

export function toOrderPayload(state: OrderFormState): OrderPayload {
  return {
    title: state.title.trim(),
    company: state.company.trim(),
    comment: state.comment.trim(),
    sum_amount: state.budget ? Number(state.budget) * 100 : 0,
    start_date: state.startDate,
    deadline: state.deadline,
    responses_deadline: state.responsesDeadline,
    requires_expert: state.requiresExpert,
    requires_license: state.requiresLicense,
    work_type: state.workType,
    badge_codes: state.badgeCodes,
    details: state.details,
  };
}

export function toOrderDocuments(state: OrderFormState): OrderDocumentsPayload {
  return { existing: state.documents, copySourceOrderId: state.copySourceOrderId, files: state.files };
}

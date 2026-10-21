import type { OrderFormValues } from "./order-form-types";
import type { OrderDocumentsRequest, OrderRequest } from "./order-request";

/** Подготавливает условия для API, переводя бюджет из рублей в копейки. */
export function getOrderRequest(values: OrderFormValues): OrderRequest {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    comment: values.comment.trim(),
    sum_amount: values.budget ? Number(values.budget) * 100 : 0,
    start_date: values.startDate,
    deadline: values.deadline,
    responses_deadline: values.responsesDeadline,
    requires_expert: values.requiresExpert,
    requires_license: values.requiresLicense,
    work_type: values.workType,
    badge_codes: values.badgeCodes,
    details: values.details,
  };
}

/** Передаёт API сохраняемые документы, новые файлы и источник копирования. */
export function getOrderDocumentsRequest(
  values: OrderFormValues,
): OrderDocumentsRequest {
  return {
    existing: values.documents,
    copySourceOrderId: values.copySourceOrderId,
    files: {
      technical: values.files.technical?.file ?? null,
      contract: values.files.contract?.file ?? null,
      company: values.files.company?.file ?? null,
      other: values.files.other.map((selected) => selected.file),
    },
  };
}

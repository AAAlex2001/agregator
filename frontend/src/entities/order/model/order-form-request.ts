import { countOrderFormFiles } from "./order-form-files";
import type { OrderFormValues } from "./order-form-types";
import type { OrderDocumentsRequest, OrderRequest } from "./order-request";

/** Возвращает первое незаполненное обязательное условие заказа. */
export function getOrderFormError(values: OrderFormValues): string {
  if (!values.startDate) {
    return "Укажите срок начала выполнения работ";
  }

  if (!values.deadline) {
    return "Укажите срок окончания выполнения работ";
  }

  if (!values.requiresExpert && !values.requiresLicense) {
    return "Выберите, что требуется: исполнитель и/или лицензия";
  }

  if (values.workType === "DESIGN" && countOrderFormFiles(values) === 0) {
    return "Приложите задание на проектирование";
  }

  return "";
}

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

import { ORDER_WORK_OPTIONS } from "../config/work-types";
import { createOrderDetails } from "./create-order-details";
import type { OrderApplicant } from "./details/applicant";
import type { OrderFormSource, OrderFormValues } from "./order-form-types";

/** Приводит дату карточки «дд.мм.гггг» к значению поля даты. */
function toInputDate(displayDate: string): string {
  const [day, month, year] = displayDate.split(".");

  return year ? `${year}-${month}-${day}` : displayDate;
}

/** Заполняет форму из профиля заказчика и выбранного заказа для правки или копии. */
export function createOrderFormValues({
  customer,
  badgeCodes,
  template,
  copySourceOrderId,
}: OrderFormSource): OrderFormValues {
  const company = customer.company_data?.value ?? "";
  const applicant: OrderApplicant = {
    applicant_full_name: [customer.last_name, customer.first_name]
      .filter(Boolean)
      .join(" "),
    applicant_position: "",
    applicant_organization: company,
    applicant_inn: customer.inn ?? "",
    applicant_phone: customer.phone ?? "",
    applicant_email: customer.email ?? "",
  };
  const firstDirection = ORDER_WORK_OPTIONS.find((option) => (
    customer.directions.includes(option.value)
  ));
  const workType = template?.work_type ?? firstDirection?.value ?? "EXPERTISE";
  const details = createOrderDetails(workType, applicant);

  return {
    title: template?.title ?? "",
    company: company || template?.company || "",
    startDate: template?.start_date ? toInputDate(template.start_date) : "",
    deadline: template ? toInputDate(template.date) : "",
    responsesDeadline: template?.responses_deadline ?? "",
    budget: template && template.sum_amount_raw > 0
      ? String(template.sum_amount_raw / 100)
      : "",
    comment: template?.comment ?? "",
    workType,
    requiresExpert: template?.requires_expert ?? false,
    requiresLicense: template?.requires_license ?? false,
    badgeCodes,
    details: details ? { ...details, ...template?.details } : null,
    applicant,
    documents: template?.documents ?? {
      technical: [],
      contract: [],
      company: [],
      other: [],
    },
    files: {
      technical: null,
      contract: null,
      company: null,
      other: [],
    },
    copySourceOrderId,
    notifyResponders: true,
  };
}

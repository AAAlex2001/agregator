import type { OrderApplicant } from "./details/applicant";
import type { OrderDetailSection } from "./types";

/** Собирает одинаковые сведения о заявителе для условий каждого направления. */
export function applicantDetails(applicant: OrderApplicant): OrderDetailSection {
  return {
    title: "Заявитель",
    rows: [
      {
        label: "ФИО представителя",
        value: applicant.applicant_full_name,
      },
      {
        label: "Должность",
        value: applicant.applicant_position,
      },
      {
        label: "Организация",
        value: applicant.applicant_organization,
      },
      {
        label: "ИНН",
        value: applicant.applicant_inn,
      },
      {
        label: "Телефон",
        value: applicant.applicant_phone,
      },
      {
        label: "Email",
        value: applicant.applicant_email,
      },
    ],
  };
}

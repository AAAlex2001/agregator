import type { ForensicOrderDetails as ForensicDetails } from "../../model/details/forensic";
import { OrderDetailSections } from "../order-detail-sections";
import { applicantDetails } from "../../model/applicant-details";

/** Условия заказа судебной экспертизы. */
interface ForensicOrderDetailsProps {
  details: ForensicDetails;
}

/** Показывает предмет судебной экспертизы и требования к эксперту. */
export function ForensicOrderDetails({ details }: ForensicOrderDetailsProps) {
  return (
    <OrderDetailSections
      sections={[
        applicantDetails(details),
        {
          title: "Экспертиза",
          rows: [
            {
              label: "Цель экспертизы",
              value: details.expertise_purpose,
              wide: true,
            },
            {
              label: "Государственный орган",
              value: details.government_body,
            },
            {
              label: "Где находится предмет экспертизы",
              value: details.city,
            },
            {
              label: "Срок проведения экспертизы",
              value: details.duration,
            },
          ],
        },
        {
          title: "Требования к эксперту",
          rows: [
            {
              label: "Требования к образованию",
              value: details.education_requirement,
              wide: true,
            },
            {
              label: "Дополнительные требования",
              value: details.extra_requirements,
              wide: true,
            },
            {
              label: "Обязателен опыт аналогичных экспертиз",
              value: details.similar_experience_required,
            },
          ],
        },
      ]}
    />
  );
}

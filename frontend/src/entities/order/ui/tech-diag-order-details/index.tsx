import type { TechDiagOrderDetails as TechDiagDetails } from "../../model/details/tech-diag";
import { OrderDetailSections } from "../order-detail-sections";
import { applicantDetails } from "../../model/applicant-details";

/** Условия заказа технического диагностирования. */
interface TechDiagOrderDetailsProps {
  details: TechDiagDetails;
}

/** Показывает цель и место технических работ и срок их выполнения. */
export function TechDiagOrderDetails({ details }: TechDiagOrderDetailsProps) {
  return (
    <OrderDetailSections
      sections={[
        applicantDetails(details),
        {
          title: "Работы",
          rows: [
            {
              label: "Цель проведения работ",
              value: details.purpose,
              wide: true,
            },
            {
              label: "Где находится объект",
              value: details.object_city,
            },
            {
              label: "Срок проведения",
              value: details.duration,
            },
          ],
        },
      ]}
    />
  );
}

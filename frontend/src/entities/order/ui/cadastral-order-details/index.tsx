import type { CadastralOrderDetails as CadastralDetails } from "../../model/details/cadastral";
import { OrderDetailSections } from "../order-detail-sections";
import { applicantDetails } from "../../model/applicant-details";

/** Условия заказа кадастровых работ. */
interface CadastralOrderDetailsProps {
  details: CadastralDetails;
}

/** Показывает объект, сроки и требования к кадастровому инженеру. */
export function CadastralOrderDetails({ details }: CadastralOrderDetailsProps) {
  return (
    <OrderDetailSections
      sections={[
        applicantDetails(details),
        {
          title: "Работы",
          rows: [
            {
              label: "Цель работ",
              value: details.work_purpose,
              wide: true,
            },
            {
              label: "Где находится объект",
              value: details.city,
            },
            {
              label: "Срок проведения работ",
              value: details.duration,
            },
          ],
        },
        {
          title: "Требования к исполнителю",
          rows: [
            {
              label: "Требования к образованию",
              value: details.education_requirement,
              wide: true,
            },
            {
              label: "Обязательное членство в СРО",
              value: details.sro_required,
            },
          ],
        },
      ]}
    />
  );
}

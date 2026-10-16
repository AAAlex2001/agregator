import type { ResearchOrderDetails as ResearchDetails } from "../../model/details/research";
import { OrderDetailSections } from "../order-detail-sections";
import { applicantDetails } from "../../model/applicant-details";

/** Условия заказа научно-исследовательских работ. */
interface ResearchOrderDetailsProps {
  details: ResearchDetails;
}

/** Показывает требования к исполнителю НИР и выезду на объект. */
export function ResearchOrderDetails({ details }: ResearchOrderDetailsProps) {
  return (
    <OrderDetailSections
      sections={[
        applicantDetails(details),
        {
          title: "Работы",
          rows: [
            {
              label: "Требования к исполнителю",
              value: details.executor_requirements.join(", "),
              wide: true,
            },
            {
              label: "Необходимость выезда на объект исследований",
              value: details.needs_site_visit,
            },
          ],
        },
      ]}
    />
  );
}

import { describeOrderOptions } from "../../model/detail-option";
import type { EcologyOrderDetails as EcologyDetails } from "../../model/details/ecology";
import { OrderDetailSections } from "../order-detail-sections";
import { ECOLOGY_WORKS } from "../../config/ecology-details";
import { applicantDetails } from "../../model/applicant-details";

/** Заявитель и перечень экологических работ в заказе. */
interface EcologyOrderDetailsProps {
  details: EcologyDetails;
}

/** Показывает требуемые экологические работы по их полным названиям. */
export function EcologyOrderDetails({ details }: EcologyOrderDetailsProps) {
  return (
    <OrderDetailSections
      sections={[
        applicantDetails(details),
        {
          title: "Работы",
          rows: [
            {
              label: "Какие работы нужны",
              value: describeOrderOptions(details.work_types, ECOLOGY_WORKS),
              wide: true,
            },
          ],
        },
      ]}
    />
  );
}

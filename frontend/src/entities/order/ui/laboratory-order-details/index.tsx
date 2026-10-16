import type { LaboratoryOrderDetails as LaboratoryDetails } from "../../model/details/laboratory";
import { OrderDetailSections } from "../order-detail-sections";
import { applicantDetails } from "../../model/applicant-details";

/** Условия заказа лабораторных исследований. */
interface LaboratoryOrderDetailsProps {
  details: LaboratoryDetails;
}

/** Показывает заявителя и требования к оборудованию лаборатории. */
export function LaboratoryOrderDetails({ details }: LaboratoryOrderDetailsProps) {
  return (
    <OrderDetailSections
      sections={[
        applicantDetails(details),
        {
          title: "Работы",
          rows: [
            {
              label: "Требования к оборудованию",
              value: details.equipment_requirements,
              wide: true,
            },
          ],
        },
      ]}
    />
  );
}

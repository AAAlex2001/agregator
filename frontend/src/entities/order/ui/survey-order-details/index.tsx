import { describeOrderOptions } from "../../model/detail-option";
import type { SurveyOrderDetails as SurveyDetails } from "../../model/details/survey";
import { OrderDetailSections } from "../order-detail-sections";
import { SURVEY_KINDS } from "../../config/survey-details";
import { applicantDetails } from "../../model/applicant-details";

/** Заявитель и виды изысканий в заказе. */
interface SurveyOrderDetailsProps {
  details: SurveyDetails;
}

/** Показывает заказанные виды инженерных изысканий. */
export function SurveyOrderDetails({ details }: SurveyOrderDetailsProps) {
  return (
    <OrderDetailSections
      sections={[
        applicantDetails(details),
        {
          title: "Изыскания",
          rows: [
            {
              label: "Виды изысканий",
              value: describeOrderOptions(details.kinds, SURVEY_KINDS),
              wide: true,
            },
          ],
        },
      ]}
    />
  );
}

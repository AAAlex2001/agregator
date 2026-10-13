import { APPLICANT_GROUP, catalogLabels, type OrderDetailGroup } from "../../shared/model/orderDetails";
import { SURVEY_KINDS } from "../catalogs/specialists";

export const surveyOrderDetails: OrderDetailGroup[] = [
  APPLICANT_GROUP,
  {
    title: "Изыскания",
    fields: [
      { key: "kinds", label: "Виды изысканий", kind: "list", wide: true, valueLabels: catalogLabels(SURVEY_KINDS) },
    ],
  },
];

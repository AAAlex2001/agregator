import { APPLICANT_GROUP, type OrderDetailGroup } from "../../shared/model/orderDetails";

export const researchOrderDetails: OrderDetailGroup[] = [
  APPLICANT_GROUP,
  {
    title: "Работы",
    fields: [
      { key: "executor_requirements", label: "Требования к исполнителю", kind: "list", wide: true },
      { key: "needs_site_visit", label: "Необходимость выезда на объект исследований", kind: "flag" },
    ],
  },
];

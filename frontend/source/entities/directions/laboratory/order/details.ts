import { APPLICANT_GROUP, type OrderDetailGroup } from "../../shared/model/orderDetails";

export const laboratoryOrderDetails: OrderDetailGroup[] = [
  APPLICANT_GROUP,
  {
    title: "Работы",
    fields: [
      { key: "equipment_requirements", label: "Требования к оборудованию", kind: "text", wide: true },
    ],
  },
];

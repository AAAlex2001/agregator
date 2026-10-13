import { APPLICANT_GROUP, type OrderDetailGroup } from "../../shared/model/orderDetails";

export const techDiagOrderDetails: OrderDetailGroup[] = [
  APPLICANT_GROUP,
  {
    title: "Работы",
    fields: [
      { key: "purpose", label: "Цель проведения работ", kind: "text", wide: true },
      { key: "object_city", label: "Где находится объект", kind: "text" },
      { key: "duration", label: "Срок проведения", kind: "text" },
    ],
  },
];

import { APPLICANT_GROUP, type OrderDetailGroup } from "../../shared/model/orderDetails";

export const cadastralOrderDetails: OrderDetailGroup[] = [
  APPLICANT_GROUP,
  {
    title: "Работы",
    fields: [
      { key: "work_purpose", label: "Цель работ", kind: "text", wide: true },
      { key: "city", label: "Где находится объект", kind: "text" },
      { key: "duration", label: "Срок проведения работ", kind: "text" },
    ],
  },
  {
    title: "Требования к исполнителю",
    fields: [
      { key: "education_requirement", label: "Требования к образованию", kind: "text", wide: true },
      { key: "sro_required", label: "Обязательное членство в СРО", kind: "flag" },
    ],
  },
];

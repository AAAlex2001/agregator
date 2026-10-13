import { APPLICANT_GROUP, type OrderDetailGroup } from "../../shared/model/orderDetails";

export const forensicOrderDetails: OrderDetailGroup[] = [
  APPLICANT_GROUP,
  {
    title: "Экспертиза",
    fields: [
      { key: "expertise_purpose", label: "Цель экспертизы", kind: "text", wide: true },
      { key: "government_body", label: "Государственный орган", kind: "text" },
      { key: "city", label: "Где находится предмет экспертизы", kind: "text" },
      { key: "duration", label: "Срок проведения экспертизы", kind: "text" },
    ],
  },
  {
    title: "Требования к эксперту",
    fields: [
      { key: "education_requirement", label: "Требования к образованию", kind: "text", wide: true },
      { key: "extra_requirements", label: "Дополнительные требования", kind: "text", wide: true },
      {
        key: "similar_experience_required",
        label: "Обязателен опыт аналогичных экспертиз",
        kind: "flag",
      },
    ],
  },
];

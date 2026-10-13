import { APPLICANT_GROUP, type OrderDetailGroup } from "../../shared/model/orderDetails";

export const auditOrderDetails: OrderDetailGroup[] = [
  APPLICANT_GROUP,
  {
    title: "Объект аудита",
    fields: [
      {
        key: "audit_scale",
        label: "Что нужно аудировать",
        kind: "text",
        valueLabels: { SINGLE_OPO: "Один ОПО", ALL_OPO: "Все ОПО организации", SELECTED_OPO: "Выборочные ОПО" },
      },
      { key: "opo_total", label: "Общее количество ОПО", kind: "text" },
      { key: "opo_class_1", label: "ОПО I класса", kind: "text" },
      { key: "opo_class_2", label: "ОПО II класса", kind: "text" },
      { key: "opo_class_3", label: "ОПО III класса", kind: "text" },
      { key: "opo_class_4", label: "ОПО IV класса", kind: "text" },
      { key: "main_industry", label: "Основной отраслевой профиль", kind: "text" },
      { key: "multiple_regions", label: "ОПО в разных субъектах РФ", kind: "flag" },
      { key: "opo_items", label: "Объекты", kind: "opo_list", wide: true },
      { key: "registration_certificate", label: "Свидетельство о регистрации ОПО", kind: "file" },
    ],
  },
  {
    title: "Параметры аудита",
    fields: [
      {
        key: "audit_kind",
        label: "Тип аудита",
        kind: "text",
        valueLabels: { BASIC: "Базовый", INTERIM: "Промежуточный", SELECTIVE: "Выборочный", CONSULTATION: "Консультация" },
      },
      { key: "considers_sto", label: "Учитывать СТО организации", kind: "flag" },
      { key: "sto_name", label: "СТО", kind: "text" },
      { key: "sto_file", label: "Файл СТО", kind: "file" },
      { key: "audit_areas", label: "Направления аудита (п.17 Приказа 318)", kind: "list", wide: true },
    ],
  },
  {
    title: "Сроки и комментарии",
    fields: [
      {
        key: "desired_timeline",
        label: "Желаемые сроки",
        kind: "text",
        valueLabels: {
          MONTH_URGENT: "В течение месяца (срочно)",
          CURRENT_QUARTER: "Текущий квартал",
          NEXT_QUARTER: "Следующий квартал",
          CONSULTATION: "Консультация",
        },
      },
      { key: "comments", label: "Комментарии", kind: "text", wide: true },
    ],
  },
];

import { APPLICANT_GROUP, type OrderDetailGroup } from "../../shared/model/orderDetails";
import { DESIGN_SPECIALTIES } from "../catalogs/specialists";

const SECTION_LABELS = Object.fromEntries(DESIGN_SPECIALTIES.map((item) => [item.key, item.title]));

export const designOrderDetails: OrderDetailGroup[] = [
  APPLICANT_GROUP,
  {
    title: "Объект",
    fields: [
      { key: "object_name", label: "Наименование объекта", kind: "text", wide: true },
      { key: "construction_city", label: "Город строительства", kind: "text" },
    ],
  },
  {
    title: "Документация",
    fields: [
      {
        key: "doc_categories",
        label: "Направление разрабатываемой документации",
        kind: "list",
        wide: true,
        valueLabels: {
          DP: "Дизайн-проекты",
          PS: "Промышленные объекты",
          GS: "Гражданские объекты",
          OKN: "Объекты культурного наследия",
          BIM: "BIM-моделирование",
          KD: "Конструкторская документация",
          NSO: "Нестандартное оборудование",
        },
      },
      {
        key: "documentation_kinds",
        label: "Вид документации",
        kind: "list",
        wide: true,
        valueLabels: {
          PD: "Проектная документация",
          RD: "Рабочая документация",
          TECH_REEQUIPMENT: "Техническое перевооружение",
          CONSERVATION: "Консервация",
          LIQUIDATION: "Ликвидация",
          TECH_PROJECT: "Технический проект",
        },
      },
      {
        key: "scope",
        label: "Объём разрабатываемой документации",
        kind: "text",
        valueLabels: { FULL: "Полный пакет документации", SECTIONS: "Отдельные разделы" },
      },
      {
        key: "sections",
        label: "Разделы проектной документации",
        kind: "list",
        wide: true,
        valueLabels: SECTION_LABELS,
      },
    ],
  },
  {
    title: "Согласования",
    fields: [
      {
        key: "approvals",
        label: "Согласования и экспертизы",
        kind: "list",
        wide: true,
        valueLabels: {
          STATE_EXPERTISE: "Государственная экспертиза",
          ECO_EXPERTISE: "Государственная экологическая экспертиза",
          EPB: "Экспертиза промышленной безопасности",
          CKR_TPI: "Согласование в ЦКР (ТКР)-ТПИ Роснедр",
        },
      },
      { key: "approvals_other", label: "Иные согласования", kind: "text", wide: true },
    ],
  },
];

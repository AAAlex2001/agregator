export interface MapFieldOption {
  value: string;
  label: string;
}

export interface MapFieldGroup {
  direction: string;
  title: string;
  options: MapFieldOption[];
}

export const COMMON_MAP_FIELD_OPTIONS: MapFieldOption[] = [
  { value: "name", label: "ФИО" },
  { value: "contacts", label: "Контактные данные" },
];

export const DIRECTION_MAP_FIELD_GROUPS: MapFieldGroup[] = [
  {
    direction: "EXPERTISE",
    title: "Экспертиза промышленной безопасности",
    options: [
      { value: "area", label: "Область аттестации" },
      { value: "object", label: "Объект экспертизы" },
      { value: "category", label: "Категория" },
    ],
  },
  {
    direction: "AUDIT_SUPB",
    title: "Аудит СУПБ",
    options: [
      { value: "audit_qualifications", label: "Квалификации по аудиту" },
      { value: "audit_attestation_areas", label: "Области аттестации" },
      { value: "audit_safety_areas", label: "Направления промбезопасности" },
    ],
  },
  {
    direction: "TECH_DIAG",
    title: "Техдиагностирование",
    options: [
      { value: "tech_diag_certificates", label: "Квалификационные удостоверения" },
      { value: "tech_diag_methods", label: "Виды контроля" },
      { value: "tech_diag_control_objects", label: "Объекты контроля" },
    ],
  },
  {
    direction: "DESIGN",
    title: "Проектирование",
    options: [
      { value: "design_specialties", label: "Специальности" },
      { value: "design_education", label: "Образование" },
      { value: "design_nrs", label: "Номер в НРС" },
      { value: "design_nok", label: "Отметка о НОК" },
      { value: "design_rtn_areas", label: "Области аттестации РТН" },
    ],
  },
  {
    direction: "RESEARCH",
    title: "НИР",
    options: [
      { value: "research_degree", label: "Учёная степень" },
      { value: "research_title", label: "Учёное звание" },
      { value: "research_field", label: "Направление научной деятельности" },
    ],
  },
  {
    direction: "LABORATORY",
    title: "Лабораторные исследования",
    options: [{ value: "laboratory_accreditation_area", label: "Область аккредитации" }],
  },
  {
    direction: "CADASTRAL",
    title: "Кадастровые работы",
    options: [
      { value: "cadastral_education", label: "Образование" },
      { value: "cadastral_certificate_number", label: "Номер аттестата" },
      { value: "cadastral_registry_number", label: "Реестровый номер" },
      { value: "cadastral_workplace", label: "Место работы" },
      { value: "cadastral_equipment", label: "Наличие оборудования" },
    ],
  },
  {
    direction: "FORENSIC",
    title: "Судебная экспертиза",
    options: [
      { value: "forensic_education", label: "Образование" },
      { value: "forensic_extra_education", label: "Дополнительное образование" },
      { value: "forensic_experience", label: "Опыт аналогичных экспертиз" },
      { value: "forensic_degree", label: "Учёная степень" },
    ],
  },
];

export const DEFAULT_MAP_FIELDS = ["name", "area", "object", "category"];

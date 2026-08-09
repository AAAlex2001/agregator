export type OrderWorkType =
  | "EXPERTISE"
  | "DESIGN_SURVEY"
  | "INSPECTION_TESTING"
  | "RESEARCH_LAB"
  | "AUDIT_SUPB"
  | "CADASTRAL"
  | "FORENSIC"
  | "RESEARCH"
  | "LABORATORY"
  | "TECH_DIAG"
  | "OTHER";

export type OrderWorkGroup = "direction" | "engineering";

export interface OrderWorkOption {
  value: Exclude<OrderWorkType, "RESEARCH_LAB">;
  label: string;
  shortLabel?: string;
  description: string;
  group: OrderWorkGroup;
}

export const ORDER_WORK_GROUPS: Array<{ key: OrderWorkGroup; title: string }> = [
  { key: "direction", title: "Направления" },
  { key: "engineering", title: "Иные инженерные работы" },
];

export const ORDER_WORK_OPTIONS: OrderWorkOption[] = [
  { value: "EXPERTISE", label: "Экспертиза промышленной безопасности", shortLabel: "Экспертиза", description: "Технические устройства, здания и сооружения, документация ОПО", group: "direction" },
  { value: "AUDIT_SUPB", label: "Аудит СУПБ", description: "Независимая оценка системы управления промышленной безопасностью", group: "direction" },
  { value: "RESEARCH", label: "НИРы", description: "Научно-исследовательские работы: тема, требования к исполнителю, выезд на объект", group: "direction" },
  { value: "LABORATORY", label: "Лабораторные исследования", description: "Наименование исследований и требования к оборудованию", group: "direction" },
  { value: "TECH_DIAG", label: "Техническое освидетельствование и диагностирование", shortLabel: "Техдиагностирование", description: "Оценка состояния оборудования и неразрушающий контроль аттестованными лабораториями и специалистами", group: "direction" },
  { value: "CADASTRAL", label: "Кадастровые работы", description: "Межевание, технические планы, схемы на КПТ и другие работы кадастровых инженеров", group: "direction" },
  { value: "FORENSIC", label: "Судебная экспертиза", description: "Заключение эксперта для суда: госорган, требования к эксперту, предмет экспертизы", group: "direction" },
  { value: "DESIGN_SURVEY", label: "ПИРы", description: "Проектные и изыскательские работы, геодезия, геология, обоснование безопасности", group: "engineering" },
  { value: "INSPECTION_TESTING", label: "Обследования, испытания, дефектоскопия", description: "Обследования, испытания и работы по дефектоскопии", group: "engineering" },
  { value: "OTHER", label: "Прочие", description: "Другие инженерные работы", group: "engineering" },
];

export const SUBSCRIPTION_WORK_OPTIONS: OrderWorkOption[] = ORDER_WORK_OPTIONS.filter(
  (option) => option.value !== "EXPERTISE",
);

export function orderWorkOptionsOf(group: OrderWorkGroup): OrderWorkOption[] {
  return ORDER_WORK_OPTIONS.filter((option) => option.group === group);
}

export function subscriptionWorkOptionsOf(group: OrderWorkGroup): OrderWorkOption[] {
  return SUBSCRIPTION_WORK_OPTIONS.filter((option) => option.group === group);
}

export function orderWorkGroupOf(value: OrderWorkType): OrderWorkGroup {
  return ORDER_WORK_OPTIONS.find((option) => option.value === value)?.group ?? "direction";
}

const LEGACY_WORK_LABELS: Record<string, string> = {
  RESEARCH_LAB: "НИРы и лабораторные исследования",
};

export function getOrderWorkLabel(value: OrderWorkType): string {
  const option = ORDER_WORK_OPTIONS.find((item) => item.value === value);
  if (option) return option.shortLabel ?? option.label;
  return LEGACY_WORK_LABELS[value] ?? "Экспертиза";
}

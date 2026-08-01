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
  | "OTHER";

export type OrderWorkGroup = "direction" | "engineering";

export interface OrderWorkOption {
  key: Exclude<OrderWorkType, "EXPERTISE" | "RESEARCH_LAB">;
  label: string;
  description: string;
  group: OrderWorkGroup;
}

export const ORDER_WORK_GROUPS: Array<{ key: OrderWorkGroup; title: string }> = [
  { key: "direction", title: "Направления" },
  { key: "engineering", title: "Иные инженерные работы" },
];

export const ORDER_WORK_OPTIONS: OrderWorkOption[] = [
  { key: "AUDIT_SUPB", label: "Аудит СУПБ", description: "Независимая оценка системы управления промышленной безопасностью", group: "direction" },
  { key: "RESEARCH", label: "НИРы", description: "Научно-исследовательские работы: тема, требования к исполнителю, выезд на объект", group: "direction" },
  { key: "LABORATORY", label: "Лабораторные исследования", description: "Наименование исследований и требования к оборудованию", group: "direction" },
  { key: "CADASTRAL", label: "Кадастровые работы", description: "Межевание, технические планы, схемы на КПТ и другие работы кадастровых инженеров", group: "direction" },
  { key: "FORENSIC", label: "Судебная экспертиза", description: "Заключение эксперта для суда: госорган, требования к эксперту, предмет экспертизы", group: "direction" },
  { key: "DESIGN_SURVEY", label: "ПИРы", description: "Проектные и изыскательские работы, геодезия, геология, обоснование безопасности", group: "engineering" },
  { key: "INSPECTION_TESTING", label: "Обследования, испытания, дефектоскопия", description: "Обследования, испытания и работы по дефектоскопии", group: "engineering" },
  { key: "OTHER", label: "Прочие", description: "Другие инженерные работы", group: "engineering" },
];

export function orderWorkOptionsOf(group: OrderWorkGroup): OrderWorkOption[] {
  return ORDER_WORK_OPTIONS.filter((option) => option.group === group);
}

/** Типы, выведенные из списка выбора, но живущие в ранее созданных заявках. */
const LEGACY_WORK_LABELS: Record<string, string> = {
  RESEARCH_LAB: "НИРы и лабораторные исследования",
};

export function getOrderWorkLabel(value: OrderWorkType): string {
  if (value === "EXPERTISE") return "Экспертиза";
  const option = ORDER_WORK_OPTIONS.find((item) => item.key === value);
  if (option) return option.label;
  return LEGACY_WORK_LABELS[value] ?? "Экспертиза";
}

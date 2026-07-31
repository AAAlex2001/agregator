export type OrderWorkType =
  | "EXPERTISE"
  | "DESIGN_SURVEY"
  | "INSPECTION_TESTING"
  | "RESEARCH_LAB"
  | "CADASTRAL"
  | "FORENSIC"
  | "RESEARCH"
  | "LABORATORY"
  | "OTHER";

export const ORDER_WORK_OPTIONS = [
  { key: "DESIGN_SURVEY", label: "ПИРы", description: "Проектные и изыскательские работы, геодезия, геология, обоснование безопасности" },
  { key: "INSPECTION_TESTING", label: "Обследования, испытания, дефектоскопия", description: "Обследования, испытания и работы по дефектоскопии" },
  { key: "RESEARCH", label: "НИРы", description: "Научно-исследовательские работы: тема, требования к исполнителю, выезд на объект" },
  { key: "LABORATORY", label: "Лабораторные исследования", description: "Наименование исследований и требования к оборудованию" },
  { key: "CADASTRAL", label: "Кадастровые работы", description: "Межевание, технические планы, схемы на КПТ и другие работы кадастровых инженеров" },
  { key: "FORENSIC", label: "Судебная экспертиза", description: "Заключение эксперта для суда: госорган, требования к эксперту, предмет экспертизы" },
  { key: "OTHER", label: "Прочие", description: "Другие инженерные работы" },
] satisfies Array<{
  key: Exclude<OrderWorkType, "EXPERTISE" | "RESEARCH_LAB">;
  label: string;
  description: string;
}>;

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

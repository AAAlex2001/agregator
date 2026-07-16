export type OrderWorkType =
  | "EXPERTISE"
  | "DESIGN_SURVEY"
  | "INSPECTION_TESTING"
  | "RESEARCH_LAB"
  | "OTHER";

export const ORDER_WORK_OPTIONS = [
  { key: "DESIGN_SURVEY", label: "ПИРы", description: "Проектные и изыскательские работы, геодезия, геология, обоснование безопасности" },
  { key: "INSPECTION_TESTING", label: "Обследования, испытания, дефектоскопия", description: "Обследования, испытания и работы по дефектоскопии" },
  { key: "RESEARCH_LAB", label: "НИРы и лабораторные исследования", description: "Научно-исследовательские и лабораторные работы" },
  { key: "OTHER", label: "Прочие", description: "Кадастровые работы, судебная экспертиза и другие инженерные работы" },
] satisfies Array<{ key: Exclude<OrderWorkType, "EXPERTISE">; label: string; description: string }>;

export function getOrderWorkLabel(value: OrderWorkType): string {
  if (value === "EXPERTISE") return "Экспертиза";
  return ORDER_WORK_OPTIONS.find((option) => option.key === value)?.label ?? "Экспертиза";
}

export type OrderWorkType =
  | "EXPERTISE"
  | "DESIGN_SURVEY"
  | "INSPECTION_TESTING"
  | "RESEARCH_LAB"
  | "OTHER";

export const ORDER_WORK_OPTIONS: Array<{
  value: OrderWorkType;
  label: string;
  description: string;
}> = [
  { value: "DESIGN_SURVEY", label: "ПИРы", description: "Проектные и изыскательские работы, геодезия, геология, обоснование безопасности" },
  { value: "INSPECTION_TESTING", label: "Обследования, испытания, дефектоскопия", description: "Обследования, испытания и работы по дефектоскопии" },
  { value: "RESEARCH_LAB", label: "НИРы и лабораторные исследования", description: "Научно-исследовательские и лабораторные работы" },
  { value: "OTHER", label: "Прочие", description: "Кадастровые работы, судебная экспертиза и другие инженерные работы" },
];

export function getOrderWorkLabel(value: OrderWorkType): string {
  if (value === "EXPERTISE") return "Экспертиза";
  return ORDER_WORK_OPTIONS.find((option) => option.value === value)?.label ?? "Экспертиза";
}

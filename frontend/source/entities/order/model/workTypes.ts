export type OrderWorkType =
  | "EXPERTISE"
  | "RESEARCH_LAB"
  | "AUDIT_SUPB"
  | "CADASTRAL"
  | "FORENSIC"
  | "RESEARCH"
  | "LABORATORY"
  | "TECH_DIAG"
  | "DESIGN";

export interface OrderWorkOption {
  value: Exclude<OrderWorkType, "RESEARCH_LAB">;
  label: string;
  shortLabel?: string;
  description: string;
}

export const ORDER_WORK_OPTIONS: OrderWorkOption[] = [
  { value: "EXPERTISE", label: "Экспертиза промышленной безопасности", shortLabel: "Экспертиза", description: "Технические устройства, здания и сооружения, документация ОПО" },
  { value: "AUDIT_SUPB", label: "Аудит СУПБ", description: "Независимая оценка системы управления промышленной безопасностью" },
  { value: "TECH_DIAG", label: "Техническое освидетельствование и диагностирование", shortLabel: "Техдиагностирование", description: "Оценка состояния оборудования и неразрушающий контроль аттестованными лабораториями и специалистами" },
  { value: "DESIGN", label: "Проектирование промышленных и гражданских объектов", shortLabel: "Проектирование", description: "Проектная и рабочая документация силами специалистов НОПРИЗ, включённых в НРС" },
  { value: "RESEARCH", label: "НИРы", description: "Научно-исследовательские работы: тема, требования к исполнителю, выезд на объект" },
  { value: "LABORATORY", label: "Лабораторные исследования", description: "Наименование исследований и требования к оборудованию" },
  { value: "CADASTRAL", label: "Кадастровые работы", description: "Межевание, технические планы, схемы на КПТ и другие работы кадастровых инженеров" },
  { value: "FORENSIC", label: "Судебная экспертиза", description: "Заключение эксперта для суда: госорган, требования к эксперту, предмет экспертизы" },
];

export const SUBSCRIPTION_WORK_OPTIONS: OrderWorkOption[] = ORDER_WORK_OPTIONS.filter(
  (option) => option.value !== "EXPERTISE",
);

const LEGACY_WORK_LABELS: Record<string, string> = {
  RESEARCH_LAB: "НИРы и лабораторные исследования",
};

export function getOrderWorkLabel(value: OrderWorkType): string {
  const option = ORDER_WORK_OPTIONS.find((item) => item.value === value);
  if (option) return option.shortLabel ?? option.label;
  return LEGACY_WORK_LABELS[value] ?? "Экспертиза";
}

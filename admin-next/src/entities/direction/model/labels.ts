export type Direction =
  | "EXPERTISE"
  | "AUDIT_SUPB"
  | "TECH_DIAG"
  | "DESIGN"
  | "SURVEY"
  | "ECOLOGY"
  | "RESEARCH"
  | "RESEARCH_LAB"
  | "LABORATORY"
  | "CADASTRAL"
  | "FORENSIC";

export const DIRECTION_LABELS: Record<Direction, string> = {
  EXPERTISE: "Экспертиза промбезопасности",
  AUDIT_SUPB: "Аудит СУПБ",
  TECH_DIAG: "Техдиагностирование и НК",
  DESIGN: "Проектирование",
  SURVEY: "Инженерные изыскания",
  ECOLOGY: "Экологическое сопровождение",
  RESEARCH: "НИР",
  RESEARCH_LAB: "НИР и лаборатории",
  LABORATORY: "Лабораторные исследования",
  CADASTRAL: "Кадастровые работы",
  FORENSIC: "Судебная экспертиза",
};

/** Направления, к которым привязываются статьи и лендинги. */
export const ARTICLE_DIRECTIONS: Direction[] = [
  "EXPERTISE",
  "AUDIT_SUPB",
  "TECH_DIAG",
  "DESIGN",
  "SURVEY",
  "ECOLOGY",
  "RESEARCH",
  "CADASTRAL",
  "FORENSIC",
];

/** Подпись направления; незнакомый ключ показывается как есть. */
export const directionLabel = (value: string) => DIRECTION_LABELS[value as Direction] ?? value;

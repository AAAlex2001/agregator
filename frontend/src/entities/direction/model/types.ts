/** Коды действующих направлений, используемые в профилях и заказах API. */
export type DirectionCode =
  | "EXPERTISE"
  | "AUDIT_SUPB"
  | "TECH_DIAG"
  | "DESIGN"
  | "ECOLOGY"
  | "SURVEY"
  | "RESEARCH"
  | "LABORATORY"
  | "CADASTRAL"
  | "FORENSIC";

/** Направление в интерфейсе выбора; value сохраняется в API. */
export interface DirectionOption {
  value: DirectionCode;
  label: string;
  shortLabel?: string;
  description: string;
}

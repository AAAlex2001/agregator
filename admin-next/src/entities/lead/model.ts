export type LeadStatus = "NEW" | "IN_WORK" | "DONE" | "SPAM";

export type Lead = {
  id: number;
  direction: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  inn: string;
  region: string;
  objectName: string;
  task: string;
  deadline: string;
  budget: string;
  sourceUrl: string;
  comment: string;
  status: LeadStatus;
  createdAt: string;
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Новая",
  IN_WORK: "В работе",
  DONE: "Обработана",
  SPAM: "Спам",
};

export const LEAD_DIRECTION_LABELS: Record<string, string> = {
  EXPERTISE: "Экспертиза ПБ",
  AUDIT_SUPB: "Аудит СУПБ",
  TECH_DIAG: "Техдиагностирование",
  DESIGN: "Проектирование",
  SURVEY: "Изыскания",
  ECOLOGY: "Экология",
  RESEARCH: "НИР",
  LABORATORY: "Лаборатория",
  CADASTRAL: "Кадастр",
  FORENSIC: "Судэкспертиза",
};

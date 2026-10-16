/** Поля заявки посетителя до отправки на сервер. */
export interface LeadFormFields {
  direction: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  inn: string;
  region: string;
  workKinds: string[];
  objectName: string;
  task: string;
  deadline: string;
  budget: string;
}

/** Текстовые поля заявки; направление и виды работ меняются отдельными действиями. */
export type LeadTextField =
  | "name"
  | "phone"
  | "email"
  | "company"
  | "inn"
  | "region"
  | "objectName"
  | "task"
  | "deadline"
  | "budget";

/** Черновик заявки и состояния её отправки. */
export interface LeadFormState {
  fields: LeadFormFields;
  isSending: boolean;
  isSent: boolean;
}

/** Изменения полей и результаты запроса отправки заявки. */
export type LeadFormAction =
  | { type: "field/changed"; field: LeadTextField; value: string }
  | { type: "direction/changed"; direction: string }
  | { type: "kinds/changed"; workKinds: string[] }
  | { type: "submit/started" }
  | { type: "submit/succeeded" }
  | { type: "submit/failed" };

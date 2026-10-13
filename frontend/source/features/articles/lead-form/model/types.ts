export interface LeadFields {
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

export type LeadTextField =
  | "direction"
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

export interface LeadFormState {
  fields: LeadFields;
  isSending: boolean;
  isSent: boolean;
}

export type LeadFormAction =
  | { type: "field/change"; field: LeadTextField; value: string }
  | { type: "direction/change"; direction: string }
  | { type: "kinds/change"; workKinds: string[] }
  | { type: "submit/start" }
  | { type: "submit/success" }
  | { type: "submit/error" };

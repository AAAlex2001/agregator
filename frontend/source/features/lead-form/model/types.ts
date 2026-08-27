export const LEAD_FORM_ID = "lead-form";

export interface LeadFormValues {
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

export const emptyLeadForm: LeadFormValues = {
  direction: "EXPERTISE",
  name: "",
  phone: "",
  email: "",
  company: "",
  inn: "",
  region: "",
  workKinds: [],
  objectName: "",
  task: "",
  deadline: "",
  budget: "",
};

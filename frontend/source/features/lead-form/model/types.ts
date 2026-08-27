export interface LeadFormValues {
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
}

export const emptyLeadForm: LeadFormValues = {
  direction: "EXPERTISE",
  name: "",
  phone: "",
  email: "",
  company: "",
  inn: "",
  region: "",
  objectName: "",
  task: "",
  deadline: "",
  budget: "",
};

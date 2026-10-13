export const LEAD_FORM_ID = "lead-form";

export interface LeadPayload {
  direction: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  inn: string;
  region: string;
  work_kinds: string;
  object_name: string;
  task: string;
  deadline: string;
  budget: string;
  source_url: string;
}

export interface LeadDirection {
  value: string;
  label: string;
  hint: string;
  href: string;
  image: string;
  video: string;
  bg: string;
  ink: string;
  muted: string;
  taskPlaceholder: string;
  objectPlaceholder: string;
  kinds: string[];
}

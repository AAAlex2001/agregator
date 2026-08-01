export type ServiceRequestVariant = "nir" | "lab";

export interface ExecutorRequirement {
  id: number;
  value: string;
}

export interface ServiceAttachment {
  name: string;
  url: string;
  isImage: boolean;
  file: File;
}

export interface ServiceRequestState {
  variant: ServiceRequestVariant;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  description: string;
  responsesDeadline: string;
  startDate: string;
  dueDate: string;
  maxPrice: string;
  attachments: ServiceAttachment[];
  // НИР
  topic: string;
  executorRequirements: ExecutorRequirement[];
  needsSiteVisit: boolean;
  nextRequirementId: number;
  // Лабораторные исследования
  researchName: string;
  equipmentRequirements: string;
  // Согласия
  agreePrivacy: boolean;
  agreeTerms: boolean;
  agreeConsent: boolean;
}

export type ServiceRequestAgreement = "agreePrivacy" | "agreeTerms" | "agreeConsent";

export type ServiceRequestErrors = Partial<Record<keyof ServiceRequestState, string>>;

export type ServiceRequestField =
  | "firstName"
  | "lastName"
  | "phone"
  | "email"
  | "description"
  | "responsesDeadline"
  | "startDate"
  | "dueDate"
  | "maxPrice"
  | "topic"
  | "researchName"
  | "equipmentRequirements";

export type ServiceRequestAction =
  | { type: "SET_FIELD"; field: ServiceRequestField; value: string }
  | { type: "SET_VARIANT"; variant: ServiceRequestVariant }
  | { type: "ADD_FILES"; attachments: ServiceAttachment[] }
  | { type: "REMOVE_FILE"; index: number }
  | { type: "TOGGLE_SITE_VISIT" }
  | { type: "TOGGLE_AGREEMENT"; agreement: ServiceRequestAgreement }
  | { type: "ADD_REQUIREMENT" }
  | { type: "SET_REQUIREMENT"; id: number; value: string }
  | { type: "REMOVE_REQUIREMENT"; id: number };

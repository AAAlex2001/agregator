import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export type DesignOrderScope = "FULL" | "SECTIONS";

export interface DesignOrderDetails extends ApplicantBlock {
  object_name: string;
  construction_city: string;
  doc_categories: string[];
  documentation_kinds: string[];
  scope: DesignOrderScope;
  sections: string[];
  approvals: string[];
  approvals_other: string;
}

export const emptyDesignOrderDetails: DesignOrderDetails = {
  ...emptyApplicant,
  object_name: "",
  construction_city: "",
  doc_categories: [],
  documentation_kinds: [],
  scope: "FULL",
  sections: [],
  approvals: [],
  approvals_other: "",
};

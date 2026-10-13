import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface ForensicOrderDetails extends ApplicantBlock {
  expertise_purpose: string;
  government_body: string;
  city: string;
  education_requirement: string;
  extra_requirements: string;
  similar_experience_required: boolean;
  duration: string;
}

export const emptyForensicOrderDetails: ForensicOrderDetails = {
  ...emptyApplicant,
  expertise_purpose: "",
  government_body: "",
  city: "",
  education_requirement: "",
  extra_requirements: "",
  similar_experience_required: false,
  duration: "",
};

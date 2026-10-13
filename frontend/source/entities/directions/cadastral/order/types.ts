import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface CadastralOrderDetails extends ApplicantBlock {
  work_purpose: string;
  city: string;
  education_requirement: string;
  sro_required: boolean;
  duration: string;
}

export const emptyCadastralOrderDetails: CadastralOrderDetails = {
  ...emptyApplicant,
  work_purpose: "",
  city: "",
  education_requirement: "",
  sro_required: false,
  duration: "",
};

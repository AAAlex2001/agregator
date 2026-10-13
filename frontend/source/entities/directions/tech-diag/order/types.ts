import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface TechDiagOrderDetails extends ApplicantBlock {
  purpose: string;
  object_city: string;
  duration: string;
}

export const emptyTechDiagOrderDetails: TechDiagOrderDetails = {
  ...emptyApplicant,
  purpose: "",
  object_city: "",
  duration: "",
};

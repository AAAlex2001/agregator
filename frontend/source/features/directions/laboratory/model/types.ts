import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface LaboratoryProfile {
  accreditation_area: string;
  comment: string;
}

export interface LaboratoryOrderDetails extends ApplicantBlock {
  equipment_requirements: string;
}

export const emptyLaboratoryProfile: LaboratoryProfile = {
  accreditation_area: "",
  comment: "",
};

export const emptyLaboratoryOrderDetails: LaboratoryOrderDetails = {
  ...emptyApplicant,
  equipment_requirements: "",
};

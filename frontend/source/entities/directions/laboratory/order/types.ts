import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface LaboratoryOrderDetails extends ApplicantBlock {
  equipment_requirements: string;
}

export const emptyLaboratoryOrderDetails: LaboratoryOrderDetails = {
  ...emptyApplicant,
  equipment_requirements: "",
};

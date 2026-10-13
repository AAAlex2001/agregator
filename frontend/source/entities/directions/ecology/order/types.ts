import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface EcologyOrderDetails extends ApplicantBlock {
  work_types: string[];
}

export const emptyEcologyOrderDetails: EcologyOrderDetails = {
  ...emptyApplicant,
  work_types: [],
};

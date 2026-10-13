import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface SurveyOrderDetails extends ApplicantBlock {
  kinds: string[];
}

export const emptySurveyOrderDetails: SurveyOrderDetails = {
  ...emptyApplicant,
  kinds: [],
};

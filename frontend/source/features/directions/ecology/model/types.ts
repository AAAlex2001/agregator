import type { DirectionFile } from "../../shared/model/files";
import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface EcologyCatalogOption {
  code: string;
  title: string;
}

export interface EcologyCatalogs {
  work_types: EcologyCatalogOption[];
}

export interface EcologyProfile {
  work_types: string[];
  practical_skills: string;
  documents: DirectionFile[];
}

export interface EcologyOrderDetails extends ApplicantBlock {
  work_types: string[];
}

export const emptyEcologyCatalogs: EcologyCatalogs = {
  work_types: [],
};

export const emptyEcologyProfile: EcologyProfile = {
  work_types: [],
  practical_skills: "",
  documents: [],
};

export const emptyEcologyOrderDetails: EcologyOrderDetails = {
  ...emptyApplicant,
  work_types: [],
};

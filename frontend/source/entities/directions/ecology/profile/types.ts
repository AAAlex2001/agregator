import type { DirectionFile } from "../../shared/model/files";

export interface EcologyProfile {
  work_types: string[];
  practical_skills: string;
  documents: DirectionFile[];
}

export const emptyEcologyProfile: EcologyProfile = {
  work_types: [],
  practical_skills: "",
  documents: [],
};

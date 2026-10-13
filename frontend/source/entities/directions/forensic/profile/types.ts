import type { DirectionFile } from "../../shared/model/files";

export type ForensicWorkplaceKind = "INDIVIDUAL" | "ORGANIZATION";

export interface ForensicProfile {
  education: string;
  extra_education: string;
  has_similar_experience: boolean;
  has_degree: boolean;
  degree: string;
  city: string;
  workplace_kind: ForensicWorkplaceKind;
  workplace_name: string;
  education_diploma: DirectionFile | null;
  documents: DirectionFile[];
}

export const emptyForensicProfile: ForensicProfile = {
  education: "",
  extra_education: "",
  has_similar_experience: false,
  has_degree: false,
  degree: "",
  city: "",
  workplace_kind: "INDIVIDUAL",
  workplace_name: "",
  education_diploma: null,
  documents: [],
};

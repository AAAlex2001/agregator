import type { DirectionFile } from "../../shared/model/files";

export type DesignDocumentGroup = "education" | "nok" | "nrs" | "qualification" | "rtn";

export interface DesignProfile {
  education: string;
  specialties: string[];
  nok_passed: boolean;
  nrs_number: string;
  sro_gip_declared: boolean;
  qualification_courses: string;
  rtn_areas: string[];
  education_documents: DirectionFile[];
  nok_documents: DirectionFile[];
  nrs_documents: DirectionFile[];
  qualification_documents: DirectionFile[];
  rtn_documents: DirectionFile[];
}

export const emptyDesignProfile: DesignProfile = {
  education: "",
  specialties: [],
  nok_passed: false,
  nrs_number: "",
  sro_gip_declared: false,
  qualification_courses: "",
  rtn_areas: [],
  education_documents: [],
  nok_documents: [],
  nrs_documents: [],
  qualification_documents: [],
  rtn_documents: [],
};

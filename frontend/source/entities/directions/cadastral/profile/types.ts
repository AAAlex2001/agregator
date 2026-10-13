import type { DirectionFile } from "../../shared/model/files";

export interface CadastralProfile {
  education: string;
  registry_joined_at: string | null;
  certificate_number: string | null;
  registry_number: string | null;
  has_equipment: boolean;
  city: string;
  workplace: string;
  education_diploma: DirectionFile | null;
  certificate_file: DirectionFile | null;
  documents: DirectionFile[];
}

export const emptyCadastralProfile: CadastralProfile = {
  education: "",
  registry_joined_at: null,
  certificate_number: "",
  registry_number: "",
  has_equipment: false,
  city: "",
  workplace: "",
  education_diploma: null,
  certificate_file: null,
  documents: [],
};

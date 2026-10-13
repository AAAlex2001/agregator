import type { DirectionFile } from "../../shared/model/files";

export interface TechDiagProfile {
  qualification_certificates: string;
  methods: string[];
  control_objects: string[];
  documents: DirectionFile[];
}

export const emptyTechDiagProfile: TechDiagProfile = {
  qualification_certificates: "",
  methods: [],
  control_objects: [],
  documents: [],
};

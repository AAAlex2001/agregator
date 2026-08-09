import type { DirectionFile } from "../../shared/model/files";
import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface TechDiagCatalogOption {
  code: string;
  title: string;
}

export interface TechDiagCatalogs {
  methods: TechDiagCatalogOption[];
  control_objects: TechDiagCatalogOption[];
}

export interface TechDiagProfile {
  qualification_certificates: string;
  methods: string[];
  control_objects: string[];
  documents: DirectionFile[];
}

export interface TechDiagHolderProfile {
  methods: string[];
  organization_city: string;
}

export interface TechDiagOrderDetails extends ApplicantBlock {
  purpose: string;
  object_city: string;
  duration: string;
}

export const emptyTechDiagCatalogs: TechDiagCatalogs = {
  methods: [],
  control_objects: [],
};

export const emptyTechDiagProfile: TechDiagProfile = {
  qualification_certificates: "",
  methods: [],
  control_objects: [],
  documents: [],
};

export const emptyTechDiagHolderProfile: TechDiagHolderProfile = {
  methods: [],
  organization_city: "",
};

export const emptyTechDiagOrderDetails: TechDiagOrderDetails = {
  ...emptyApplicant,
  purpose: "",
  object_city: "",
  duration: "",
};

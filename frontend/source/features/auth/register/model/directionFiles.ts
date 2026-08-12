import type { RegisterDocument } from "./api";

export interface DirectionFilesState {
  auditDocuments: File[];
  cadastralDiploma: File | null;
  cadastralCertificate: File | null;
  cadastralDocuments: File[];
  forensicDiploma: File | null;
  forensicDocuments: File[];
  techDiagDocuments: File[];
  designEducationDocuments: File[];
  designNokDocuments: File[];
  designNrsDocuments: File[];
  designQualificationDocuments: File[];
  designRtnDocuments: File[];
}

export const emptyDirectionFiles: DirectionFilesState = {
  auditDocuments: [],
  cadastralDiploma: null,
  cadastralCertificate: null,
  cadastralDocuments: [],
  forensicDiploma: null,
  forensicDocuments: [],
  techDiagDocuments: [],
  designEducationDocuments: [],
  designNokDocuments: [],
  designNrsDocuments: [],
  designQualificationDocuments: [],
  designRtnDocuments: [],
};

const FIELD_SLOTS: Record<keyof DirectionFilesState, RegisterDocument["slot"]> = {
  auditDocuments: "AUDIT_SUPB",
  cadastralDiploma: "CADASTRAL_DIPLOMA",
  cadastralCertificate: "CADASTRAL_CERTIFICATE",
  cadastralDocuments: "CADASTRAL",
  forensicDiploma: "FORENSIC_DIPLOMA",
  forensicDocuments: "FORENSIC",
  techDiagDocuments: "TECH_DIAG",
  designEducationDocuments: "DESIGN_EDUCATION",
  designNokDocuments: "DESIGN_NOK",
  designNrsDocuments: "DESIGN_NRS",
  designQualificationDocuments: "DESIGN_QUALIFICATION",
  designRtnDocuments: "DESIGN_RTN",
};

export function toRegisterDocuments(files: DirectionFilesState): RegisterDocument[] {
  const documents: RegisterDocument[] = [];
  for (const [field, slot] of Object.entries(FIELD_SLOTS)) {
    const value = files[field as keyof DirectionFilesState];
    const list = Array.isArray(value) ? value : value ? [value] : [];
    for (const file of list) documents.push({ slot, file });
  }
  return documents;
}

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

export function toRegisterDocuments(files: DirectionFilesState): RegisterDocument[] {
  const documents: RegisterDocument[] = [];
  if (files.cadastralDiploma) {
    documents.push({ slot: "CADASTRAL_DIPLOMA", file: files.cadastralDiploma });
  }
  if (files.cadastralCertificate) {
    documents.push({ slot: "CADASTRAL_CERTIFICATE", file: files.cadastralCertificate });
  }
  for (const file of files.cadastralDocuments) documents.push({ slot: "CADASTRAL", file });
  if (files.forensicDiploma) {
    documents.push({ slot: "FORENSIC_DIPLOMA", file: files.forensicDiploma });
  }
  for (const file of files.forensicDocuments) documents.push({ slot: "FORENSIC", file });
  for (const file of files.auditDocuments) documents.push({ slot: "AUDIT_SUPB", file });
  for (const file of files.techDiagDocuments) documents.push({ slot: "TECH_DIAG", file });
  for (const file of files.designEducationDocuments) documents.push({ slot: "DESIGN_EDUCATION", file });
  for (const file of files.designNokDocuments) documents.push({ slot: "DESIGN_NOK", file });
  for (const file of files.designNrsDocuments) documents.push({ slot: "DESIGN_NRS", file });
  for (const file of files.designQualificationDocuments) documents.push({ slot: "DESIGN_QUALIFICATION", file });
  for (const file of files.designRtnDocuments) documents.push({ slot: "DESIGN_RTN", file });
  return documents;
}

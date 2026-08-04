import type { RegisterDocument } from "./api";

export interface DirectionFilesState {
  auditDocuments: File[];
  cadastralDiploma: File | null;
  cadastralCertificate: File | null;
  cadastralDocuments: File[];
  forensicDiploma: File | null;
  forensicDocuments: File[];
}

export const emptyDirectionFiles: DirectionFilesState = {
  auditDocuments: [],
  cadastralDiploma: null,
  cadastralCertificate: null,
  cadastralDocuments: [],
  forensicDiploma: null,
  forensicDocuments: [],
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
  return documents;
}

import type { ExpertDocument, ExpertDocumentSlot } from "@/source/entities/user";

export interface DirectionFiles {
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
  ecologyDocuments: File[];
  surveyEducationDocuments: File[];
  surveyNokDocuments: File[];
  surveyNrsDocuments: File[];
  surveyQualificationDocuments: File[];
  surveyRtnDocuments: File[];
}

export const EMPTY_DIRECTION_FILES: DirectionFiles = {
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
  ecologyDocuments: [],
  surveyEducationDocuments: [],
  surveyNokDocuments: [],
  surveyNrsDocuments: [],
  surveyQualificationDocuments: [],
  surveyRtnDocuments: [],
};

const one = (slot: ExpertDocumentSlot, file: File | null): ExpertDocument[] => (file ? [{ slot, file }] : []);
const many = (slot: ExpertDocumentSlot, files: File[]): ExpertDocument[] => files.map((file) => ({ slot, file }));

/** Файлы анкет исполнителя одним списком — каждый со своим слотом для бэкенда. */
export function toExpertDocuments(files: DirectionFiles): ExpertDocument[] {
  return [
    ...many("AUDIT_SUPB", files.auditDocuments),
    ...one("CADASTRAL_DIPLOMA", files.cadastralDiploma),
    ...one("CADASTRAL_CERTIFICATE", files.cadastralCertificate),
    ...many("CADASTRAL", files.cadastralDocuments),
    ...one("FORENSIC_DIPLOMA", files.forensicDiploma),
    ...many("FORENSIC", files.forensicDocuments),
    ...many("TECH_DIAG", files.techDiagDocuments),
    ...many("DESIGN_EDUCATION", files.designEducationDocuments),
    ...many("DESIGN_NOK", files.designNokDocuments),
    ...many("DESIGN_NRS", files.designNrsDocuments),
    ...many("DESIGN_QUALIFICATION", files.designQualificationDocuments),
    ...many("DESIGN_RTN", files.designRtnDocuments),
    ...many("ECOLOGY", files.ecologyDocuments),
    ...many("SURVEY_EDUCATION", files.surveyEducationDocuments),
    ...many("SURVEY_NOK", files.surveyNokDocuments),
    ...many("SURVEY_NRS", files.surveyNrsDocuments),
    ...many("SURVEY_QUALIFICATION", files.surveyQualificationDocuments),
    ...many("SURVEY_RTN", files.surveyRtnDocuments),
  ];
}

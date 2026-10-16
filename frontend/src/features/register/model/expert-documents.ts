import type { LocalFile } from "@/shared/lib/local-file";
import type { ExpertRegistration } from "./expert";

/** Локальный файл и код назначения, который backend ожидает в document_directions. */
export interface ExpertRegistrationDocument {
  direction: string;
  selected: LocalFile;
}

/** Собирает документы в порядке их парной отправки с кодами направлений. */
export function getExpertDocuments(expert: ExpertRegistration): ExpertRegistrationDocument[] {
  const documents: ExpertRegistrationDocument[] = [];

  /** Добавляет группу, сохраняя порядок файлов внутри неё. */
  function addDocuments(direction: string, selected: LocalFile[]) {
    for (const file of selected) {
      documents.push({ direction, selected: file });
    }
  }

  addDocuments("AUDIT_SUPB", expert.audit.documents);
  if (expert.cadastral.diploma) {
    addDocuments("CADASTRAL_DIPLOMA", [expert.cadastral.diploma]);
  }
  if (expert.cadastral.certificate) {
    addDocuments("CADASTRAL_CERTIFICATE", [expert.cadastral.certificate]);
  }
  addDocuments("CADASTRAL", expert.cadastral.documents);
  if (expert.forensic.diploma) {
    addDocuments("FORENSIC_DIPLOMA", [expert.forensic.diploma]);
  }
  addDocuments("FORENSIC", expert.forensic.documents);
  addDocuments("TECH_DIAG", expert.techDiag.documents);
  addDocuments("DESIGN_EDUCATION", expert.design.documents.education);
  addDocuments("DESIGN_NOK", expert.design.documents.nok);
  addDocuments("DESIGN_NRS", expert.design.documents.nrs);
  addDocuments("DESIGN_QUALIFICATION", expert.design.documents.qualification);
  addDocuments("DESIGN_RTN", expert.design.documents.rtn);
  addDocuments("ECOLOGY", expert.ecology.documents);
  addDocuments("SURVEY_EDUCATION", expert.survey.documents.education);
  addDocuments("SURVEY_NOK", expert.survey.documents.nok);
  addDocuments("SURVEY_NRS", expert.survey.documents.nrs);
  addDocuments("SURVEY_QUALIFICATION", expert.survey.documents.qualification);
  addDocuments("SURVEY_RTN", expert.survey.documents.rtn);

  return documents;
}


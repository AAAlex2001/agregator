import type { SurveyDocumentGroup, SurveyProfileDocuments } from "../model/types";

/** Группа подтверждающих документов в анкете изыскателя. */
interface SurveyDocumentGroupOption {
  group: SurveyDocumentGroup;
  field: keyof SurveyProfileDocuments;
  label: string;
}

/** Порядок и подписи пяти групп документов для редактирования анкеты. */
export const SURVEY_DOCUMENT_GROUPS: SurveyDocumentGroupOption[] = [
  {
    group: "education",
    field: "education_documents",
    label: "Диплом об образовании — до 5 документов",
  },
  {
    group: "nok",
    field: "nok_documents",
    label: "Свидетельства НОК — до 5 документов",
  },
  {
    group: "nrs",
    field: "nrs_documents",
    label: "Уведомления о включении в НРС — до 5 документов",
  },
  {
    group: "qualification",
    field: "qualification_documents",
    label: "Повышение квалификации, курсы — до 5 документов",
  },
  {
    group: "rtn",
    field: "rtn_documents",
    label: "Протоколы аттестации РТН — до 5 документов",
  },
];

/** Форматы подтверждающих документов, поддержанные API изысканий. */
export const SURVEY_DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx,"
  + "application/pdf,image/jpeg,image/png,application/msword,"
  + "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Максимальное число файлов в каждой группе документов изыскателя. */
export const SURVEY_DOCUMENT_LIMIT = 5;

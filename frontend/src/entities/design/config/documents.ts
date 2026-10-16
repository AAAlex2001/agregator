import type { DesignDocumentGroup, DesignProfileDocuments } from "../model/types";

/** Группа подтверждающих документов в анкете проектировщика. */
interface DesignDocumentGroupOption {
  group: DesignDocumentGroup;
  field: keyof DesignProfileDocuments;
  label: string;
}

/** Связывает группу API, список файлов в анкете и подпись в форме документов. */
export const DESIGN_DOCUMENT_GROUPS: DesignDocumentGroupOption[] = [
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

/** Форматы для выбора файла в браузере и проверки перед загрузкой. */
export const DESIGN_DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

/** Максимальное число документов в каждой группе анкеты проектировщика. */
export const DESIGN_DOCUMENT_LIMIT = 5;

/** Максимальный размер одного документа в байтах: 10 МБ. */
export const DESIGN_DOCUMENT_MAX_SIZE = 10 * 1024 * 1024;

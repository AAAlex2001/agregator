import type { RtnDocumentType, RtnStatus } from "../api/rtnClarification.api";

export const DOCUMENT_TYPE_LABELS: Record<RtnDocumentType, string> = {
  OFFICIAL_CLARIFICATION: "Официальное разъяснение",
  INFO_LETTER: "Информационное письмо",
  RESPONSE_TO_REQUEST: "Ответ на обращение",
};

export const STATUS_LABELS: Record<RtnStatus, string> = {
  ACTIVE: "Действует",
  EXPIRED: "Утратило силу",
};

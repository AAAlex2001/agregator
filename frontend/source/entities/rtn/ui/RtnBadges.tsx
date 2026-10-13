import type { RtnDocumentType, RtnListItem, RtnStatus } from "../model/clarification";
import s from "./RtnBadges.module.scss";

const DOCUMENT_TYPE_LABELS: Record<RtnDocumentType, string> = {
  OFFICIAL_CLARIFICATION: "Официальное разъяснение",
  INFO_LETTER: "Информационное письмо",
  RESPONSE_TO_REQUEST: "Ответ на обращение",
};

const STATUS_LABELS: Record<RtnStatus, string> = {
  ACTIVE: "Действует",
  EXPIRED: "Утратило силу",
};

interface RtnBadgesProps {
  item: RtnListItem;
}

/** Тип документа и действует ли он. Как их расположить, решает родитель. */
export function RtnBadges({ item }: RtnBadgesProps) {
  return (
    <>
      <span className={s.type}>{DOCUMENT_TYPE_LABELS[item.document_type]}</span>
      <span className={item.status === "ACTIVE" ? s.active : s.expired}>{STATUS_LABELS[item.status]}</span>
    </>
  );
}

import {
  RTN_DOCUMENT_TYPE_LABELS,
  RTN_STATUS_LABELS,
} from "../../config/labels";
import type { RtnDocumentType, RtnStatus } from "../../model/types";
import styles from "./style.module.scss";

/** Вид документа и состояние его действия из карточки разъяснения. */
interface RtnBadgesProps {
  documentType: RtnDocumentType;
  status: RtnStatus;
}

/** Показывает вид документа и отметку о его действии. */
export function RtnBadges({ documentType, status }: RtnBadgesProps) {
  return (
    <>
      <span className={styles.type}>
        {RTN_DOCUMENT_TYPE_LABELS[documentType]}
      </span>
      <span className={status === "ACTIVE" ? styles.active : styles.expired}>
        {RTN_STATUS_LABELS[status]}
      </span>
    </>
  );
}

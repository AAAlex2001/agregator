import cn from "classnames";
import { getTechExpertAccessLabel, getTechExpertDocumentMeta } from "../../model/documents";
import type { TechExpertDocument } from "../../model/types";
import styles from "./style.module.scss";

/** Найденный документ и его открытие. */
interface DocumentRowProps {
  document: TechExpertDocument;
  onOpen: (documentId: number) => void;
}

/** Строка результата поиска: название, реквизиты, статус и уровень доступа. */
export function DocumentRow({ document, onOpen }: DocumentRowProps) {
  const accessClassName = styles[document.access] ?? styles.restricted;

  return (
    <button
      type="button"
      className={styles.row}
      onClick={() => onOpen(document.id)}
    >
      <span className={styles.name}>{document.name}</span>
      <span className={styles.meta}>{getTechExpertDocumentMeta(document)}</span>
      <span className={styles.badges}>
        {document.status && <span className={styles.badge}>{document.status}</span>}
        <span className={cn(styles.badge, accessClassName)}>
          {getTechExpertAccessLabel(document.access)}
        </span>
      </span>
    </button>
  );
}

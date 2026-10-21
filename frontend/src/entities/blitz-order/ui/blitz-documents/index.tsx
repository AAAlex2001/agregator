import { blitzDocumentUrl } from "../../api/blitz-file-urls";
import { BLITZ_DOCUMENT_LABELS } from "../../config/labels";
import type { BlitzDocument } from "../../model/types";
import styles from "./style.module.scss";

/** Файлы заявки. */
interface BlitzDocumentsProps {
  orderId: number;
  documents: BlitzDocument[];
}

/** Размер файла для людей. */
function formatSize(size: number): string {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} КБ`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} МБ`;
}

/** Файлы ссылками на скачивание с подписью, что это. */
export function BlitzDocuments({ orderId, documents }: BlitzDocumentsProps) {
  return (
    <ul className={styles.list}>
      {documents.map((document) => (
        <li key={document.id}>
          <a
            className={styles.file}
            href={blitzDocumentUrl(orderId, document.id)}
          >
            <span className={styles.name}>{document.name}</span>
            <span className={styles.meta}>
              {BLITZ_DOCUMENT_LABELS[document.kind]} · {formatSize(document.size)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

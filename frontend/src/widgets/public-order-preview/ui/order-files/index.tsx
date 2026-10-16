import { getOrderDocumentPaths } from "@/entities/order";
import type { OrderDocuments } from "@/entities/order";
import { getFileDisplayName } from "@/shared/lib/file-url";
import styles from "./style.module.scss";

/** Прикреплённые к заказу документы без доступа к скачиванию. */
interface OrderFilesProps {
  documents: OrderDocuments;
}

/** Сохраняет скрытый предварительный список файлов для гостя. */
export function OrderFiles({ documents }: OrderFilesProps) {
  const paths = getOrderDocumentPaths(documents);

  if (paths.length === 0) {
    return null;
  }

  return (
    <div className={styles.infoBlock}>
      <span className={styles.infoLabel}>Прикреплённые файлы</span>
      <div className={styles.filesGrid}>
        {paths.map((path) => (
          <div
            key={path}
            className={styles.fileItem}
          >
            <span className={styles.fileIcon}>📎</span>
            <span className={styles.fileName}>{getFileDisplayName(path)}</span>
            <div className={styles.fileBlur} />
          </div>
        ))}
      </div>
    </div>
  );
}

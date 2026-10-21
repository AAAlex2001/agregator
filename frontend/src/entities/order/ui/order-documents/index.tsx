import { getFileDisplayName, resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { OrderDocuments as Documents } from "../../model/types";
import styles from "./style.module.scss";

/** Четыре группы документов, приложенных заказчиком. */
interface OrderDocumentsProps {
  documents: Documents;
}

/** Группы документов в исходном порядке; у пустой группы — контур плитки с прочерком. */
export function OrderDocuments({ documents }: OrderDocumentsProps) {
  const groups = [
    { label: "Техническое задание", files: documents.technical },
    { label: "Проект договора", files: documents.contract },
    { label: "Карточка предприятия", files: documents.company },
    { label: "Иное", files: documents.other },
  ];

  return (
    <div className={styles.block}>
      <span className={styles.heading}>Документы заказчика</span>
      <div className={styles.groups}>
        {groups.map((group) => (
          <div
            key={group.label}
            className={styles.group}
          >
            {group.files.length > 0 ? (
              <FileGallery
                items={group.files.map((path) => ({
                  id: path,
                  name: getFileDisplayName(path),
                  url: resolveFileUrl(path),
                }))}
                blockClassName={styles.files}
              />
            ) : (
              <span
                className={styles.emptyTile}
                aria-label={`${group.label}: нет файла`}
              >
                —
              </span>
            )}
            <span className={styles.caption}>{group.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
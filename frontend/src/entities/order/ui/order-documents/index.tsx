import { getFileDisplayName, resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { OrderDocuments as Documents } from "../../model/types";
import styles from "./style.module.scss";

/** Четыре группы документов, приложенных заказчиком. */
interface OrderDocumentsProps {
  documents: Documents;
}

/** Показывает группы документов в исходном порядке, включая пустые группы. */
export function OrderDocuments({ documents }: OrderDocumentsProps) {
  const groups = [
    {
      label: "Техническое задание",
      files: documents.technical,
    },
    {
      label: "Проект договора",
      files: documents.contract,
    },
    {
      label: "Карточка предприятия",
      files: documents.company,
    },
    {
      label: "Иное",
      files: documents.other,
    },
  ];

  return (
    <div className={styles.block}>
      <span className={styles.heading}>Документы заказчика</span>
      <div className={styles.row}>
        {groups.map((group) => (
          <FileGallery
            key={group.label}
            items={group.files.map((path) => ({
              id: path,
              name: getFileDisplayName(path),
              url: resolveFileUrl(path),
            }))}
            label={group.label}
            emptyText="—"
            blockClassName={styles.column}
            labelClassName={styles.caption}
          />
        ))}
      </div>
    </div>
  );
}

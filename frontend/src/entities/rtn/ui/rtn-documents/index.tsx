import { FileGallery } from "@/shared/ui/file-gallery";
import { toRtnGalleryItem } from "../../model/files";
import type { RtnListItem } from "../../model/types";
import styles from "./style.module.scss";

/** Разъяснение с файлами запроса, ответа и адресом официального источника. */
interface RtnDocumentsProps {
  item: RtnListItem;
}

/** Показывает документы обращения и ответа в отдельных галереях. */
export function RtnDocuments({ item }: RtnDocumentsProps) {
  return (
    <div className={styles.documents}>
      {item.request_files.length > 0 && (
        <FileGallery
          items={item.request_files.map(toRtnGalleryItem)}
          label={item.request_files.length > 1 ? "Файлы запроса" : "Файл запроса"}
          blockClassName={styles.gallery}
        />
      )}
      {item.response_files.length > 0 && (
        <FileGallery
          items={item.response_files.map(toRtnGalleryItem)}
          label={item.response_files.length > 1 ? "Файлы ответов" : "Файл ответа"}
          blockClassName={styles.gallery}
        />
      )}
      {item.source_url && (
        <a
          className={styles.source}
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Источник на сайте Ростехнадзора
        </a>
      )}
    </div>
  );
}

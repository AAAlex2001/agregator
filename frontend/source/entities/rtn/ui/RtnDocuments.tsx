import { FileGallery } from "@/source/shared/ui/FileGallery";
import { toGalleryItem } from "../lib/files";
import type { RtnListItem } from "../model/clarification";
import s from "./RtnDocuments.module.scss";

interface RtnDocumentsProps {
  item: RtnListItem;
}

/** Файлы запроса, файлы ответа и ссылка на источник. */
export function RtnDocuments({ item }: RtnDocumentsProps) {
  return (
    <div className={s.documents}>
      {item.request_files.length > 0 && (
        <FileGallery
          items={item.request_files.map(toGalleryItem)}
          label={item.request_files.length > 1 ? "Файлы запроса" : "Файл запроса"}
          blockClassName={s.gallery}
        />
      )}
      {item.response_files.length > 0 && (
        <FileGallery
          items={item.response_files.map(toGalleryItem)}
          label={item.response_files.length > 1 ? "Файлы ответов" : "Файл ответа"}
          blockClassName={s.gallery}
        />
      )}
      {item.source_url && (
        <a className={s.source} href={item.source_url} target="_blank" rel="noopener noreferrer">
          Источник на сайте Ростехнадзора
        </a>
      )}
    </div>
  );
}

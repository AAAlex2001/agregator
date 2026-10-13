import { FileGallery } from "@/source/shared/ui/FileGallery";
import { DOCUMENT_CATEGORIES, DOCUMENT_LABELS, type OrderDocuments } from "../model/types";
import s from "./DocumentsGallery.module.scss";

interface DocumentsGalleryProps {
  documents: OrderDocuments;
}

export function DocumentsGallery({ documents }: DocumentsGalleryProps) {
  return (
    <div className={s.block}>
      <span className={s.heading}>Документы заказчика</span>
      <div className={s.row}>
        {DOCUMENT_CATEGORIES.map((category) => (
          <FileGallery
            key={category}
            files={documents[category]}
            label={DOCUMENT_LABELS[category]}
            emptyText="—"
            blockClassName={s.column}
            labelClassName={s.caption}
          />
        ))}
      </div>
    </div>
  );
}

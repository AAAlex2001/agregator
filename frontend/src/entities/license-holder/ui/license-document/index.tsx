import { getFileDisplayName, resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import styles from "./style.module.scss";

/** Один документ компании и подписи для его галереи. */
interface LicenseDocumentProps {
  url: string | null;
  fileId: string;
  fileName: string;
  label: string;
}

/** Показывает сохранённый документ с просмотром и скачиванием. */
export function LicenseDocument({
  url,
  fileId,
  fileName,
  label,
}: LicenseDocumentProps) {
  if (!url) {
    return null;
  }

  const file = {
    id: fileId,
    name: getFileDisplayName(url, fileName),
    url: resolveFileUrl(url),
  };

  return (
    <FileGallery
      items={[file]}
      label={label}
      labelClassName={styles.label}
      blockClassName={styles.fileBlock}
      gridProps={{ className: styles.fileGrid }}
      hideWhenEmpty
    />
  );
}

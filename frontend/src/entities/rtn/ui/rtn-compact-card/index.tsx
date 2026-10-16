import Link from "next/link";
import { formatDateRu } from "@/shared/lib/format-date";
import { FileGallery } from "@/shared/ui/file-gallery";
import { toRtnGalleryItem } from "../../model/files";
import type { RtnListItem } from "../../model/types";
import { RtnBadges } from "../rtn-badges";
import styles from "./style.module.scss";

/** Разъяснение и адрес перехода из подборки похожих материалов. */
interface RtnCompactCardProps {
  item: RtnListItem;
  href: string;
}

/** Показывает компактную карточку с реквизитами и общей галереей документов. */
export function RtnCompactCard({ item, href }: RtnCompactCardProps) {
  const files = [...item.request_files, ...item.response_files];

  return (
    <article className={styles.card}>
      <Link
        href={href}
        className={styles.link}
      >
        <div className={styles.top}>
          <RtnBadges
            documentType={item.document_type}
            status={item.status}
          />
        </div>
        <h3 className={styles.title}>{item.title}</h3>
        {item.excerpt && <p className={styles.excerpt}>{item.excerpt}</p>}
        <div className={styles.meta}>
          {item.letter_number && <span>№ {item.letter_number}</span>}
          {item.department && (
            <span className={styles.department}>{item.department}</span>
          )}
          <time dateTime={item.published_at ?? undefined}>
            {formatDateRu(item.published_at)}
          </time>
        </div>
        {item.tags.length > 0 && (
          <div className={styles.tags}>
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={styles.tag}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
      {files.length > 0 && (
        <div className={styles.documents}>
          <FileGallery
            items={files.map(toRtnGalleryItem)}
            label="Документ"
            blockClassName={styles.gallery}
          />
        </div>
      )}
    </article>
  );
}

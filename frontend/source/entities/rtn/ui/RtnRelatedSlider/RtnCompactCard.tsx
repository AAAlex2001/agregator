import Link from "next/link";
import { formatDateRu } from "@/source/shared/lib/formatDate";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { toGalleryItem } from "../../lib/files";
import { rtnHref } from "../../lib/rtnHref";
import type { RtnListItem } from "../../model/clarification";
import { RtnBadges } from "../RtnBadges";
import s from "./RtnCompactCard.module.scss";

interface RtnCompactCardProps {
  item: RtnListItem;
  basePath: string;
}

/** Узкая карточка разъяснения для слайдера: реквизиты в строку, все файлы одной галереей. */
export function RtnCompactCard({ item, basePath }: RtnCompactCardProps) {
  const files = [...item.request_files, ...item.response_files];

  return (
    <article className={s.card}>
      <Link href={rtnHref(basePath, item.slug)} className={s.link}>
        <div className={s.top}>
          <RtnBadges item={item} />
        </div>

        <h3 className={s.title}>{item.title}</h3>
        {item.excerpt && <p className={s.excerpt}>{item.excerpt}</p>}

        <div className={s.meta}>
          {item.letter_number && <span>№ {item.letter_number}</span>}
          {item.department && <span className={s.department}>{item.department}</span>}
          <time dateTime={item.published_at ?? undefined}>{formatDateRu(item.published_at)}</time>
        </div>

        {item.tags.length > 0 && (
          <div className={s.tags}>
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={s.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      {files.length > 0 && (
        <div className={s.documents}>
          <FileGallery items={files.map(toGalleryItem)} label="Документ" blockClassName={s.gallery} />
        </div>
      )}
    </article>
  );
}

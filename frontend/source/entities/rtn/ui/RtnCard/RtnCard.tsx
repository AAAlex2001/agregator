import cn from "classnames";
import Link from "next/link";
import { formatDateRu } from "@/source/shared/lib/formatDate";
import { hasRtnDocuments } from "../../lib/files";
import { rtnHref } from "../../lib/rtnHref";
import type { RtnListItem } from "../../model/clarification";
import { RtnBadges } from "../RtnBadges";
import { RtnDocuments } from "../RtnDocuments";
import s from "./RtnCard.module.scss";

interface RtnCardProps {
  item: RtnListItem;
  basePath: string;
}

/** Разъяснение в каталоге: описание и реквизиты письма, справа — документы. */
export function RtnCard({ item, basePath }: RtnCardProps) {
  const withDocuments = hasRtnDocuments(item);

  return (
    <li className={cn(s.card, { [s.withAside]: withDocuments })}>
      <Link href={rtnHref(basePath, item.slug)} className={s.link}>
        <div className={s.top}>
          <RtnBadges item={item} />
        </div>

        <h3 className={s.title}>{item.title}</h3>
        {item.excerpt && <p className={s.excerpt}>{item.excerpt}</p>}

        {item.tags.length > 0 && (
          <div className={s.tags}>
            {item.tags.map((tag) => (
              <span key={tag} className={s.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={s.meta}>
          {item.letter_number && (
            <div className={s.metaItem}>
              <span className={s.metaLabel}>Номер документа</span>
              <span className={s.metaValue}>№ {item.letter_number}</span>
            </div>
          )}
          {item.department && (
            <div className={cn(s.metaItem, s.wide)}>
              <span className={s.metaLabel}>Подразделение Ростехнадзора</span>
              <span className={s.metaValue}>{item.department}</span>
            </div>
          )}
          <div className={s.metaItem}>
            <span className={s.metaLabel}>Дата публикации</span>
            <time className={s.metaValue} dateTime={item.published_at ?? undefined}>
              {formatDateRu(item.published_at)}
            </time>
          </div>
        </div>
      </Link>

      {withDocuments && (
        <div className={s.aside}>
          <h4 className={s.asideTitle}>Документы</h4>
          <RtnDocuments item={item} />
        </div>
      )}
    </li>
  );
}

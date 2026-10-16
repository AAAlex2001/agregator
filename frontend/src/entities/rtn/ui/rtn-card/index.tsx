import classNames from "classnames";
import Link from "next/link";
import { formatDateRu } from "@/shared/lib/format-date";
import { hasRtnDocuments } from "../../model/files";
import type { RtnListItem } from "../../model/types";
import { RtnBadges } from "../rtn-badges";
import { RtnDocuments } from "../rtn-documents";
import styles from "./style.module.scss";

/** Разъяснение и адрес его страницы в публичном разделе или кабинете. */
interface RtnCardProps {
  item: RtnListItem;
  href: string;
}

/** Показывает описание, реквизиты и документы разъяснения в каталоге. */
export function RtnCard({ item, href }: RtnCardProps) {
  const withDocuments = hasRtnDocuments(item);

  return (
    <li
      className={classNames(styles.card, {
        [styles.withAside]: withDocuments,
      })}
    >
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

        {item.tags.length > 0 && (
          <div className={styles.tags}>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={styles.tag}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={styles.meta}>
          {item.letter_number && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Номер документа</span>
              <span className={styles.metaValue}>№ {item.letter_number}</span>
            </div>
          )}
          {item.department && (
            <div className={classNames(styles.metaItem, styles.wide)}>
              <span className={styles.metaLabel}>Подразделение Ростехнадзора</span>
              <span className={styles.metaValue}>{item.department}</span>
            </div>
          )}
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Дата публикации</span>
            <time
              className={styles.metaValue}
              dateTime={item.published_at ?? undefined}
            >
              {formatDateRu(item.published_at)}
            </time>
          </div>
        </div>
      </Link>

      {withDocuments && (
        <div className={styles.aside}>
          <h4 className={styles.asideTitle}>Документы</h4>
          <RtnDocuments item={item} />
        </div>
      )}
    </li>
  );
}

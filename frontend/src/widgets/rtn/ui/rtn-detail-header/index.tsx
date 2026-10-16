import { RtnBadges, RtnClassification } from "@/entities/rtn";
import type { RtnDetail } from "@/entities/rtn";
import { formatDateRu } from "@/shared/lib/format-date";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Полное разъяснение для заголовка, реквизитов и классификации. */
interface RtnDetailHeaderProps {
  clarification: RtnDetail;
}

/** Показывает заголовок разъяснения, реквизиты письма и его тематические отметки. */
export function RtnDetailHeader({ clarification }: RtnDetailHeaderProps) {
  return (
    <header className={styles.head}>
      <div className={styles.badges}>
        <RtnBadges
          documentType={clarification.document_type}
          status={clarification.status}
        />
      </div>
      <Title
        text={clarification.title}
        as="h1"
        className={styles.title}
      />
      {clarification.excerpt && (
        <Subtitle
          text={clarification.excerpt}
          className={styles.subtitle}
        />
      )}
      <div className={styles.meta}>
        {clarification.letter_number && <span>№ {clarification.letter_number}</span>}
        {clarification.department && <span>{clarification.department}</span>}
        {clarification.published_at && (
          <time dateTime={clarification.published_at}>
            {formatDateRu(clarification.published_at)}
          </time>
        )}
      </div>
      <RtnClassification clarification={clarification} />
      {clarification.tags.length > 0 && (
        <div className={styles.tags}>
          {clarification.tags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

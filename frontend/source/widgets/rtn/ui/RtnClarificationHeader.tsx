import { RtnBadges, RtnClassification, type RtnDetail } from "@/source/entities/rtn";
import { formatDateRu } from "@/source/shared/lib/formatDate";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./RtnClarificationHeader.module.scss";

interface RtnClarificationHeaderProps {
  clarification: RtnDetail;
}

/** Шапка разъяснения: тип и статус, заголовок, реквизиты письма, классификация и теги. */
export function RtnClarificationHeader({ clarification }: RtnClarificationHeaderProps) {
  return (
    <header className={s.head}>
      <div className={s.badges}>
        <RtnBadges item={clarification} />
      </div>
      <Title text={clarification.title} as="h1" className={s.title} />
      {clarification.excerpt && <Subtitle text={clarification.excerpt} className={s.subtitle} />}

      <div className={s.meta}>
        {clarification.letter_number && <span>№ {clarification.letter_number}</span>}
        {clarification.department && <span>{clarification.department}</span>}
        {clarification.published_at && (
          <time dateTime={clarification.published_at}>{formatDateRu(clarification.published_at)}</time>
        )}
      </div>

      <RtnClassification clarification={clarification} />

      {clarification.tags.length > 0 && (
        <div className={s.tags}>
          {clarification.tags.map((tag) => (
            <span key={tag} className={s.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

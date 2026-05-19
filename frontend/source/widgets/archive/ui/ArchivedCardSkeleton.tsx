import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ArchivedCardSkeleton.module.scss";

export function ArchivedCardSkeleton() {
  return (
    <article className={s.card} aria-hidden="true">
      <div className={s.body}>
        <div className={s.left}>
          <div className={s.headRow}>
            <Skeleton className={s.meta} rounded="pill" />
            <Skeleton className={s.statusBadge} rounded="pill" />
          </div>
          <div className={s.titleBlock}>
            <Skeleton className={s.titleLabel} rounded="pill" />
            <Skeleton className={s.title} rounded="md" />
            <Skeleton className={s.titleShort} rounded="md" />
          </div>
          <Skeleton className={s.badges} rounded="pill" />
          <div className={s.bottomLeft}>
            <Skeleton className={s.label} rounded="pill" />
            <Skeleton className={s.value} rounded="pill" />
          </div>
        </div>

        <div className={s.right}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={s.rightItem}>
              <Skeleton className={s.label} rounded="pill" />
              <Skeleton className={s.value} rounded="pill" />
            </div>
          ))}
        </div>
      </div>

      <div className={s.details}>
        <div className={s.detailsSection}>
          <Skeleton className={s.sectionTitle} rounded="pill" />
          <Skeleton className={s.commentLine} rounded="md" />
          <Skeleton className={s.commentLineShort} rounded="md" />
        </div>

        <div className={s.questionsBlock}>
          <Skeleton className={s.sectionTitle} rounded="pill" />
          <ul className={s.questionsList}>
            {[0, 1].map((i) => (
              <li key={i} className={s.questionCard}>
                <div className={s.questionHead}>
                  <Skeleton className={s.qAvatar} rounded="pill" />
                  <div className={s.qHeadText}>
                    <Skeleton className={s.qName} rounded="md" />
                    <Skeleton className={s.qDate} rounded="md" />
                  </div>
                </div>
                <Skeleton className={s.qLine} rounded="md" />
                <Skeleton className={s.qLineShort} rounded="md" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

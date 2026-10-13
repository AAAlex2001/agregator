import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ReferralPanelSkeleton.module.scss";

/** Заглушка вкладки «Приглашения», пока грузятся ссылка и итоги. */
export function ReferralPanelSkeleton() {
  return (
    <section className={s.panel} aria-busy="true" role="status" aria-label="Загружаем приглашения">
      <div className={s.card}>
        <div className={s.copy}>
          <Skeleton className={s.text} />
          <Skeleton className={s.block} />
          <Skeleton className={s.text} />
          <Skeleton className={s.link} />
        </div>
        <Skeleton className={s.artwork} />
      </div>

      <div className={s.stats}>
        {[1, 2, 3].map((key) => (
          <Skeleton key={key} className={s.block} />
        ))}
      </div>
    </section>
  );
}

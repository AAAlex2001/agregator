import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ReferralPanel.module.scss";

export function ReferralPanelSkeleton() {
  return (
    <section className={s.panel} aria-busy="true" role="status" aria-label="Загружаем приглашения">
      <div className={s.invitationCard}>
        <div className={s.copy}>
          <div className={s.loading}>
            <Skeleton className={s.textSkeleton} />
            <Skeleton className={s.balanceSkeleton} />
            <Skeleton className={s.textSkeleton} />
          </div>
          <div className={s.invite}>
            <Skeleton className={s.linkSkeleton} />
          </div>
        </div>
        <Skeleton className={s.artwork} />
      </div>
      <div className={s.resultsSection}>
        <div className={s.stats}>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className={s.balanceSkeleton} />
          ))}
        </div>
      </div>
    </section>
  );
}

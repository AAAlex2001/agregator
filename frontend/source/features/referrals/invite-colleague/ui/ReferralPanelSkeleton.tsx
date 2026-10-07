import Skeleton from "@/source/shared/ui/Skeleton";
import { Title } from "@/source/shared/ui/Typography";
import s from "./ReferralPanel.module.scss";

export function ReferralPanelSkeleton() {
  return (
    <section className={s.panel} aria-busy="true">
      <Title text="Приглашайте коллег" className={s.title} />
      <div className={s.loading} role="status" aria-label="Загружаем приглашения">
        <Skeleton className={s.textSkeleton} />
        <Skeleton className={s.balanceSkeleton} />
        <Skeleton className={s.linkSkeleton} />
      </div>
    </section>
  );
}

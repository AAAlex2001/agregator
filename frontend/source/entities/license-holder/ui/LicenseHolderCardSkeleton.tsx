import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./LicenseHolderCardSkeleton.module.scss";

export function LicenseHolderCardSkeleton() {
  return (
    <article className={s.card} aria-hidden="true">
      <Skeleton className={s.company} />
      <div className={s.metaRow}>
        <Skeleton className={s.metaShort} />
        <Skeleton className={s.metaLong} />
      </div>
      <Skeleton className={s.contact} />
      <div className={s.badges}>
        <Skeleton className={s.badge} rounded="sm" />
        <Skeleton className={s.badge} rounded="sm" />
        <Skeleton className={s.badge} rounded="sm" />
      </div>
      <Skeleton className={s.rental} rounded="sm" />
    </article>
  );
}

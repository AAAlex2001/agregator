import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./SettingsSkeleton.module.scss";

interface SettingsSkeletonProps {
  section: "personal" | "finance";
}

export function SettingsSkeleton({ section }: SettingsSkeletonProps) {
  if (section === "finance") {
    return (
      <div className={s.finance} aria-hidden="true">
        <Skeleton className={s.balance} rounded="pill" />
        <div className={s.financeButtons}>
          <Skeleton className={s.financeButton} rounded="lg" />
          <Skeleton className={s.financeButton} rounded="lg" />
        </div>
        <div className={s.financeList}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={s.financeItem}>
              <Skeleton className={s.financeLineWide} />
              <Skeleton className={s.financeLineShort} rounded="pill" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={s.form} aria-hidden="true">
      <div className={s.section}>
        <Skeleton className={s.sectionTitle} rounded="pill" />
        <div className={s.grid}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className={s.input} rounded="lg" />
          ))}
        </div>
      </div>

      <div className={s.section}>
        <Skeleton className={s.sectionTitle} rounded="pill" />
        <div className={s.grid}>
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className={s.input} rounded="lg" />
          ))}
        </div>
      </div>

      <div className={s.actions}>
        <Skeleton className={s.actionButton} rounded="lg" />
        <Skeleton className={s.actionButton} rounded="lg" />
      </div>
    </div>
  );
}
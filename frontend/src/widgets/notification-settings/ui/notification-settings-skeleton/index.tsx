import { Skeleton } from "@/shared/ui/skeleton";
import { SwitchSkeleton } from "../switch-skeleton";
import styles from "./style.module.scss";

/** Сохраняет размеры заголовка и списка переключателей, пока загружается профиль. */
export function NotificationSettingsSkeleton() {
  return (
    <div
      className={styles.notifications}
      aria-hidden="true"
    >
      <div className={styles.header}>
        <Skeleton
          className={styles.title}
          rounded="pill"
        />
        <Skeleton
          className={styles.subtitle}
          rounded="pill"
        />
      </div>
      <div className={styles.list}>
        <SwitchSkeleton />
        <SwitchSkeleton />
        <SwitchSkeleton />
        <SwitchSkeleton />
      </div>
    </div>
  );
}

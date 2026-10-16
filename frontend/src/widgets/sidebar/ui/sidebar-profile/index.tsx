import Link from "next/link";
import type { UserProfile } from "@/entities/user";
import { Skeleton } from "@/shared/ui/skeleton";
import { UserAvatar } from "@/shared/ui/user-avatar";
import styles from "./style.module.scss";

/** Профиль в меню и закрытие мобильной панели при переходе к настройкам. */
interface SidebarProfileProps {
  user: UserProfile | null;
  onNavigate: () => void;
}

/** Показывает аватар, имя и город либо заглушку загрузки профиля. */
export function SidebarProfile({ user, onNavigate }: SidebarProfileProps) {
  if (!user) {
    return (
      <div
        className={styles.profile}
        aria-label="Загрузка профиля"
      >
        <Skeleton
          className={styles.avatar}
          rounded="pill"
        />
        <Skeleton
          className={styles.nameSkeleton}
          rounded="md"
        />
      </div>
    );
  }

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const displayName = name || user.email || "Личный кабинет";
  const city = user.expert?.location_city;

  return (
    <Link
      href="/settings"
      className={styles.profile}
      onClick={onNavigate}
    >
      <UserAvatar
        src={user.avatar_url}
        alt={displayName}
        className={styles.avatar}
      />
      <span className={styles.person}>
        <span className={styles.name}>{displayName}</span>
        {city && <span className={styles.city}>{city}</span>}
      </span>
    </Link>
  );
}

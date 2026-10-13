import Link from "next/link";
import type { UserProfile } from "@/source/entities/user";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./Sidebar.module.scss";

interface SidebarProfileProps {
  user: UserProfile | null;
  onNavigate: () => void;
}

/** Показывает фото, имя и город пользователя из текущей сессии. */
export function SidebarProfile({ user, onNavigate }: SidebarProfileProps) {
  if (!user) {
    return (
      <div className={s.profile} aria-label="Загрузка профиля">
        <Skeleton className={s.avatar} rounded="pill" />
        <Skeleton className={s.nameSkeleton} rounded="md" />
      </div>
    );
  }

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const displayName = name || user.email || "Личный кабинет";
  const city = user.expert?.location_city;

  return (
    <Link href="/settings" className={s.profile} onClick={onNavigate}>
      <UserAvatar src={user.avatar_url} alt={displayName} className={s.avatar} />
      <span className={s.person}>
        <span className={s.name}>{displayName}</span>
        {city && <span className={s.city}>{city}</span>}
      </span>
    </Link>
  );
}

import { LogoutIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Идёт ли выход и действие выхода. */
interface SidebarLogoutProps {
  isLoggingOut: boolean;
  onLogout: () => void;
}

/** Кнопка выхода из кабинета в нижней части меню. */
export function SidebarLogout({ isLoggingOut, onLogout }: SidebarLogoutProps) {
  return (
    <button
      type="button"
      className={styles.logout}
      disabled={isLoggingOut}
      onClick={onLogout}
    >
      <span
        className={styles.icon}
        aria-hidden="true"
      >
        <LogoutIcon />
      </span>
      <span className={styles.label}>
        {isLoggingOut ? "Выходим…" : "Выйти"}
      </span>
    </button>
  );
}

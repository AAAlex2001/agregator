"use client";

import cn from "classnames";
import { useUser } from "@/entities/user";
import { ExpertIcon } from "@/shared/ui/icons";
import { DrawerContent } from "../drawer-content";
import styles from "./style.module.scss";

/** Открыта ли панель. */
interface LicenseHoldersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Нижняя панель с каталогом держателей документов для исполнителя. */
export function LicenseHoldersDrawer({ isOpen, onClose }: LicenseHoldersDrawerProps) {
  const { role } = useUser();

  if (role !== "EXPERT") {
    return null;
  }

  return (
    <>
      <div
        className={cn(styles.backdrop, {
          [styles.backdropVisible]: isOpen,
        })}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(styles.drawer, {
          [styles.drawerOpen]: isOpen,
        })}
        aria-label="Держатели разрешительных документов"
        aria-hidden={!isOpen}
      >
        <header className={styles.head}>
          <div className={styles.headTitle}>
            <span className={styles.headIcon}>
              <ExpertIcon />
            </span>
            <div>
              <h2 className={styles.title}>
                Держатели разрешительных документов
              </h2>
              <p className={styles.subtitle}>
                Компании, предоставляющие лицензии
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>
        <div className={styles.body}>
          {isOpen && <DrawerContent />}
        </div>
      </aside>
    </>
  );
}

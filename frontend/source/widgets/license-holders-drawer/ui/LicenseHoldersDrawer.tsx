"use client";

import { usePathname } from "next/navigation";
import {
  LicenseHolderCard,
  LicenseHolderCardSkeleton,
  useLicenseHolders,
} from "@/source/entities/license-holder";
import { ExpertIcon } from "@/source/shared/ui/icons";
import { useLicenseHoldersDrawer } from "../model/DrawerContext";
import s from "./LicenseHoldersDrawer.module.scss";

const SKELETON_COUNT = 4;
const HIDDEN_ROUTES = [/^\/chat(?:\/.*)?$/, /^\/expert\/room$/, /^\/support(?:\/.*)?$/];

export function LicenseHoldersDrawer() {
  const { isAvailable, isOpen, open, close } = useLicenseHoldersDrawer();
  const { items, isLoading, error } = useLicenseHolders(isAvailable);
  const pathname = usePathname();

  if (!isAvailable) return null;

  const hideFab = HIDDEN_ROUTES.some((pattern) => pattern.test(pathname));

  return (
    <>
      {!isOpen && !hideFab && (
        <button type="button" className={s.fab} onClick={open} aria-label="Держатели лицензии">
          <span className={s.fabIcon}>
            <ExpertIcon />
            {!isLoading && items.length > 0 && <span className={s.fabBadge}>{items.length}</span>}
          </span>
          <span className={s.fabLabel}>Держатели лицензии</span>
        </button>
      )}

      <div
        className={`${s.backdrop} ${isOpen ? s.backdropVisible : ""}`}
        onClick={close}
        aria-hidden
      />

      <aside
        className={`${s.drawer} ${isOpen ? s.drawerOpen : ""}`}
        aria-label="Держатели лицензии"
        aria-hidden={!isOpen}
      >
        <header className={s.head}>
          <div className={s.headTitle}>
            <span className={s.headIcon}>
              <ExpertIcon />
            </span>
            <div>
              <h2 className={s.title}>Держатели лицензии</h2>
              <p className={s.subtitle}>Компании, предоставляющие лицензии</p>
            </div>
          </div>
          <button type="button" className={s.close} onClick={close} aria-label="Закрыть">
            ×
          </button>
        </header>

        <div className={s.body}>
          {isLoading ? (
            <div className={s.list}>
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <LicenseHolderCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <p className={s.message}>{error}</p>
          ) : items.length === 0 ? (
            <p className={s.message}>Пока нет зарегистрированных держателей лицензии.</p>
          ) : (
            <div className={s.list}>
              {items.map((item) => (
                <LicenseHolderCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

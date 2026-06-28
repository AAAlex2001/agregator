"use client";

import {
  LicenseHolderCard,
  LicenseHolderCardSkeleton,
  useLicenseHolders,
} from "@/source/entities/license-holder";
import { useLicenseHoldersDrawer } from "../model/DrawerContext";
import s from "./LicenseHoldersPanel.module.scss";

const SKELETON_COUNT = 3;

export function LicenseHoldersPanel() {
  const { isAvailable, isOpen, open, close } = useLicenseHoldersDrawer();
  const { items, isLoading, error } = useLicenseHolders(isAvailable);

  if (!isAvailable) return null;

  return (
    <>
      {!isOpen && (
        <button type="button" className={s.handle} onClick={open} aria-label="Держатели лицензии">
          Держатели лицензии
        </button>
      )}

      <div
        className={`${s.backdrop} ${isOpen ? s.backdropVisible : ""}`}
        onClick={close}
        aria-hidden
      />

      <aside
        className={`${s.sidebar} ${isOpen ? s.sidebarOpen : ""}`}
        aria-label="Держатели лицензии"
      >
        <header className={s.header}>
          <h2 className={s.title}>Держатели лицензии</h2>
          <button
            type="button"
            className={s.closeButton}
            onClick={close}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>

        <div className={s.body}>
          {isLoading && (
            <div className={s.list}>
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <LicenseHolderCardSkeleton key={i} />
              ))}
            </div>
          )}
          {error && <p className={s.error}>{error}</p>}
          {!isLoading && !error && items.length === 0 && (
            <p className={s.muted}>Пока нет зарегистрированных держателей лицензии.</p>
          )}
          {!isLoading && !error && items.length > 0 && (
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

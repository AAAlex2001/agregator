"use client";

import { LicenseHolderCard, useLicenseHolders } from "@/source/entities/license-holder";
import { ExpertIcon } from "@/source/shared/ui/icons";
import Loader from "@/source/shared/ui/Loader";
import { useLicenseHoldersDrawer } from "../model/DrawerContext";
import s from "./LicenseHoldersDrawer.module.scss";

export function LicenseHoldersDrawer() {
  const { isAvailable, isOpen, anchor, close } = useLicenseHoldersDrawer();
  const { items, isLoading, error } = useLicenseHolders(isAvailable);

  if (!isAvailable) return null;

  return (
    <>
      <div
        className={`${s.backdrop} ${isOpen ? s.backdropVisible : ""}`}
        onClick={close}
        aria-hidden
      />

      <aside
        className={`${s.drawer} ${anchor ? s.pop : s.sheet} ${isOpen ? s.drawerOpen : ""}`}
        style={anchor ? { left: anchor.left, top: anchor.top } : undefined}
        aria-label="Держатели разрешительных документов"
        aria-hidden={!isOpen}
      >
        <header className={s.head}>
          <div className={s.headTitle}>
            <span className={s.headIcon}>
              <ExpertIcon />
            </span>
            <div>
              <h2 className={s.title}>Держатели разрешительных документов</h2>
              <p className={s.subtitle}>Компании, предоставляющие лицензии</p>
            </div>
          </div>
          <button type="button" className={s.close} onClick={close} aria-label="Закрыть">
            ×
          </button>
        </header>

        <div className={s.body}>
          {isLoading ? (
            <div className={s.loading}>
              <Loader size="md" label="" />
            </div>
          ) : error ? (
            <p className={s.message}>{error}</p>
          ) : items.length === 0 ? (
            <p className={s.message}>Пока нет зарегистрированных держателей разрешительных документов.</p>
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

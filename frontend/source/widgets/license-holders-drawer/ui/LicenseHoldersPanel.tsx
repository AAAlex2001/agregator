"use client";

import {
  LicenseHolderCard,
  LicenseHolderCardSkeleton,
  useLicenseHolders,
  type LicenseHolderListItem,
} from "@/source/entities/license-holder";
import { ExpertIcon } from "@/source/shared/ui/icons";
import { useLicenseHoldersDrawer } from "../model/DrawerContext";
import s from "./LicenseHoldersPanel.module.scss";

const SKELETON_COUNT = 3;

function companyName(item: LicenseHolderListItem): string {
  return (
    item.company_data?.value ??
    item.company_data?.unrestricted_value ??
    item.company_data?.data?.name?.short_with_opf ??
    "Лицензиат"
  );
}

export function LicenseHoldersPanel() {
  const { isAvailable, isOpen, open, close } = useLicenseHoldersDrawer();
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
        className={`${s.sidebar} ${isOpen ? s.sidebarOpen : s.collapsed}`}
        aria-label="Держатели лицензии"
      >
        {isOpen ? (
          <>
            <header className={s.header}>
              <h2 className={s.title}>Держатели лицензии</h2>
              <button type="button" className={s.closeButton} onClick={close} aria-label="Закрыть">
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
          </>
        ) : (
          <div className={s.rail}>
            {!isLoading && items.length > 0 ? (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={s.railItem}
                  onClick={open}
                  aria-label={companyName(item)}
                >
                  <ExpertIcon className={s.railIcon} />
                  <span className={s.railTip}>{companyName(item)}</span>
                </button>
              ))
            ) : (
              <button type="button" className={s.railItem} onClick={open} aria-label="Держатели лицензии">
                <ExpertIcon className={s.railIcon} />
                <span className={s.railTip}>Держатели лицензии</span>
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

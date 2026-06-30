"use client";

import { useSession } from "@/source/features/session";
import { CheckIcon } from "@/source/shared/ui/icons";
import { getUsefulLinks } from "../model/links";
import { useUsefulLinks } from "../model/UsefulLinksContext";
import s from "./UsefulLinksDrawer.module.scss";

export function UsefulLinksDrawer() {
  const { role } = useSession();
  const { isOpen, anchor, close } = useUsefulLinks();

  const links = getUsefulLinks(role);
  if (links.length === 0) return null;

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
        aria-label="Полезные ссылки"
        aria-hidden={!isOpen}
      >
        <header className={s.head}>
          <div className={s.headTitle}>
            <span className={s.headIcon}>
              <CheckIcon color="currentColor" />
            </span>
            <div>
              <h2 className={s.title}>Полезные ссылки</h2>
              <p className={s.subtitle}>Внешние сервисы и реестры</p>
            </div>
          </div>
          <button type="button" className={s.close} onClick={close} aria-label="Закрыть">
            ×
          </button>
        </header>

        <div className={s.body}>
          <div className={s.list}>
            {links.map(({ href, label, description, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={s.card}
                onClick={close}
              >
                <span className={s.cardIcon}>
                  <Icon color="currentColor" />
                </span>
                <span className={s.cardText}>
                  <span className={s.cardLabel}>{label}</span>
                  <span className={s.cardDesc}>{description}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

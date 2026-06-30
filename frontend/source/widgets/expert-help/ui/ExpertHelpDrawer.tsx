"use client";

import Link from "next/link";
import { LifebuoyIcon } from "@/source/shared/ui/icons";
import { EXPERT_HELP_LINKS } from "../model/links";
import { useExpertHelpDrawer } from "../model/ExpertHelpContext";
import s from "./ExpertHelpDrawer.module.scss";

export function ExpertHelpDrawer() {
  const { isAvailable, isOpen, anchor, close } = useExpertHelpDrawer();

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
        aria-label="Помощь эксперту"
        aria-hidden={!isOpen}
      >
        <header className={s.head}>
          <div className={s.headTitle}>
            <span className={s.headIcon}>
              <LifebuoyIcon />
            </span>
            <div>
              <h2 className={s.title}>Помощь эксперту</h2>
              <p className={s.subtitle}>Инструменты расчётов для экспертизы</p>
            </div>
          </div>
          <button type="button" className={s.close} onClick={close} aria-label="Закрыть">
            ×
          </button>
        </header>

        <div className={s.body}>
          <div className={s.list}>
            {EXPERT_HELP_LINKS.map(({ href, label, description, Icon }) => (
              <Link key={href} href={href} className={s.card} onClick={close}>
                <span className={s.cardIcon}>
                  <Icon />
                </span>
                <span className={s.cardText}>
                  <span className={s.cardLabel}>{label}</span>
                  <span className={s.cardDesc}>{description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

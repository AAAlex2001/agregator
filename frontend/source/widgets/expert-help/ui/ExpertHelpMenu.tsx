"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/source/features/session";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { EXPERT_HELP_LINKS } from "../model/links";
import s from "./ExpertHelpMenu.module.scss";

export function ExpertHelpMenu() {
  const { role } = useSession();
  const [open, setOpen] = useState(false);

  if (role !== "EXPERT") return null;

  const close = () => setOpen(false);

  return (
    <div className={s.wrap}>
      <button
        type="button"
        className={`${s.trigger} ${open ? s.triggerOpen : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Помощь эксперту
        <ChevronIcon className={s.chevron} color="currentColor" />
      </button>

      {open && (
        <>
          <div className={s.backdrop} onClick={close} aria-hidden />
          <div className={s.menu} role="menu">
            {EXPERT_HELP_LINKS.map(({ href, label, Icon }) => (
              <Link key={href} href={href} className={s.item} role="menuitem" onClick={close}>
                <span className={s.itemIcon}>
                  <Icon />
                </span>
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

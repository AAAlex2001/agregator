"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/source/features/session";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { getReviewLinks } from "../model/links";
import s from "./ReviewsMenu.module.scss";

export function ReviewsMenu() {
  const { role } = useSession();
  const [open, setOpen] = useState(false);

  if (role !== "EXPERT" && role !== "CUSTOMER") return null;

  const close = () => setOpen(false);
  const links = getReviewLinks(role);

  return (
    <div className={s.wrap}>
      <div className={s.dropdown}>
        <button
          type="button"
          className={`${s.pill} ${open ? s.pillOpen : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          Все отзывы
          <ChevronIcon className={s.chevron} color="currentColor" />
        </button>

        {open && (
          <>
            <div className={s.backdrop} onClick={close} aria-hidden />
            <div className={s.menu} role="menu">
              {links.map(({ href, label, Icon }) => (
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
    </div>
  );
}

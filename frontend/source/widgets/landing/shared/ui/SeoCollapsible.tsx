"use client";

import { useState, type ReactNode } from "react";
import s from "./seo-collapsible.module.scss";

interface SeoCollapsibleProps {
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}

export function SeoCollapsible({ ariaLabel, className = "", children }: SeoCollapsibleProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className={`${s.section} ${className}`.trim()} aria-label={ariaLabel}>
      <div className={s.inner}>
        <div className={`${s.content} ${open ? s.open : ""}`.trim()}>{children}</div>

        <button type="button" className={s.toggle} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "Свернуть" : "Читать далее"}
        </button>
      </div>
    </section>
  );
}

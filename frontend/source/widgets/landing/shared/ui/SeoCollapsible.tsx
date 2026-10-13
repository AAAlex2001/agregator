"use client";

import cn from "classnames";
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
    <section className={cn(s.section, className)} aria-label={ariaLabel}>
      <div className={s.inner}>
        <div className={cn(s.content, { [s.open]: open })}>{children}</div>

        <button type="button" className={s.toggle} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "Свернуть" : "Читать далее"}
        </button>
      </div>
    </section>
  );
}

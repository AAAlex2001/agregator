"use client";

import { useState, type ReactNode } from "react";
import ChevronIcon from "@/source/shared/ui/icons/ChevronIcon";
import s from "./FormSection.module.scss";

interface FormSectionProps {
  id?: string;
  title?: string;
  hint?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function FormSection({
  id,
  title,
  hint,
  collapsible = false,
  defaultOpen = false,
  children,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isHidden = collapsible && !isOpen;

  const heading = (
    <>
      {title && <h2 className={s.title}>{title}</h2>}
      {hint && <p className={s.hint}>{hint}</p>}
    </>
  );

  return (
    <section id={id} className={s.section}>
      {collapsible ? (
        <button
          type="button"
          className={s.toggle}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className={s.toggleText}>{heading}</span>
          <ChevronIcon
            className={isOpen ? `${s.chevron} ${s.chevronOpen}` : s.chevron}
            color="currentColor"
          />
        </button>
      ) : (
        heading
      )}

      <div className={isHidden ? s.bodyHidden : s.body}>{children}</div>
    </section>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}

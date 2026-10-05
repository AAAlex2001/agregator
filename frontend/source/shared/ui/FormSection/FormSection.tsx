"use client";

import { useId, useState, type ReactNode } from "react";
import ChevronIcon from "@/source/shared/ui/icons/ChevronIcon";
import s from "./FormSection.module.scss";

interface FormSectionProps {
  id?: string;
  title?: string;
  hint?: string;
  className?: string;
  titleClassName?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function FormSection({
  id,
  title,
  hint,
  className = "",
  titleClassName = "",
  collapsible = false,
  defaultOpen = false,
  children,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const bodyId = useId();
  const heading = (
    <>
      {title && <h2 className={`${s.title} ${titleClassName}`}>{title}</h2>}
      {hint && <p className={s.hint}>{hint}</p>}
    </>
  );

  return (
    <section id={id} className={`${s.section} ${collapsible ? s.collapsible : ""} ${className}`}>
      {collapsible ? (
        <>
          <button
            type="button"
            className={s.toggle}
            aria-expanded={isOpen}
            aria-controls={bodyId}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className={s.toggleText}>{heading}</span>
            <ChevronIcon
              className={isOpen ? `${s.chevron} ${s.chevronOpen}` : s.chevron}
              color="currentColor"
            />
          </button>
          <div
            id={bodyId}
            className={`${s.collapse} ${isOpen ? s.collapseOpen : ""}`}
            aria-hidden={!isOpen}
            inert={!isOpen}
          >
            <div className={s.collapseInner}>
              <div className={s.body}>{children}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          {heading}
          <div className={s.body}>{children}</div>
        </>
      )}
    </section>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className={s.grid}>{children}</div>;
}

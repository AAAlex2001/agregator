"use client";

import cn from "classnames";
import { useId, useState, type ReactNode } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Заголовок и поля раздела; collapsible разрешает скрыть его содержимое. */
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

/** Раздел формы с заголовком и необязательным сворачиванием полей. */
export function FormSection({
  id,
  title,
  hint,
  className,
  titleClassName,
  collapsible = false,
  defaultOpen = false,
  children,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const bodyId = useId();

  const heading = (
    <>
      {title && <h2 className={cn(styles.title, titleClassName)}>{title}</h2>}

      {hint && <p className={styles.hint}>{hint}</p>}
    </>
  );

  return (
    <section
      id={id}
      className={cn(styles.section, { [styles.collapsible]: collapsible }, className)}
    >
      {collapsible ? (
        <>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={isOpen}
            aria-controls={bodyId}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={styles.toggleText}>{heading}</span>

            <ChevronIcon
              className={cn(styles.chevron, {
                [styles.chevronOpen]: isOpen,
              })}
              color="currentColor"
            />
          </button>

          <div
            id={bodyId}
            className={cn(styles.collapse, {
              [styles.collapseOpen]: isOpen,
            })}
            aria-hidden={!isOpen}
            inert={!isOpen}
          >
            <div className={styles.collapseInner}>
              <div className={styles.body}>{children}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          {heading}
          <div className={styles.body}>{children}</div>
        </>
      )}
    </section>
  );
}

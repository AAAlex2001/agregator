"use client";

import classNames from "classnames";
import { useState } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import type { RtnDetail } from "../../model/types";
import styles from "./style.module.scss";

/** Разъяснение с выбранными областями надзора, отраслями и видами работ. */
interface RtnClassificationProps {
  clarification: RtnDetail;
}

/** Раскрывает классификацию разъяснения и скрывает незаполненные группы. */
export function RtnClassification({ clarification }: RtnClassificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const groups = [
    {
      title: "Область надзора",
      items: clarification.oversight_areas,
    },
    {
      title: "Отрасль",
      items: clarification.industries,
    },
    {
      title: "Вид деятельности",
      items: clarification.activities,
    },
    {
      title: "Тип объекта",
      items: clarification.object_types,
    },
  ].filter((group) => group.items.length > 0);
  const total = groups.flatMap((group) => group.items).length;

  /** Открывает или сворачивает список классификации. */
  function toggle() {
    setIsOpen((current) => !current);
  }

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <span>Классификация разъяснения</span>
        <span className={styles.count}>{total}</span>
        <ChevronIcon
          className={classNames(styles.chevron, {
            [styles.chevronOpen]: isOpen,
          })}
          color="currentColor"
        />
      </button>
      {isOpen && (
        <div className={styles.panel}>
          {groups.map((group) => (
            <div
              key={group.title}
              className={styles.group}
            >
              <span className={styles.groupTitle}>{group.title}</span>
              <div className={styles.chips}>
                {group.items.map((item) => (
                  <span
                    key={item.value}
                    className={styles.chip}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

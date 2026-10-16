import cn from "classnames";
import { useState } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import type { HeaderNavigationItem } from "../../model/types";
import styles from "./style.module.scss";

/** Региональный список организаций поверки приборов. */
interface DesktopRegionsProps {
  item: HeaderNavigationItem;
}

/** Раскрывает внешние ссылки на организации, сгруппированные по регионам. */
export function DesktopRegions({ item }: DesktopRegionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Показывает или скрывает список регионов. */
  function toggleRegions() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={styles.regionsWrap}>
      <button
        type="button"
        className={styles.regionsToggle}
        onClick={toggleRegions}
      >
        <span className={styles.itemLabel}>{item.label}</span>
        <ChevronIcon
          className={cn(styles.regionsChevron, {
            [styles.regionsChevronOpen]: isOpen,
          })}
          color="currentColor"
        />
      </button>
      {isOpen && (
        <div className={styles.regions}>
          {item.regions?.map((group) => (
            <div
              key={group.region}
              className={styles.region}
            >
              <span className={styles.regionName}>{group.region}</span>
              <div className={styles.regionLinks}>
                {group.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.regionLink}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

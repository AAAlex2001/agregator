import cn from "classnames";
import { useState } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import type { HeaderNavigationItem } from "../../model/types";
import styles from "./style.module.scss";

/** Список организаций поверки и переход из мобильного меню. */
interface MobileRegionsProps {
  item: HeaderNavigationItem;
  onNavigate: () => void;
}

/** Раскрывает регионы и закрывает меню при выборе внешней ссылки. */
export function MobileRegions({ item, onNavigate }: MobileRegionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Показывает или скрывает организации поверки приборов. */
  function toggleRegions() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={styles.regionsWrap}>
      <button
        type="button"
        className={styles.regionsToggle}
        onClick={toggleRegions}
        aria-expanded={isOpen}
      >
        <span className={styles.subHead}>
          <span className={styles.subLabel}>{item.label}</span>
        </span>
        <ChevronIcon
          className={cn(styles.chevron, {
            [styles.chevronOpen]: isOpen,
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
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.regionLink}
                  onClick={onNavigate}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

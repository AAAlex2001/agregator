import cn from "classnames";
import Link from "next/link";
import { useState } from "react";
import type { ChatUnreadCounts } from "@/entities/chat";
import { ChevronIcon, TechExpertLogoIcon } from "@/shared/ui/icons";
import type { HeaderNavigationSection } from "../../model/types";
import { CountBadge } from "../count-badge";
import { DesktopItem } from "../desktop-item";
import { DesktopRegions } from "../desktop-regions";
import { LicenseHoldersMenu } from "../license-holders-menu";
import { SectionLabel } from "../section-label";
import styles from "./style.module.scss";

/** Раздел площадки, направление раскрытия и счётчики непрочитанных. */
interface DesktopSectionProps {
  section: HeaderNavigationSection;
  align: "left" | "right";
  badges: ChatUnreadCounts;
}

/** Открывает меню раздела и загружает список держателей при первом обращении. */
export function DesktopSection({ section, align, badges }: DesktopSectionProps) {
  const [hasVisited, setHasVisited] = useState(false);

  /** Запоминает первое наведение, фокус или нажатие на раздел. */
  function markVisited() {
    setHasVisited(true);
  }

  if (section.href) {
    return (
      <div
        className={cn(styles.plateWrap, {
          [styles[section.color]]: !section.logo,
        })}
      >
        <Link
          href={section.href}
          className={cn(styles.plate, {
            [styles.plateLogo]: section.logo,
          })}
          aria-label={section.label}
        >
          {section.logo ? (
            <TechExpertLogoIcon title={section.label} />
          ) : (
            <SectionLabel section={section} />
          )}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(styles.plateWrap, styles[section.color])}
      onPointerEnter={markVisited}
      onFocus={markVisited}
    >
      <button
        type="button"
        className={styles.plate}
        onClick={markVisited}
      >
        <SectionLabel section={section} />
        {section.badge && <CountBadge count={badges[section.badge]} />}
        <ChevronIcon
          className={styles.chevron}
          color="currentColor"
        />
      </button>
      <div
        className={cn(styles.dropdown, {
          [styles.dropRight]: align === "right",
        })}
      >
        <div className={styles.panel}>
          {section.dynamic === "license" ? (
            hasVisited && <LicenseHoldersMenu />
          ) : (
            <div className={styles.list}>
              {section.items?.map((item) =>
                item.regions ? (
                  <DesktopRegions
                    key={item.label}
                    item={item}
                  />
                ) : (
                  <DesktopItem
                    key={item.label}
                    item={item}
                    badges={badges}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

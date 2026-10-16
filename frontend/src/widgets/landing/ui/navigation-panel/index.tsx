"use client";

import cn from "classnames";
import { useEffect, useState } from "react";
import { LANDING_NAVIGATION_ITEMS } from "../../config/navigation";
import type {
  LandingNavigationItem,
  LandingNavigationProps,
} from "../../model/types";
import { NavigationMap } from "../navigation-map";
import { NavigationOption } from "../navigation-option";
import styles from "./style.module.scss";

/** Выбирает направление и размещает его карту рядом или внутри списка. */
export function NavigationPanel({
  activeHref = "/",
  onNavigate,
  renderMap,
}: LandingNavigationProps) {
  const [activeItem, setActiveItem] = useState(
    () => LANDING_NAVIGATION_ITEMS.find((item) => item.href === activeHref)
      ?? LANDING_NAVIGATION_ITEMS[0],
  );
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1440px)");

    /** Переносит карту внутрь выбранного пункта на узком экране. */
    function updateLayout() {
      setIsDesktop(media.matches);
    }

    updateLayout();
    media.addEventListener("change", updateLayout);

    return () => media.removeEventListener("change", updateLayout);
  }, []);

  /** Показывает выбранную карту и открывает страницу направления, если она есть. */
  function selectItem(item: LandingNavigationItem) {
    setActiveItem(item);

    if (item.href && item.href !== activeHref) {
      onNavigate(item.href);
    }
  }

  return (
    <div className={styles.panel}>
      <div className={cn(styles.grid, styles.gridStack)}>
        <ul className={styles.list}>
          {LANDING_NAVIGATION_ITEMS.map((item, index) => (
            <NavigationOption
              key={item.title}
              item={item}
              index={index}
              isActive={item === activeItem}
              onSelect={selectItem}
            >
              {!isDesktop && item === activeItem && (
                <NavigationMap item={item}>
                  {renderMap(item.direction)}
                </NavigationMap>
              )}
            </NavigationOption>
          ))}
        </ul>
        {isDesktop && (
          <div className={styles.right}>
            <NavigationMap item={activeItem}>
              {renderMap(activeItem.direction)}
            </NavigationMap>
          </div>
        )}
      </div>
    </div>
  );
}

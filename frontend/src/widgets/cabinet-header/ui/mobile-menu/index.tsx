import cn from "classnames";
import Link from "next/link";
import { useState } from "react";
import { LogoIcon } from "@/shared/ui/icons";
import type { HeaderNavigationSection } from "../../model/types";
import { MobileSection } from "../mobile-section";
import styles from "./style.module.scss";

/** Разделы текущей роли и ссылка на её заказы. */
interface MobileMenuProps {
  sections: HeaderNavigationSection[];
  ordersHref: string;
}

/** Управляет мобильным меню и сохраняет раскрытый раздел при переключении бургера. */
export function MobileMenu({ sections, ordersHref }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const mobileSections = sections.filter((section) => section.dynamic !== "license");

  /** Открывает или закрывает меню, сохраняя выбранный раздел. */
  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  /** Закрывает меню после перехода и сбрасывает раскрытый раздел. */
  function closeMenu() {
    setIsOpen(false);
    setOpenSection(null);
  }

  /** Раскрывает один раздел или сворачивает уже выбранный. */
  function toggleSection(key: string) {
    setOpenSection(openSection === key ? null : key);
  }

  return (
    <>
      <button
        type="button"
        className={cn(styles.burger, {
          [styles.open]: isOpen,
        })}
        onClick={toggleMenu}
        aria-label="Меню"
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen && (
        <nav className={styles.menu}>
          <div className={styles.menuLogo}>
            <LogoIcon />
          </div>
          <div className={styles.group}>
            <Link
              href={ordersHref}
              className={styles.groupHead}
              onClick={closeMenu}
            >
              Все заказы
            </Link>
          </div>

          {mobileSections.map((section) => (
            <MobileSection
              key={section.key}
              section={section}
              isOpen={openSection === section.key}
              onToggle={toggleSection}
              onNavigate={closeMenu}
            />
          ))}

          <div className={styles.group}>
            <Link
              href="/landing/news"
              className={styles.groupHead}
              onClick={closeMenu}
            >
              Новости
            </Link>
          </div>
          <div className={styles.group}>
            <Link
              href="/landing/blog"
              className={styles.groupHead}
              onClick={closeMenu}
            >
              Блог
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}

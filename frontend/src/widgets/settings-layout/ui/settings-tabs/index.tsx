import cn from "classnames";
import Link from "next/link";
import type { SettingsSection, SettingsTab } from "../../model/sections";
import styles from "./style.module.scss";

/** Вкладки роли и вкладка, открытая сейчас. */
interface SettingsTabsProps {
  tabs: SettingsTab[];
  activeSection: SettingsSection;
}

/** Переключает вкладки настроек ссылками, сохраняя выбор в адресе страницы. */
export function SettingsTabs({ tabs, activeSection }: SettingsTabsProps) {
  return (
    <nav
      className={styles.tabs}
      aria-label="Разделы"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`/settings?section=${tab.id}`}
          scroll={false}
          className={cn(styles.tab, {
            [styles.active]: tab.id === activeSection,
          })}
          aria-current={tab.id === activeSection ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

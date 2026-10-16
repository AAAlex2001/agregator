"use client";

import cn from "classnames";
import { TabItem } from "./ui/tab-item";
import styles from "./style.module.scss";

/** Вариант переключателя: id возвращается при выборе, label виден на кнопке. */
interface Tab {
  id: string;
  label: string;
  count?: number;
}

/** Доступные варианты и идентификатор активного выбора. */
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "squared" | "outlined" | "pill";
  className?: string;
  disabled?: boolean;
}

/** Класс полосы вкладок для каждого оформления. */
const BAR_CLASS_NAMES = {
  squared: styles.squaredBar,
  outlined: styles.tabs,
  pill: styles.pillBar,
};

/** Переключатель между вариантами с выделением текущего выбора. */
export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "squared",
  className,
  disabled = false,
}: TabsProps) {
  return (
    <div className={cn(BAR_CLASS_NAMES[variant], className)}>
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          id={tab.id}
          label={tab.label}
          count={tab.count}
          isActive={activeTab === tab.id}
          disabled={disabled}
          variant={variant}
          onSelect={onTabChange}
        />
      ))}
    </div>
  );
}

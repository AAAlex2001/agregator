"use client";

import cn from "classnames";
import styles from "./Tabs.module.scss";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "pill" | "squared" | "underline";
  className?: string;
}

const Tabs = ({ tabs, activeTab, onTabChange, variant = "default", className = "" }: TabsProps) => {
  if (variant === "underline") {
    return (
      <div className={cn(styles.underlineBar, className)} role="tablist" aria-label="Разделы">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={cn(styles.underline, { [styles.underlineActive]: activeTab === tab.id })}
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}{tab.count !== undefined && ` · ${tab.count}`}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "squared") {
    return (
      <div className={cn(styles.squaredBar, className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(styles.squared, { [styles.squaredActive]: activeTab === tab.id })}
            aria-pressed={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div className={cn(styles.pillBar, className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(styles.pill, { [styles.pillWithCount]: tab.count, [styles.pillActive]: activeTab === tab.id })}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {tab.count ? <span className={styles.pillCount}>{tab.count}</span> : null}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(styles.tabs, className)}>
      {tabs.map((tab) => (
        <span
          key={tab.id}
          className={activeTab === tab.id ? styles.active : ""}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onTabChange(tab.id);
            }
          }}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
};

export default Tabs;

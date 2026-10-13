"use client";

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
      <div className={`${styles.underlineBar} ${className}`} role="tablist" aria-label="Разделы">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`${styles.underline} ${activeTab === tab.id ? styles.underlineActive : ""}`}
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
      <div className={`${styles.squaredBar} ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.squared} ${activeTab === tab.id ? styles.squaredActive : ""}`}
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
      <div className={`${styles.pillBar} ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.pill} ${tab.count ? styles.pillWithCount : ""} ${activeTab === tab.id ? styles.pillActive : ""}`}
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
    <div className={`${styles.tabs} ${className}`}>
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

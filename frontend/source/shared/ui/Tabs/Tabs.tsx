"use client";

import styles from "./tabs.module.scss";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "pill";
  className?: string;
}

const Tabs = ({ tabs, activeTab, onTabChange, variant = "default", className = "" }: TabsProps) => {
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

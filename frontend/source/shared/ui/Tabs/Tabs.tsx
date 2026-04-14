"use client";

import styles from "./tabs.module.scss";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const Tabs = ({ tabs, activeTab, onTabChange, className = "" }: TabsProps) => {
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

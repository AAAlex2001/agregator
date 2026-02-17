import styles from "../responses.module.scss";
import type { ResponseTabKey } from "../store/types";

interface TabItem {
  key: ResponseTabKey;
  label: string;
  count: number;
}

interface ResponsesTabsProps {
  tabs: TabItem[];
  activeTab: ResponseTabKey;
  onChange: (tab: ResponseTabKey) => void;
}

export default function ResponsesTabs({ tabs, activeTab, onChange }: ResponsesTabsProps) {
  return (
    <div className={styles.tabBar}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tab} ${tab.count > 0 ? styles.tabWithCount : ""} ${activeTab === tab.key ? styles.tabActive : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          {tab.count > 0 && <span className={styles.tabCount}>{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

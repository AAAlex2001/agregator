interface TabItem<T extends string> {
  key: T;
  label: string;
  count: number;
}

interface ResponsesTabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  styles: Readonly<Record<string, string>>;
}

export default function ResponsesTabs<T extends string>({ tabs, activeTab, onChange, styles }: ResponsesTabsProps<T>) {
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

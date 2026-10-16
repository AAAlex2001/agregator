import type { LiningCatalog, LiningSelections } from "@/entities/lining";
import { Checkbox } from "@/shared/ui/checkbox";
import { Tabs } from "@/shared/ui/tabs";
import styles from "./style.module.scss";

/** Справочник, выбор эксперта и открытая группа факторов риска. */
interface LiningFactorsProps {
  catalog: LiningCatalog;
  selections: LiningSelections;
  activeGroup: string;
  onGroupChange: (group: string) => void;
  onSelect: (code: string, value: number | null) => void;
}

/** Показывает факторы риска выбранной группы R0, R2 или R7. */
export function LiningFactors({
  catalog,
  selections,
  activeGroup,
  onGroupChange,
  onSelect,
}: LiningFactorsProps) {
  const currentGroup = catalog.groups.find((group) => group.group === activeGroup)
    ?? catalog.groups[0];
  const groupTabs = catalog.groups.map((group) => ({
    id: group.group,
    label: group.group,
  }));

  return (
    <div className={styles.section}>
      <Tabs
        variant="outlined"
        className={styles.tabs}
        activeTab={currentGroup.group}
        onTabChange={onGroupChange}
        tabs={groupTabs}
      />
      <h4 className={styles.title}>
        {currentGroup.group} · {currentGroup.title}
      </h4>
      <div className={styles.factors}>
        {currentGroup.factors.map((factor) => (
          <div
            key={factor.code}
            className={styles.factor}
          >
            <span className={styles.name}>{factor.name}</span>
            <div className={styles.options}>
              {factor.options.map((option) => (
                <Checkbox
                  key={option.label}
                  id={`${factor.code}-${option.value}`}
                  checked={selections[factor.code] === option.value}
                  onChange={() => onSelect(factor.code, option.value)}
                >
                  {option.label}
                </Checkbox>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

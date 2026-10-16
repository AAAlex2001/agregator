import type { HazardCatalog, HazardSelections } from "@/entities/hazard";
import { Checkbox } from "@/shared/ui/checkbox";
import { Tabs } from "@/shared/ui/tabs";
import styles from "./style.module.scss";

/** Справочник, выбор эксперта и открытая группа факторов. */
interface HazardFactorsProps {
  catalog: HazardCatalog;
  selections: HazardSelections;
  excludedGroups: string[];
  activeGroup: string;
  onGroupChange: (group: string) => void;
  onSelect: (code: string, value: number | null) => void;
  onToggleGroup: (group: string) => void;
}

/** Показывает факторы выбранной группы R0–R9 и её включение в отчёт. */
export function HazardFactors({
  catalog,
  selections,
  excludedGroups,
  activeGroup,
  onGroupChange,
  onSelect,
  onToggleGroup,
}: HazardFactorsProps) {
  const currentGroup = catalog.groups.find((group) => group.group === activeGroup)
    ?? catalog.groups[0];
  const groupTabs = catalog.groups.map((group) => ({
    id: group.group,
    label: group.group,
  }));

  return (
    <>
      <Tabs
        variant="outlined"
        className={styles.tabs}
        activeTab={currentGroup.group}
        onTabChange={onGroupChange}
        tabs={groupTabs}
      />
      <div className={styles.header}>
        <h3 className={styles.title}>
          {currentGroup.group} · {currentGroup.title}
        </h3>
        <div className={styles.include}>
          <Checkbox
            id={`include-${currentGroup.group}`}
            checked={!excludedGroups.includes(currentGroup.group)}
            onChange={() => onToggleGroup(currentGroup.group)}
          >
            Включать в отчёт
          </Checkbox>
        </div>
      </div>
      <div className={styles.factors}>
        {currentGroup.factors.map((factor) => (
          <div
            key={factor.code}
            className={styles.factor}
          >
            <div className={styles.info}>
              <span className={styles.name}>{factor.name}</span>
            </div>
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
    </>
  );
}

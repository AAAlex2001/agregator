import styles from "./sections.module.scss";

export interface BadgeOption {
  text: string;
  variant: string;
  bg: string;
  color: string;
  label: string;
}

export const BADGE_OPTIONS: BadgeOption[] = [
  { text: "ТУ", variant: "BLUE", bg: "#E3F2FD", color: "#1565C0", label: "Укажите типовые наименования ТУ" },
  { text: "КЛ", variant: "GRAY", bg: "#F5F5F5", color: "#78909C", label: "Укажите типовые наименования КЛ" },
  { text: "ТП", variant: "ORANGE", bg: "#FFF3E0", color: "#E65100", label: "Укажите типовые наименования ТП" },
  { text: "Д", variant: "BROWN", bg: "#EFEBE9", color: "#6D4C41", label: "Укажите типовые наименования Д" },
  { text: "ЗС", variant: "GREEN", bg: "#E8F5E9", color: "#2E7D32", label: "Укажите типовые наименования ЗС" },
  { text: "ОБ", variant: "PURPLE", bg: "#F3E5F5", color: "#7B1FA2", label: "Укажите типовые наименования ОБ" },
];

interface BadgeSelectorProps {
  selected: string[];
  onToggle: (variant: string) => void;
  typicalNamesMap: Record<string, string>;
  onTypicalNamesChange: (variant: string, value: string) => void;
}

export default function BadgeSelector({
  selected,
  onToggle,
  typicalNamesMap,
  onTypicalNamesChange,
}: BadgeSelectorProps) {
  return (
    <div className={styles.fieldGroup}>
      <span className={styles.fieldLabel}>Выберите объект(-ы) экспертизы</span>
      <div className={styles.badgeRow}>
        {BADGE_OPTIONS.map((badge) => {
          const isSelected = selected.includes(badge.variant);
          return (
            <button
              key={badge.variant}
              type="button"
              className={styles.badgeButton}
              style={{
                background: badge.bg,
                color: badge.color,
                opacity: isSelected ? 1 : 0.4,
              }}
              onClick={() => onToggle(badge.variant)}
            >
              {badge.text}
            </button>
          );
        })}
      </div>
      {BADGE_OPTIONS.filter((b) => selected.includes(b.variant)).map((badge) => (
        <div key={badge.variant} className={styles.typicalNameField}>
          <span className={styles.typicalNameLabel}>{badge.label}</span>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Например: Э4, Э5, ТУ1, Д3"
            value={typicalNamesMap[badge.variant] ?? ""}
            onChange={(e) => onTypicalNamesChange(badge.variant, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

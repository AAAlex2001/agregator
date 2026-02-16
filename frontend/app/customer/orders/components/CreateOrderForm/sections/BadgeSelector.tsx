import styles from "./sections.module.scss";

export interface BadgeOption {
  text: string;
  variant: string;
  bg: string;
  color: string;
}

export const BADGE_OPTIONS: BadgeOption[] = [
  { text: "Э4 ТУ", variant: "BLUE", bg: "#E3F2FD", color: "#1565C0" },
  { text: "Э4 КЛ/ТП", variant: "GRAY", bg: "#F5F5F5", color: "#78909C" },
  { text: "Э4 Д", variant: "ORANGE", bg: "#FFF3E0", color: "#E65100" },
  { text: "Э4 ЗС", variant: "BROWN", bg: "#EFEBE9", color: "#6D4C41" },
  { text: "Э4 ОБ", variant: "GREEN", bg: "#E8F5E9", color: "#2E7D32" },
];

interface BadgeSelectorProps {
  selected: string[];
  onToggle: (variant: string) => void;
}

export default function BadgeSelector({ selected, onToggle }: BadgeSelectorProps) {
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
    </div>
  );
}

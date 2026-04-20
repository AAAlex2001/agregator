import type { BadgeOptionDto } from "../../../api/customer-orders.api";
import base from "./sectionBase.module.scss";
import s from "./badgeSection.module.scss";

interface Props {
  options: readonly BadgeOptionDto[];
  selectedBadgeVariants: string[];
  typicalNamesMap: Record<string, string>;
  onToggleBadge: (variant: string) => void;
  onChangeTypicalNames: (variant: string, value: string) => void;
}

function buildPreview(text: string, input: string) {
  return input
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => `${text} ${name}`);
}

function getColorClass(variant: string) {
  return s[variant.toLowerCase() as keyof typeof s] ?? s.gray;
}

export function BadgeSection({
  options,
  selectedBadgeVariants,
  typicalNamesMap,
  onToggleBadge,
  onChangeTypicalNames,
}: Props) {
  return (
    <section className={base.section}>
      <span className={base.label}>Выберите объект(-ы) экспертизы</span>

      <div className={s.row}>
        {options.map((option) => {
          const active = selectedBadgeVariants.includes(option.variant);

          return (
            <button
              key={option.variant}
              type="button"
              className={`${s.button} ${getColorClass(option.variant)} ${active ? "" : s.inactive}`}
              onClick={() => onToggleBadge(option.variant)}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {options
        .filter((option) => selectedBadgeVariants.includes(option.variant))
        .map((option) => {
          const preview = buildPreview(option.text, typicalNamesMap[option.variant] ?? "");

          return (
            <div key={option.variant} className={s.field}>
              <span className={base.label}>{option.label}</span>
              <input
                type="text"
                className={s.input}
                placeholder="Например: Э14.1, 14.2, 3.1"
                value={typicalNamesMap[option.variant] ?? ""}
                onChange={(event) => onChangeTypicalNames(option.variant, event.target.value.replace(/[^\dA-Za-zА-Яа-яЁё.,\s-]/g, ""))}
              />
              {preview.length > 0 && (
                <div className={s.preview}>
                  {preview.map((item) => (
                    <span key={item} className={`${s.chip} ${getColorClass(option.variant)}`}>
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
    </section>
  );
}
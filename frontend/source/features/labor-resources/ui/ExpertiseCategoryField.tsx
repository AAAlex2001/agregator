import { CATEGORY_OPTIONS } from "@/source/entities/expertise";
import s from "./LaborForm.module.scss";

const OPTIONS = [
  { value: "", label: "Любая категория" },
  ...CATEGORY_OPTIONS.map((category) => ({
    value: category,
    label: `${category} категория`,
  })),
];

interface ExpertiseCategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExpertiseCategoryField({
  value,
  onChange,
}: ExpertiseCategoryFieldProps) {
  return (
    <div className={s.fieldGroup}>
      <span className={s.label}>Категория исполнителя</span>

      <div className={s.categoryRow}>
        {OPTIONS.map((option) => (
          <button
            key={option.value || "any"}
            type="button"
            className={
              value === option.value ? s.categoryActive : ""
            }
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

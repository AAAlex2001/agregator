import {
  CATEGORY_OPTIONS,
  ExpertiseAreasPicker,
} from "@/source/entities/expertise";
import s from "./LaborForm.module.scss";

interface LicenseExpertiseFieldsProps {
  areas: string[];
  category: string;
  onToggleArea: (area: string, checked: boolean) => void;
  onCategoryChange: (category: string) => void;
}

export function LicenseExpertiseFields({
  areas,
  category,
  onToggleArea,
  onCategoryChange,
}: LicenseExpertiseFieldsProps) {
  return (
    <div className={s.fieldGroup}>
      <span className={s.label}>Области аттестации</span>

      <ExpertiseAreasPicker
        value={areas}
        onChange={onToggleArea}
        idPrefix="labor-area"
      />

      <span className={s.label}>Категория эксперта</span>

      <div className={s.categoryRow}>
        {CATEGORY_OPTIONS.map((value) => (
          <button
            key={value}
            type="button"
            className={
              category === value ? s.categoryActive : ""
            }
            onClick={() => onCategoryChange(value)}
          >
            {value} категория
          </button>
        ))}
      </div>
    </div>
  );
}

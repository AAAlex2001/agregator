import {
  AREA_OPTIONS,
  CATEGORY_OPTIONS,
} from "@/source/entities/expertise";
import { Checkbox } from "@/source/shared/ui";
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

      <div className={s.areaGrid}>
        {AREA_OPTIONS.map((option) => (
          <Checkbox
            key={option.value}
            id={`labor-area-${option.value}`}
            checked={areas.includes(option.value)}
            onChange={(checked) =>
              onToggleArea(option.value, checked)
            }
          >
            {option.value}
          </Checkbox>
        ))}
      </div>

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

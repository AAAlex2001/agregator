import { ExpertiseProfileFields, createExpertiseProfileValues } from "@/entities/expertise";
import type { ExpertiseProfileValues } from "@/entities/expertise";
import { DirectionOption } from "../direction-option";

/** Выбранная анкета направления; null означает снятую галочку. */
interface ExpertiseDirectionProps {
  value: ExpertiseProfileValues | null;
  onChange: (value: ExpertiseProfileValues | null) => void;
}

/** Выбирает направление и показывает его анкету при регистрации. */
export function ExpertiseDirection({ value, onChange }: ExpertiseDirectionProps) {
  
  return (
    <DirectionOption
      id="EXPERTISE"
      title="Экспертиза промышленной безопасности"
      description="Удостоверения: область аттестации, объект экспертизы и категория"
      checked={value !== null}
      onToggle={() => onChange(value ? null : createExpertiseProfileValues())}
    >
      {value && (
        <ExpertiseProfileFields
          value={value}
          onChange={onChange}
        />
      )}
    </DirectionOption>
  );
}


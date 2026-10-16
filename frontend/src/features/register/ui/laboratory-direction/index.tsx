import { LaboratoryProfileFields, createLaboratoryProfileValues } from "@/entities/laboratory";
import type { LaboratoryProfileValues } from "@/entities/laboratory";
import { DirectionOption } from "../direction-option";

/** Выбранная анкета направления; null означает снятую галочку. */
interface LaboratoryDirectionProps {
  value: LaboratoryProfileValues | null;
  onChange: (value: LaboratoryProfileValues | null) => void;
}

/** Выбирает направление и показывает его анкету при регистрации. */
export function LaboratoryDirection({ value, onChange }: LaboratoryDirectionProps) {
  
  return (
    <DirectionOption
      id="LABORATORY"
      title="Лабораторные исследования"
      description="Область аккредитации лаборатории и дополнительные сведения"
      checked={value !== null}
      onToggle={() => onChange(value ? null : createLaboratoryProfileValues())}
    >
      {value && (
        <LaboratoryProfileFields
          value={value}
          onChange={onChange}
        />
      )}
    </DirectionOption>
  );
}


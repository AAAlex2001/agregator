import { SroProfileFields, createSroProfileValues } from "@/entities/sro";
import type { SroProfileValues } from "@/entities/sro";
import { DirectionOption } from "../direction-option";

/** Выбранное членство СРО для направления изысканий. */
interface SurveyHolderDirectionProps {
  value: SroProfileValues | null;
  onChange: (value: SroProfileValues | null) => void;
}

/** Показывает права, компенсационный фонд и условия предоставления СРО. */
export function SurveyHolderDirection({ value, onChange }: SurveyHolderDirectionProps) {
  return (
    <DirectionOption
      id="SURVEY"
      title="Инженерные изыскания"
      description="Членство в СРО изыскателей: права, компенсационный фонд и условия предоставления"
      checked={value !== null}
      onToggle={() => onChange(value ? null : createSroProfileValues())}
      note={
        "Выписку из реестра членов СРО приложите в блоке разрешительных документов выше, "
        + "дополнительные документы можно загрузить в личном кабинете."
      }
    >
      {value && (
        <SroProfileFields
          direction="survey"
          value={value}
          onChange={onChange}
        />
      )}
    </DirectionOption>
  );
}


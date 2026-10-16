import {
  ResearchProfileFields,
  createResearchProfileValues,
  useResearchOptions,
} from "@/entities/research";
import type { ResearchProfileValues } from "@/entities/research";
import { DirectionOption } from "../direction-option";

/** Выбранная анкета направления; null означает снятую галочку. */
interface ResearchDirectionProps {
  value: ResearchProfileValues | null;
  onChange: (value: ResearchProfileValues | null) => void;
}

/** Выбирает направление и показывает его анкету при регистрации. */
export function ResearchDirection({ value, onChange }: ResearchDirectionProps) {
  const { options } = useResearchOptions();

  return (
    <DirectionOption
      id="RESEARCH"
      title="Научно-исследовательские работы"
      description="Учёная степень, звание и направление научной деятельности"
      checked={value !== null}
      onToggle={() => onChange(value ? null : createResearchProfileValues())}
    >
      {value && (
        <ResearchProfileFields
          value={value}
          options={options}
          onChange={onChange}
        />
      )}
    </DirectionOption>
  );
}


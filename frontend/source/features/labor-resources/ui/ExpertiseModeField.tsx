import {
  RadioGroup,
  type RadioOption,
} from "@/source/shared/ui";
import type { LaborExpertiseMode } from "../model/types";

const OPTIONS: RadioOption<LaborExpertiseMode>[] = [
  {
    value: "EXACT",
    label: "Нужно конкретное удостоверение",
    description: "Например, Э1 КЛ/ТП",
  },
  {
    value: "GENERAL",
    label: "Подойдёт любой исполнитель этого вида",
    description: "Например, любой исполнитель КЛ",
  },
];

interface ExpertiseModeFieldProps {
  value: LaborExpertiseMode;
  onChange: (value: LaborExpertiseMode) => void;
}

export function ExpertiseModeField({
  value,
  onChange,
}: ExpertiseModeFieldProps) {
  return (
    <RadioGroup
      name="labor-expertise-mode"
      legend="Требования к исполнителю"
      value={value}
      options={OPTIONS}
      onChange={onChange}
    />
  );
}

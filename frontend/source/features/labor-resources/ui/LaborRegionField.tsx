import { TextInput } from "@/source/shared/ui";
import s from "./LaborForm.module.scss";

interface LaborRegionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function LaborRegionField({
  value,
  onChange,
}: LaborRegionFieldProps) {
  return (
    <label className={s.fieldGroup}>
      <span className={s.label}>
        Регион фактического проживания
      </span>
      <TextInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Например, Москва"
      />
    </label>
  );
}

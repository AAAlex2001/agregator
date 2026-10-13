import { useId } from "react";
import { CardInput, Checkbox } from "@/source/shared/ui";
import s from "./OtherProfessionField.module.scss";

interface OtherProfessionFieldProps {
  enabled: boolean;
  text: string;
  onToggle: (enabled: boolean) => void;
  onTextChange: (text: string) => void;
}

export function OtherProfessionField({
  enabled,
  text,
  onToggle,
  onTextChange,
}: OtherProfessionFieldProps) {
  const id = useId();

  return (
    <div className={s.wrap}>
      <Checkbox id={id} checked={enabled} onChange={onToggle} className={s.choice}>
        <span className={s.text}>
          <span className={s.label}>Иная профессия</span>
          <span className={s.description}>Ищу не исполнителя, а другого специалиста — опишу требования сам</span>
        </span>
      </Checkbox>

      {enabled && (
        <CardInput
          className={s.details}
          multiline
          rows={4}
          value={text}
          onChange={onTextChange}
          placeholder="Опишите, кого вы ищете: профессия, обязанности, требования, опыт…"
        />
      )}
    </div>
  );
}

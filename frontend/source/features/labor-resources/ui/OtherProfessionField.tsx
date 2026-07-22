import { CardInput } from "@/source/shared/ui";
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
  return (
    <div className={s.wrap}>
      <button
        type="button"
        className={`${s.plate} ${enabled ? s.plateActive : ""}`}
        aria-pressed={enabled}
        onClick={() => onToggle(!enabled)}
      >
        <span className={s.indicator} aria-hidden="true">
          <span className={s.dot} />
        </span>
        <span className={s.text}>
          <span className={s.label}>Иная профессия</span>
          <span className={s.description}>
            Ищу не эксперта, а другого специалиста — опишу требования сам
          </span>
        </span>
      </button>

      {enabled && (
        <CardInput
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

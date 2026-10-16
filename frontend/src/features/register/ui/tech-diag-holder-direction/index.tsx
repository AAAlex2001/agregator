import { createTechDiagHolderProfile } from "@/entities/tech-diag";
import type { TechDiagHolderProfile } from "@/entities/tech-diag";
import { TextInput } from "@/shared/ui/text-input";
import { DirectionOption } from "../direction-option";

/** Местонахождение лаборатории; виды контроля уточняются в личном кабинете. */
interface TechDiagHolderDirectionProps {
  value: TechDiagHolderProfile | null;
  onChange: (value: TechDiagHolderProfile | null) => void;
}

/** Выбирает направление лаборатории НК и запрашивает город организации. */
export function TechDiagHolderDirection({
  value,
  onChange,
}: TechDiagHolderDirectionProps) {
  return (
    <DirectionOption
      id="TECH_DIAG"
      title="Лаборатория неразрушающего контроля"
      description={
        "Техническое освидетельствование и диагностирование: "
        + "аккредитация лаборатории и виды контроля"
      }
      checked={value !== null}
      onToggle={() => onChange(value ? null : createTechDiagHolderProfile())}
      note={
        "Виды неразрушающего контроля укажете в личном кабинете. "
        + "Лицензию и аккредитацию лаборатории приложите в блоке лицензии выше."
      }
    >
      {value && (
        <TextInput
          id="register-techdiag-city"
          value={value.organization_city}
          onChange={(event) => onChange({
            ...value,
            organization_city: event.target.value,
          })}
          placeholder="Где находится организация — город"
        />
      )}
    </DirectionOption>
  );
}


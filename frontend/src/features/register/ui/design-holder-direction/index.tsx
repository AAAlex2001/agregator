import { SroProfileFields, createSroProfileValues } from "@/entities/sro";
import type { SroProfileValues } from "@/entities/sro";
import { DirectionOption } from "../direction-option";

/** Выбранное членство СРО для направления проектирования. */
interface DesignHolderDirectionProps {
  value: SroProfileValues | null;
  onChange: (value: SroProfileValues | null) => void;
}

/** Показывает права, компенсационный фонд и условия предоставления СРО. */
export function DesignHolderDirection({ value, onChange }: DesignHolderDirectionProps) {
  return (
    <DirectionOption
      id="DESIGN"
      title="Проектирование промышленных и гражданских объектов"
      description={
        "Членство в СРО проектировщиков: права, компенсационный фонд "
        + "и условия предоставления"
      }
      checked={value !== null}
      onToggle={() => onChange(value ? null : createSroProfileValues())}
      note={
        "Выписку из реестра членов СРО приложите в блоке разрешительных документов выше, "
        + "дополнительные документы можно загрузить в личном кабинете."
      }
    >
      {value && (
        <SroProfileFields
          direction="design"
          value={value}
          onChange={onChange}
        />
      )}
    </DirectionOption>
  );
}


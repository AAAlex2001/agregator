import { TypeBadge } from "@/entities/expertise";
import type { ExpertiseType } from "@/entities/expertise";

/** Объект экспертизы и его состояние в фильтре карты. */
interface ExpertiseMapObjectProps {
  object: ExpertiseType;
  isSelected: boolean;
  onToggle: (object: ExpertiseType) => void;
}

/** Показывает объект экспертизы как кнопку фильтра. */
export function ExpertiseMapObject({
  object,
  isSelected,
  onToggle,
}: ExpertiseMapObjectProps) {
  /** Переключает текущий объект экспертизы. */
  function toggleObject() {
    onToggle(object);
  }

  return (
    <TypeBadge
      type={object}
      active={isSelected}
      onClick={toggleObject}
    />
  );
}


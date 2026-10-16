import type { ExpertiseType } from "../../model/types";
import { TypeBadge } from "../type-badge";

/** Объект экспертизы, его выделение и действие выбора. */
interface ExpertiseTypeOptionProps {
  type: ExpertiseType;
  active: boolean;
  onToggle: (type: ExpertiseType) => void;
}

/** Выбирает объект, для которого пользователь отмечает области аттестации. */
export function ExpertiseTypeOption({
  type,
  active,
  onToggle,
}: ExpertiseTypeOptionProps) {
  /** Открывает или закрывает выбор областей этого объекта. */
  function toggle() {
    onToggle(type);
  }

  return (
    <TypeBadge
      type={type}
      active={active}
      onClick={toggle}
    />
  );
}

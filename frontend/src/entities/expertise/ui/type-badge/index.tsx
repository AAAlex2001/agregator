import { Badge } from "@/shared/ui/badge";
import { getExpertiseTypeColor } from "../../model/expertise-type-color";

/** Код объекта экспертизы и состояние его выделения. */
interface TypeBadgeProps {
  type: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

/** Показывает объект экспертизы как подпись или кнопку выбора. */
export function TypeBadge({
  type,
  active,
  disabled,
  onClick,
}: TypeBadgeProps) {
  return (
    <Badge
      color={getExpertiseTypeColor(type) ?? "gray"}
      active={active}
      disabled={disabled}
      onClick={onClick}
    >
      {type}
    </Badge>
  );
}

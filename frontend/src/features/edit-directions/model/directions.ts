import { DIRECTIONS } from "@/entities/direction";
import type { DirectionCode, DirectionOption } from "@/entities/direction";
import type { UserRole } from "@/entities/user";

/** Направления, которые роль заполняет отдельно от простых отметок. */
function getProfileDirections(role: UserRole): DirectionCode[] {
  if (role === "CUSTOMER") {
    return ["AUDIT_SUPB"];
  }

  if (role === "LICENSE_HOLDER") {
    return [
      "EXPERTISE",
      "AUDIT_SUPB",
      "TECH_DIAG",
      "DESIGN",
      "ECOLOGY",
      "SURVEY",
    ];
  }

  return [];
}

/** Возвращает направления, доступные роли для выбора без анкеты. */
export function getDirectionOptions(role: UserRole): DirectionOption[] {
  const profileDirections = getProfileDirections(role);

  return DIRECTIONS.filter(
    (direction) => !profileDirections.includes(direction.value),
  );
}

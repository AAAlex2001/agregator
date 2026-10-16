import { Badge, type BadgeColor } from "@/shared/ui/badge";

/** Область действия лицензии, указанная владельцем. */
interface LicenseAreaBadgeProps {
  area: string;
}

/** Подбирает цвет области действия разрешительного документа. */
function getLicenseAreaColor(area: string): BadgeColor {
  if (area === "КЛ/ТП") {
    return "blue";
  }

  if (area === "ТУ") {
    return "orange";
  }

  if (area === "ЗС") {
    return "green";
  }

  if (area === "Д") {
    return "brown";
  }

  return "gray";
}

/** Выделяет имеющуюся область лицензии в карточке компании. */
export function LicenseAreaBadge({ area }: LicenseAreaBadgeProps) {
  return (
    <Badge
      color={getLicenseAreaColor(area)}
      active
    >
      {area}
    </Badge>
  );
}

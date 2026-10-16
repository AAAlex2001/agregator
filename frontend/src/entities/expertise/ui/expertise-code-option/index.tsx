import { getExpertiseCode } from "../../model/expertise-codes";
import type { ExpertiseType } from "../../model/types";
import { TypeBadge } from "../type-badge";

/** Область и объект экспертизы, образующие один код требований. */
interface ExpertiseCodeOptionProps {
  area: string;
  type: ExpertiseType;
  onSelect: (code: string) => void;
}

/** Подтверждает код выбранного объекта экспертизы. */
export function ExpertiseCodeOption({
  area,
  type,
  onSelect,
}: ExpertiseCodeOptionProps) {
  /** Передаёт допустимый код требований форме поиска. */
  function selectCode() {
    const code = getExpertiseCode(area, type);

    if (code) {
      onSelect(code);
    }
  }

  return (
    <TypeBadge
      type={type}
      onClick={selectCode}
    />
  );
}

import { EXPERTISE_CODE_GROUPS } from "../../config/expertise-codes";
import type { AttestationArea } from "../../model/types";
import { ExpertiseCodeOption } from "../expertise-code-option";
import styles from "./style.module.scss";

/** Область аттестации, место показа описания и действие выбора одного из её кодов. */
interface AttestationAreaDetailsProps {
  area: AttestationArea;
  variant: "popover" | "mobile";
  onSelect: (code: string) => void;
}

/** Показывает описание области и только допустимые для неё объекты экспертизы. */
export function AttestationAreaDetails({
  area,
  variant,
  onSelect,
}: AttestationAreaDetailsProps) {
  const areaNumber = area.value.slice(1);
  const availableGroups = EXPERTISE_CODE_GROUPS.filter(
    (group) => group.areas.includes(areaNumber),
  );
  const titleClassName = variant === "popover" ? styles.popoverTitle : styles.mobileTitle;

  return (
    <>
      <strong className={titleClassName}>{area.value}</strong>
      <span className={styles.name}>{area.name}</span>
      <div className={styles.typeRow}>
        {availableGroups.map((group) => (
          <ExpertiseCodeOption
            key={group.type}
            area={areaNumber}
            type={group.type}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
}

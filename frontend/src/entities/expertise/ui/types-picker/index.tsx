import { EXPERTISE_TYPES } from "../../config/attestation-areas";
import type { ExpertiseType } from "../../model/types";
import { TypeBadge } from "../type-badge";
import styles from "./style.module.scss";

/** Выбранные объекты экспертизы и подписи списка. */
interface TypesPickerProps {
  value: ExpertiseType[];
  onChange: (types: ExpertiseType[]) => void;
  label?: string;
  hint?: string;
  error?: string;
}

/** Выбирает объекты экспертизы, разрешённые лицензией. */
export function TypesPicker({
  value,
  onChange,
  label,
  hint,
  error,
}: TypesPickerProps) {
  function toggle(type: ExpertiseType) {
    const nextTypes = value.includes(type)
      ? value.filter((item) => item !== type)
      : [...value, type];

    onChange(nextTypes);
  }

  return (
    <div className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      {hint && <span className={styles.hint}>{hint}</span>}
      <div className={styles.row}>
        {EXPERTISE_TYPES.map((type) => (
          <TypeBadge
            key={type}
            type={type}
            active={value.includes(type)}
            onClick={() => toggle(type)}
          />
        ))}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

import cn from "classnames";
import { ATTESTATION_AREAS } from "../../config/attestation-areas";
import styles from "./style.module.scss";

/** Выбранный код области аттестации и действие выбора другой области. */
interface AttestationAreaFieldProps {
  value: string;
  onChange: (area: string) => void;
}

/** Предлагает области аттестации в прежнем порядке и с полными подсказками. */
export function AttestationAreaField({
  value,
  onChange,
}: AttestationAreaFieldProps) {
  return (
    <div className={styles.group}>
      <span className={styles.groupLabel}>Область аттестации</span>
      <div className={styles.options}>
        {ATTESTATION_AREAS.map((area) => (
          <button
            key={area.value}
            type="button"
            title={area.name}
            className={cn(
              styles.option,
              { [styles.optionActive]: value === area.value },
            )}
            onClick={() => onChange(area.value)}
          >
            {area.value}
          </button>
        ))}
      </div>
    </div>
  );
}

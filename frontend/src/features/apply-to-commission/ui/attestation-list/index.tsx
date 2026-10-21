import { RemoveButton } from "@/shared/ui/remove-button";
import type { CommissionAttestation } from "../../model/types";
import styles from "./style.module.scss";

/** Добавленные аттестации и их удаление. */
interface AttestationListProps {
  attestations: CommissionAttestation[];
  onRemove: (index: number) => void;
}

/** Аттестации кандидата строками: «Э12 КЛ/ТП · 2 категория». */
export function AttestationList({ attestations, onRemove }: AttestationListProps) {
  return (
    <ul className={styles.list}>
      {attestations.map((item, index) => (
        <li
          key={`${item.area_code}-${item.object_code}-${item.category}`}
          className={styles.item}
        >
          <span className={styles.code}>
            {item.area_code} {item.object_code}
          </span>
          <span className={styles.category}>{item.category} категория</span>
          <RemoveButton
            label={`Убрать ${item.area_code} ${item.object_code}`}
            onClick={() => onRemove(index)}
          />
        </li>
      ))}
    </ul>
  );
}

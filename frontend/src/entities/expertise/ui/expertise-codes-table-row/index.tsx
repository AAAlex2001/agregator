import cn from "classnames";
import { ATTESTATION_AREAS } from "../../config/attestation-areas";
import { getExpertiseCode } from "../../model/expertise-codes";
import styles from "./style.module.scss";

/** Область аттестации, для которой показываем доступные коды экспертизы. */
interface ExpertiseCodesTableRowProps {
  area: string;
}

/** Выводит название области и объединяет общую ячейку КЛ/ТП, когда это допустимо. */
export function ExpertiseCodesTableRow({ area }: ExpertiseCodesTableRowProps) {
  const attestationArea = ATTESTATION_AREAS.find((item) => item.value === `Э${area}`);
  const combinedDocumentCode = getExpertiseCode(area, "КЛ/ТП");

  return (
    <tr>
      <td className={cn(styles.td, styles.tdName)}>{attestationArea?.name}</td>
      {combinedDocumentCode ? (
        <td
          className={styles.td}
          colSpan={2}
        >
          {combinedDocumentCode}
        </td>
      ) : (
        <>
          <td className={styles.td}>{getExpertiseCode(area, "КЛ") ?? "—"}</td>
          <td className={styles.td}>{getExpertiseCode(area, "ТП") ?? "—"}</td>
        </>
      )}
      <td className={styles.td}>{getExpertiseCode(area, "ТУ") ?? "—"}</td>
      <td className={styles.td}>{getExpertiseCode(area, "ЗС") ?? "—"}</td>
      <td className={styles.td}>{getExpertiseCode(area, "Д") ?? "—"}</td>
      <td className={styles.td}>{getExpertiseCode(area, "ОБ") ?? "—"}</td>
    </tr>
  );
}

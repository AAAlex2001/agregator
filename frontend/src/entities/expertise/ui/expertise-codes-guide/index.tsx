"use client";

import { Button } from "@/shared/ui/button";
import { EXPERTISE_TABLE_AREAS } from "../../config/expertise-codes";
import { ExpertiseCodesTableHeader } from "../expertise-codes-table-header";
import { ExpertiseCodesTableRow } from "../expertise-codes-table-row";
import styles from "./style.module.scss";

/** Возврат из справки по областям аттестации в форму заказа. */
interface ExpertiseCodesGuideProps {
  onBack: () => void;
}

/** Показывает соответствие областей аттестации и объектов экспертизы. */
export function ExpertiseCodesGuide({ onBack }: ExpertiseCodesGuideProps) {
  return (
    <div className={styles.view}>
      <h3 className={styles.title}>
        Буквенно-цифровые обозначения областей аттестации исполнителей
        в области промышленной безопасности
      </h3>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <ExpertiseCodesTableHeader />
          <tbody>
            {EXPERTISE_TABLE_AREAS.map((area) => (
              <ExpertiseCodesTableRow
                key={area}
                area={area}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="md"
          onClick={onBack}
        >
          Вернуться к заказу
        </Button>
      </div>
    </div>
  );
}

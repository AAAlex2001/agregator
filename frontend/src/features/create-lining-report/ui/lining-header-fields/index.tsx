import type { LiningReportHeader } from "@/entities/lining";
import { ChatChevronDownIcon } from "@/shared/ui/icons";
import { TextInput } from "@/shared/ui/text-input";
import type { LiningHeaderField } from "../../model/types";
import styles from "./style.module.scss";

/** Шапка PDF и изменение строки, которую заполняет эксперт. */
interface LiningHeaderFieldsProps {
  header: LiningReportHeader;
  onChange: (field: LiningHeaderField, value: string) => void;
}

/** Раскрывающийся блок шапки PDF: автор, объект и обоснование. */
export function LiningHeaderFields({ header, onChange }: LiningHeaderFieldsProps) {
  return (
    <details className={styles.block}>
      <summary className={styles.summary}>
        <span>Шапка отчёта (для PDF)</span>
        <ChatChevronDownIcon className={styles.chevron} />
      </summary>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>Автор</span>
          <TextInput
            value={header.author}
            onChange={(event) => onChange("author", event.target.value)}
            placeholder="ФИО автора"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Объект (строка 2 шапки)</span>
          <TextInput
            value={header.intro_line2}
            onChange={(event) => onChange("intro_line2", event.target.value)}
            placeholder="на руднике / шахте …"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Обоснование</span>
          <textarea
            className={styles.area}
            rows={3}
            value={header.justification}
            onChange={(event) => onChange("justification", event.target.value)}
          />
        </label>
      </div>
    </details>
  );
}

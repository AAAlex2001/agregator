import type { HazardReportHeader } from "@/entities/hazard";
import { ChatChevronDownIcon } from "@/shared/ui/icons";
import { TextInput } from "@/shared/ui/text-input";
import type { HazardHeaderField } from "../../model/types";
import styles from "./style.module.scss";

/** Шапка PDF и изменение строки, которую заполняет эксперт. */
interface HazardHeaderFieldsProps {
  header: HazardReportHeader;
  onChange: (field: HazardHeaderField, value: string) => void;
}

/** Раскрывающийся блок шапки PDF: автор, объект, обоснование и сертификат. */
export function HazardHeaderFields({ header, onChange }: HazardHeaderFieldsProps) {
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
          <span className={styles.label}>Объект</span>
          <TextInput
            value={header.intro_line2}
            onChange={(event) => onChange("intro_line2", event.target.value)}
            placeholder="Введите объект — например, на руднике «Мир» / в шахте «Северная»"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Обоснование</span>
          <textarea
            className={styles.area}
            rows={3}
            value={header.justification}
            onChange={(event) => onChange("justification", event.target.value)}
            placeholder="Опишите обоснование безопасности объекта и проводимых работ"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Сертификат</span>
          <textarea
            className={styles.area}
            rows={2}
            value={header.certificate}
            readOnly
          />
        </label>
      </div>
    </details>
  );
}

import styles from "./style.module.scss";

/** Объединяет заголовки документации и остальных объектов экспертизы. */
export function ExpertiseCodesTableHeader() {
  return (
    <thead>
      <tr>
        <th
          className={styles.th1}
          rowSpan={3}
        >
          Типовые наименования опасных производственных объектов
        </th>
        <th
          className={styles.th1}
          colSpan={6}
        >
          Объект экспертизы промышленной безопасности
        </th>
      </tr>
      <tr>
        <th
          className={styles.th2}
          colSpan={2}
        >
          Документация (КЛ/ТП)
        </th>
        <th
          className={styles.th2}
          rowSpan={2}
        >
          Технические устройства (ТУ)
        </th>
        <th
          className={styles.th2}
          rowSpan={2}
        >
          Здания и сооружения (ЗС)
        </th>
        <th
          className={styles.th2}
          rowSpan={2}
        >
          Декларация (Д)
        </th>
        <th
          className={styles.th2}
          rowSpan={2}
        >
          Обоснование (ОБ)
        </th>
      </tr>
      <tr>
        <th className={styles.th3}>КЛ</th>
        <th className={styles.th3}>ТП</th>
      </tr>
    </thead>
  );
}

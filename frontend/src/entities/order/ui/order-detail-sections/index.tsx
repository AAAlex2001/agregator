import classNames from "classnames";
import type { OrderDetailRow, OrderDetailSection } from "../../model/types";
import styles from "./style.module.scss";

/** Разделы с уже выбранными и подписанными полями конкретного направления. */
interface OrderDetailSectionsProps {
  sections: OrderDetailSection[];
}

/** Не скрывает нулевые значения и отрицательные ответы на вопросы. */
function hasValue(row: OrderDetailRow): boolean {
  return row.value !== null && row.value !== undefined && row.value !== "";
}

/** Показывает заполненные строки, сохраняя общий вид условий всех направлений. */
export function OrderDetailSections({ sections }: OrderDetailSectionsProps) {
  const visibleSections = sections
    .map((section) => ({
      title: section.title,
      rows: section.rows.filter(hasValue),
    }))
    .filter((section) => section.rows.length > 0);

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <div className={styles.block}>
      <span className={styles.heading}>Поля направления</span>
      {visibleSections.map((section) => (
        <div
          key={section.title}
          className={styles.group}
        >
          <span className={styles.groupTitle}>{section.title}</span>
          <dl className={styles.grid}>
            {section.rows.map((row) => (
              <div
                key={row.label}
                className={classNames(styles.cell, {
                  [styles.cellWide]: row.wide,
                })}
              >
                <dt className={styles.label}>{row.label}</dt>
                <dd className={styles.value}>
                  {typeof row.value === "boolean"
                    ? row.value ? "Да" : "Нет"
                    : row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

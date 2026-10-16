import type { DocumentTableBlock } from "../../model/types";
import styles from "./style.module.scss";

/** Данные таблицы, отображаемые строками на компьютере и колонками на телефоне. */
interface DocumentTableProps {
  table: DocumentTableBlock;
}

/** Сохраняет настольное и мобильное представление таблиц документа. */
export function DocumentTable({ table }: DocumentTableProps) {
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={index}
                className={styles.th}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <td
                  key={columnIndex}
                  className={styles.td}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.tableMobile}>
        {table.headers.map((header, columnIndex) => {
          const values = [...new Set(table.rows.map((row) => row[columnIndex]))];

          return (
            <div key={columnIndex}>
              <div className={styles.mHead}>{header}</div>
              {values.map((value, index) => (
                <div
                  key={index}
                  className={index % 2 === 0 ? styles.mCellAlt : styles.mCell}
                >
                  {value}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

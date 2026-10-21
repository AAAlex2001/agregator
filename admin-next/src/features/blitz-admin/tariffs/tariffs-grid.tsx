"use client";

import type { BlitzCatalog } from "@/entities/blitz-order";
import Input from "@/shared/ui/input";
import { tariffKey } from "./use-blitz-tariffs";
import styles from "./style.module.scss";

type TariffsGridProps = {
  catalog: BlitzCatalog;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

/** Таблица «область × объект»: цена в рублях, пустая ячейка — «по запросу», недоступная пара — «н/д». */
export function TariffsGrid({ catalog, values, onChange }: TariffsGridProps) {
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.area}>Область</th>
            {catalog.objects.map((object) => (
              <th key={object.code} title={object.title}>
                {object.code}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {catalog.areas.map((area) => (
            <tr key={area.code}>
              <th className={styles.area} title={area.title}>
                {area.code}
              </th>
              {catalog.objects.map((object) => (
                <td key={object.code}>
                  {area.objects.includes(object.code) ? (
                    <Input
                      size="sm"
                      value={values[tariffKey(area.code, object.code)] ?? ""}
                      placeholder="—"
                      ariaLabel={`${area.code} ${object.code}`}
                      onChange={(value) => onChange(tariffKey(area.code, object.code), value)}
                    />
                  ) : (
                    <span className={styles.missing}>н/д</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

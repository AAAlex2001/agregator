"use client";

import Button from "@/source/shared/ui/Button";
import { TABLE } from "@/source/entities/expertise";
import s from "./ExpertiseCodesModal.module.scss";

interface Props {
  onBack: () => void;
}

const DASH = "—";

export function ExpertiseCodesView({ onBack }: Props) {
  return (
    <div className={s.view}>
      <h3 className={s.title}>
        Буквенно-цифровые обозначения областей аттестации исполнителей в области промышленной безопасности
      </h3>

      <div className={s.scroll}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.th1} rowSpan={3}>
                Типовые наименования опасных производственных объектов
              </th>
              <th className={s.th1} colSpan={6}>
                Объект экспертизы промышленной безопасности
              </th>
            </tr>
            <tr>
              <th className={s.th2} colSpan={2}>Документация (КЛ/ТП)</th>
              <th className={s.th2} rowSpan={2}>Технические устройства (ТУ)</th>
              <th className={s.th2} rowSpan={2}>Здания и сооружения (ЗС)</th>
              <th className={s.th2} rowSpan={2}>Декларация (Д)</th>
              <th className={s.th2} rowSpan={2}>Обоснование (ОБ)</th>
            </tr>
            <tr>
              <th className={s.th3}>КЛ</th>
              <th className={s.th3}>ТП</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(TABLE).map(([code, row]) => {
              const docCodes = row["КЛ/ТП"] ?? [];
              return (
                <tr key={code}>
                  <td className={`${s.td} ${s.tdName}`}>{row.name}</td>
                  {docCodes.length === 2 ? (
                    <>
                      <td className={s.td}>{docCodes[0]}</td>
                      <td className={s.td}>{docCodes[1]}</td>
                    </>
                  ) : (
                    <td className={s.td} colSpan={2}>{docCodes[0] ?? DASH}</td>
                  )}
                  <td className={s.td}>{row["ТУ"]?.[0] ?? DASH}</td>
                  <td className={s.td}>{row["ЗС"]?.[0] ?? DASH}</td>
                  <td className={s.td}>{row["Д"]?.[0] ?? DASH}</td>
                  <td className={s.td}>{row["ОБ"]?.[0] ?? DASH}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={s.actions}>
        <Button variant="primary" size="md" onClick={onBack}>
          Вернуться к заказу
        </Button>
      </div>
    </div>
  );
}

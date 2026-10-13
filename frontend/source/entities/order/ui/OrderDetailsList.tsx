import cn from "classnames";
import { formatOrderDetailValue, orderDetailGroups } from "../model/detailsFields";
import type { OrderWorkType } from "../model/workTypes";
import s from "./OrderDetailsList.module.scss";

interface OrderDetailsListProps {
  workType: OrderWorkType;
  details: object | null;
}

export function OrderDetailsList({ workType, details }: OrderDetailsListProps) {
  if (!details) return null;
  const values = details as Record<string, unknown>;
  const groups = orderDetailGroups(workType)
    .map((group) => ({
      title: group.title,
      rows: group.fields
        .map((field) => ({ ...field, value: formatOrderDetailValue(field, values[field.key]) }))
        .filter((row) => row.value),
    }))
    .filter((group) => group.rows.length > 0);
  if (groups.length === 0) return null;

  return (
    <div className={s.block}>
      <span className={s.heading}>Поля направления</span>
      {groups.map((group) => (
        <div key={group.title} className={s.group}>
          <span className={s.groupTitle}>{group.title}</span>
          <dl className={s.grid}>
            {group.rows.map((row) => (
              <div key={row.key} className={cn(s.cell, { [s.cellWide]: row.wide })}>
                <dt className={s.label}>{row.label}</dt>
                <dd className={s.value}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

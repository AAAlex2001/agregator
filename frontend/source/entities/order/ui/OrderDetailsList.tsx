import { formatOrderDetailValue, orderDetailsFields } from "../model/detailsFields";
import type { OrderWorkType } from "../model/workTypes";
import s from "./OrderDetailsList.module.scss";

interface Props {
  workType: OrderWorkType;
  details: object | null | undefined;
  heading?: string;
}

export function OrderDetailsList({ workType, details, heading = "Поля направления" }: Props) {
  if (!details) return null;

  const data = new Map<string, unknown>(Object.entries(details));
  const rows = orderDetailsFields(workType)
    .map((field) => ({ label: field.label, value: formatOrderDetailValue(field, data.get(field.key)) }))
    .filter((row) => row.value !== "");

  if (!rows.length) return null;

  return (
    <div className={s.block}>
      <span className={s.heading}>{heading}</span>
      <dl className={s.list}>
        {rows.map((row) => (
          <div key={row.label} className={s.row}>
            <dt className={s.label}>{row.label}</dt>
            <dd className={s.value}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

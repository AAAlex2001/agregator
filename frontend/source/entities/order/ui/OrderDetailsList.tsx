import { formatOrderDetailValue, orderDetailsFields } from "../model/detailsFields";
import type { OrderWorkType } from "../model/workTypes";
import s from "./OrderDetailsList.module.scss";

interface Props {
  workType: OrderWorkType;
  details: object | null | undefined;
  heading?: string;
}

interface DetailRow {
  label: string;
  value: string;
  wide: boolean;
}

interface DetailGroup {
  title: string;
  rows: DetailRow[];
}

function buildGroups(workType: OrderWorkType, details: object): DetailGroup[] {
  const data = new Map<string, unknown>(Object.entries(details));
  const groups: DetailGroup[] = [];

  for (const field of orderDetailsFields(workType)) {
    const value = formatOrderDetailValue(field, data.get(field.key));
    if (value === "") continue;

    const title = field.group ?? "";
    let current = groups.length > 0 ? groups[groups.length - 1] : null;
    if (!current || current.title !== title) {
      current = { title, rows: [] };
      groups.push(current);
    }
    current.rows.push({ label: field.label, value, wide: field.wide ?? false });
  }

  return groups;
}

export function OrderDetailsList({ workType, details, heading = "Поля направления" }: Props) {
  if (!details) return null;

  const groups = buildGroups(workType, details);
  if (!groups.length) return null;

  return (
    <div className={s.block}>
      <span className={s.heading}>{heading}</span>

      {groups.map((group, index) => (
        <div key={`${group.title}-${index}`} className={s.group}>
          {group.title && <span className={s.groupTitle}>{group.title}</span>}
          <dl className={s.grid}>
            {group.rows.map((row) => (
              <div key={row.label} className={row.wide ? `${s.cell} ${s.cellWide}` : s.cell}>
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

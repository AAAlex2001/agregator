import s from "./OrderCardBottom.module.scss";

interface Props {
  customer: string;
  customerInn?: string | null;
}

export function OrderOrganizer({ customer, customerInn }: Props) {
  return (
    <div className={s.bottom}>
      <span className={s.label}>Организатор</span>
      <span className={s.value}>{customer || "—"}</span>
      {customerInn && <span className={s.inn}>ИНН {customerInn}</span>}
    </div>
  );
}

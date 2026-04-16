import type { Badge } from "../model/types";
import s from "./OrderCard.module.scss";

interface Props {
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  sum: string;
  responsesDeadline?: string | null;
  onClick?: () => void;
  children?: React.ReactNode;
}

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function OrderCard({ badges, title, customer, date, sum, responsesDeadline, onClick, children }: Props) {
  const expired = responsesDeadline ? new Date(responsesDeadline) <= new Date() : false;

  return (
    <article className={s.card} onClick={onClick}>
      <div className={s.content}>
        <div className={s.badges}>
          {badges.map((b, i) => (
            <span key={i} className={`${s.badge} ${s[b.variant]}`}>{b.text}</span>
          ))}
        </div>
        <div className={s.info}>
          <p className={s.title}>{title}</p>
          <p className={s.customer}>{customer}</p>
        </div>
      </div>
      <div className={s.bottom}>
        <span className={s.date}>{date}</span>
        <span className={s.sum}>{sum}</span>
      </div>
      {responsesDeadline && (
        <span className={expired ? s.deadlineExpired : s.deadlineActive}>
          Отклики до: {formatDeadline(responsesDeadline)}
        </span>
      )}
      {children && <div className={s.actions}>{children}</div>}
    </article>
  );
}

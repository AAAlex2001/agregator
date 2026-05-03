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
  archived?: boolean;
  executor?: string;
}

function formatResponsesDeadline(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderCard({
  badges,
  title,
  customer,
  date,
  sum,
  responsesDeadline,
  onClick,
  children,
  archived,
  executor,
}: Props) {
  return (
    <article className={s.card} onClick={onClick}>
      {archived && <span className={s.archivedBadge}>Архив</span>}

      <div className={s.badges}>
        {badges.map((badge, index) => (
          <span key={index} className={`${s.badge} ${s[badge.variant]}`}>
            {badge.text}
          </span>
        ))}
      </div>

      <p className={s.title}>{title}</p>

      <ul className={s.meta}>
        <li>
          <span className={s.label}>Компания:</span>
          <span className={s.value}>{customer || "—"}</span>
        </li>
        {executor !== undefined && (
          <li>
            <span className={s.label}>Исполнитель:</span>
            <span className={s.value}>{executor || "—"}</span>
          </li>
        )}
        <li>
          <span className={s.label}>Срок выполнения:</span>
          <span className={s.value}>{date}</span>
        </li>
        {!archived && (
          <li>
            <span className={s.label}>Срок истечения приёма откликов:</span>
            <span className={s.value}>
              {responsesDeadline ? formatResponsesDeadline(responsesDeadline) : "—"}
            </span>
          </li>
        )}
        <li>
          <span className={s.label}>Сумма:</span>
          <span className={s.value}>{sum}</span>
        </li>
      </ul>

      {children && <div className={s.actions}>{children}</div>}
    </article>
  );
}

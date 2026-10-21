import Link from "next/link";
import { formatRelative } from "@/shared/lib/format-date";
import { formatRub } from "@/shared/lib/format-rub";
import { BLITZ_DEADLINE_LABELS } from "../../config/labels";
import type { BlitzOrderSummary } from "../../model/types";
import { BlitzStatusBadge } from "../blitz-status-badge";
import styles from "./style.module.scss";

/** Заявка в списке и кто смотрит. */
interface BlitzOrderCardProps {
  order: BlitzOrderSummary;
  isExpert: boolean;
}

/** Номер, статус, документация, коды, срок, цена и время обновления. */
export function BlitzOrderCard({ order, isExpert }: BlitzOrderCardProps) {
  const codes = [order.area_code, order.object_code].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/blitz/orders/${order.id}`}
      className={styles.card}
    >
      <div className={styles.head}>
        <span className={styles.number}>Заявка №{order.id}</span>
        <BlitzStatusBadge
          status={order.status}
          isExpert={isExpert}
        />
      </div>
      <span className={styles.title}>{order.object_name}</span>
      <div className={styles.meta}>
        <span>{codes || "Область уточнит эксперт"}</span>
        <span>Срок: {BLITZ_DEADLINE_LABELS[order.deadline]}</span>
        {order.expert_name && <span>Эксперт: {order.expert_name}</span>}
      </div>
      <div className={styles.foot}>
        <span className={styles.price}>{formatRub(order.price)}</span>
        <span className={styles.date}>{formatRelative(order.updated_at)}</span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { formatRelative } from "@/shared/lib/format-date";
import { BLITZ_DEADLINE_LABELS } from "../../config/labels";
import { blitzPriceLabel } from "../../model/price";
import { blitzOrderPath, blitzWording } from "../../model/status";
import type { BlitzOrderSummary } from "../../model/types";
import { BlitzStatusBadge } from "../blitz-status-badge";
import styles from "./style.module.scss";

/** Заявка в списке и кто смотрит. */
interface BlitzOrderCardProps {
  order: BlitzOrderSummary;
  isExpert: boolean;
}

/** Строка о предмете: коды экспертизы или сервис аудита. */
function subjectLine(order: BlitzOrderSummary): string {
  if (order.service === "audit") {
    return "Аудит СУПБ";
  }

  const codes = [order.area_code, order.object_code].filter(Boolean).join(" · ");

  return codes || "Область уточнит эксперт";
}

/** Номер, статус, предмет, срок, исполнитель, цена и время обновления. */
export function BlitzOrderCard({ order, isExpert }: BlitzOrderCardProps) {
  const isAudit = order.service === "audit";

  return (
    <Link
      href={blitzOrderPath(order.service, order.id)}
      className={styles.card}
    >
      <div className={styles.head}>
        <span className={styles.number}>Заявка №{order.id}</span>
        <BlitzStatusBadge
          status={order.status}
          service={order.service}
          isExpert={isExpert}
        />
      </div>
      <span className={styles.title}>{order.object_name}</span>
      <div className={styles.meta}>
        <span>{subjectLine(order)}</span>
        {!isAudit && <span>Срок: {BLITZ_DEADLINE_LABELS[order.deadline]}</span>}
        {order.expert_name && (
          <span>
            {blitzWording(order.service).executor}: {order.expert_name}
          </span>
        )}
      </div>
      <div className={styles.foot}>
        <span className={styles.price}>{blitzPriceLabel(order.price)}</span>
        <span className={styles.date}>{formatRelative(order.updated_at)}</span>
      </div>
    </Link>
  );
}

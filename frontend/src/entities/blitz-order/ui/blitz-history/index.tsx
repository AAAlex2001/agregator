import { formatWithTime } from "@/shared/lib/format-date";
import { BLITZ_ACTOR_LABELS } from "../../config/labels";
import { blitzStatusLabel } from "../../model/status";
import type { BlitzService, BlitzStatusChange } from "../../model/types";
import styles from "./style.module.scss";

/** Шаги истории, сервис и кто смотрит. */
interface BlitzHistoryProps {
  history: BlitzStatusChange[];
  service: BlitzService;
  isExpert: boolean;
}

/** История статусов: новые сверху, с тем, кто перевёл, и пояснением. */
export function BlitzHistory({ history, service, isExpert }: BlitzHistoryProps) {
  const newestFirst = [...history].reverse();

  return (
    <ol className={styles.history}>
      {newestFirst.map((change) => (
        <li
          key={`${change.status}-${change.created_at}`}
          className={styles.item}
        >
          <span className={styles.status}>
            {blitzStatusLabel(change.status, isExpert, service)}
          </span>
          <span className={styles.meta}>
            {BLITZ_ACTOR_LABELS[change.actor]} · {formatWithTime(change.created_at)}
          </span>
          {change.note && <span className={styles.note}>{change.note}</span>}
        </li>
      ))}
    </ol>
  );
}

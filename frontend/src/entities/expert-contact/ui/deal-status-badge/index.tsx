import classNames from "classnames";
import { CONTACT_DEAL_STATUSES } from "../../config/deal-statuses";
import type { ContactDealParty, ContactDealStatus } from "../../model/types";
import styles from "./style.module.scss";

/** Этап сделки и сторона, для которой подбирается подпись. */
interface DealStatusBadgeProps {
  status: ContactDealStatus;
  party: ContactDealParty | null;
}

/** Показывает цветную подпись этапа сделки с точки зрения её участника. */
export function DealStatusBadge({ status, party }: DealStatusBadgeProps) {
  const option = CONTACT_DEAL_STATUSES[status];

  return (
    <span className={classNames(styles.badge, styles[option.tone])}>
      {option[party ?? "DEFAULT"]}
    </span>
  );
}

import { DEAL_STATUS_LABELS, DEAL_STATUS_TONES, type DealListItem } from "@/entities/contact-deal";
import { contactDealPath } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import { countLabel } from "@/shared/lib/text";
import Badge from "@/shared/ui/badge";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import styles from "./style.module.scss";

type DealsTableProps = {
  deals: DealListItem[];
};

/** Список сделок по покупке контактов. Строка ведёт на карточку сделки. */
const DealsTable = ({ deals }: DealsTableProps) => (
  <List>
    {deals.map((deal) => (
      <ListRow key={deal.id} href={contactDealPath(deal.id)}>
        <span className={styles.number}>#{deal.public_id.slice(0, 8).toUpperCase()}</span>

        <span className={styles.parties}>
          <span className={styles.party}>{deal.seller_name}</span>
          <span className={styles.meta}>покупатель: {deal.buyer_name}</span>
        </span>

        <span className={styles.price}>{formatRub(deal.price_rubles)}</span>

        <span className={styles.status}>
          <Badge tone={DEAL_STATUS_TONES[deal.status]}>{DEAL_STATUS_LABELS[deal.status]}</Badge>
        </span>

        <span className={styles.details}>
          <span>{countLabel(deal.receipt_count, ["чек", "чека", "чеков"])}</span>
          <span className={styles.meta}>{formatDateTime(deal.updated_at)}</span>
        </span>
      </ListRow>
    ))}
  </List>
);

export default DealsTable;

import { rtnPath } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import {
  CLARIFICATION_STATUS_LABELS,
  CLARIFICATION_STATUS_TONES,
  DOCUMENT_TYPE_LABELS,
  PUBLICATION_STATUS_LABELS,
  PUBLICATION_STATUS_TONES,
  type ClarificationListItem,
} from "../../model/types";
import styles from "./style.module.scss";

type ClarificationsTableProps = {
  clarifications: ClarificationListItem[];
};

/** Список разъяснений. Строка целиком ведёт на редактирование. */
const ClarificationsTable = ({ clarifications }: ClarificationsTableProps) => (
  <List>
    {clarifications.map((item) => (
      <ListRow key={item.id} href={rtnPath(item.id)}>
        <span className={styles.id}>#{item.id}</span>

        <span className={styles.info}>
          <span className={styles.title}>{item.title || "(без заголовка)"}</span>
          <span className={styles.meta}>
            {DOCUMENT_TYPE_LABELS[item.document_type]}
            {item.letter_number && ` · ${item.letter_number}`}
          </span>
        </span>

        <span className={styles.badges}>
          <Badge tone={CLARIFICATION_STATUS_TONES[item.status]}>{CLARIFICATION_STATUS_LABELS[item.status]}</Badge>
          <Badge tone={PUBLICATION_STATUS_TONES[item.publication_status]}>
            {PUBLICATION_STATUS_LABELS[item.publication_status]}
          </Badge>
        </span>

        <span className={styles.date}>{formatDateTime(item.updated_at)}</span>
      </ListRow>
    ))}
  </List>
);

export default ClarificationsTable;

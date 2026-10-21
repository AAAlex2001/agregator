import { formatDateTime } from "@/shared/lib/date";
import { formatFileSize } from "@/shared/lib/money";
import Panel from "@/shared/ui/panel";
import { blitzDocumentUrl } from "../../api/blitz";
import { BLITZ_DOCUMENT_LABELS, type BlitzOrder } from "../../model/types";
import styles from "./style.module.scss";

type OrderDocumentsProps = {
  order: BlitzOrder;
};

/** Все файлы заявки: документация, договор, замечания, заключение и платёжки. */
const OrderDocuments = ({ order }: OrderDocumentsProps) => (
  <Panel title={`Файлы (${order.documents.length})`}>
    <ul className={styles.list}>
      {order.documents.map((document) => (
        <li key={document.id} className={styles.file}>
          <a className={styles.name} href={blitzDocumentUrl(order.id, document.id)}>
            {document.name}
          </a>
          <span className={styles.meta}>
            {BLITZ_DOCUMENT_LABELS[document.kind] ?? document.kind} · {formatFileSize(document.size)} ·{" "}
            {formatDateTime(document.created_at)}
          </span>
        </li>
      ))}
    </ul>
  </Panel>
);

export default OrderDocuments;

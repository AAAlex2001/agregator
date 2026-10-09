import { RECEIPT_STATUS_LABELS, RECEIPT_STATUS_TONES, type DealReceipt } from "@/entities/contact-deal";
import { formatDateTime } from "@/shared/lib/date";
import { formatFileSize } from "@/shared/lib/money";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import { ExternalLinkIcon } from "@/shared/ui/icons";
import Message from "@/shared/ui/message";
import Panel from "@/shared/ui/panel";
import { receiptUrl } from "../../api/deals";
import styles from "./style.module.scss";

type DealReceiptsProps = {
  dealId: number;
  receipts: DealReceipt[];
};

/** Чеки об оплате: статус проверки, размер, хэш и кнопка открыть файл. */
const DealReceipts = ({ dealId, receipts }: DealReceiptsProps) => (
  <Panel title="Чеки об оплате">
    {receipts.length === 0 ? (
      <Message>Покупатель ещё не прикладывал чеки.</Message>
    ) : (
      <ul className={styles.list}>
        {receipts.map((receipt) => (
          <li key={receipt.id} className={styles.item}>
            <div className={styles.info}>
              <span className={styles.name}>{receipt.original_name}</span>
              <span className={styles.meta}>
                {formatFileSize(receipt.size_bytes)} · {formatDateTime(receipt.created_at)} · SHA-256 {receipt.sha256.slice(0, 16)}…
              </span>
              {receipt.rejection_reason && <span className={styles.reason}>Причина отклонения: {receipt.rejection_reason}</span>}
            </div>

            <Badge tone={RECEIPT_STATUS_TONES[receipt.status]}>{RECEIPT_STATUS_LABELS[receipt.status]}</Badge>

            <Button variant="outline" size="sm" href={receiptUrl(dealId, receipt.id)} target="_blank">
              <ExternalLinkIcon />
              Открыть
            </Button>
          </li>
        ))}
      </ul>
    )}
  </Panel>
);

export default DealReceipts;

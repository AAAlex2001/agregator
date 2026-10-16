import { Button } from "@/shared/ui/button";
import { FileIcon } from "@/shared/ui/icons";
import { Title } from "@/shared/ui/title";
import { CONTACT_RECEIPT_STATUSES } from "../../config/deal-statuses";
import type { ContactReceipt } from "../../model/types";
import styles from "./style.module.scss";

/** Чеки, приложенные покупателем к сделке. */
interface DealReceiptsProps {
  receipts: ContactReceipt[];
}

/** Показывает ссылки на загруженные чеки и результат их проверки. */
export function DealReceipts({ receipts }: DealReceiptsProps) {
  return (
    <section
      className={styles.receipts}
      aria-label="Загруженные чеки"
    >
      <Title
        text="Загруженные чеки"
        as="h3"
        className={styles.title}
      />
      <div className={styles.list}>
        {receipts.map((receipt, index) => (
          <div
            key={receipt.id}
            className={styles.item}
          >
            <Button
              href={receipt.download_url}
              target="_blank"
              rel="noreferrer"
              variant="outlineOrange"
              size="sm"
            >
              <FileIcon /> Скачать чек {index + 1}
            </Button>
            <span>{CONTACT_RECEIPT_STATUSES[receipt.status]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

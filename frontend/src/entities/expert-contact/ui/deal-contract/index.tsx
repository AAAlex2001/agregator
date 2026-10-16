import { Title } from "@/shared/ui/title";
import type { ContactContract } from "../../model/types";
import styles from "./style.module.scss";

/** Текст договора и отпечаток версии, которую подписывают стороны. */
interface DealContractProps {
  contract: ContactContract;
  documentHash: string;
}

/** Показывает договор на листе: условия, реквизиты сторон и SHA-256 документа. */
export function DealContract({ contract, documentHash }: DealContractProps) {
  return (
    <div className={styles.scrollArea}>
      <article className={styles.paper}>
        <div className={styles.documentHead}>
          <strong>{contract.title}</strong>
          <span>№ {contract.number} от {contract.date}</span>
        </div>
        <p className={styles.preamble}>{contract.preamble}</p>
        <ol className={styles.clauses}>
          {contract.clauses.map((clause) => (
            <li key={clause}>{clause}</li>
          ))}
        </ol>
        <Title
          text="Реквизиты сторон"
          as="h3"
          className={styles.requisitesTitle}
        />
        <div className={styles.requisites}>
          <section>
            <Title
              text="Продавец"
              as="h3"
              className={styles.partyTitle}
            />
            {Object.entries(contract.seller_requisites).map(([label, value]) => (
              <p key={label}>
                <span>{label}:</span> {value}
              </p>
            ))}
          </section>
          <section>
            <Title
              text="Покупатель"
              as="h3"
              className={styles.partyTitle}
            />
            {Object.entries(contract.buyer_requisites).map(([label, value]) => (
              <p key={label}>
                <span>{label}:</span> {value}
              </p>
            ))}
          </section>
        </div>
        <p className={styles.documentHash}>SHA-256 документа: {documentHash}</p>
      </article>
    </div>
  );
}

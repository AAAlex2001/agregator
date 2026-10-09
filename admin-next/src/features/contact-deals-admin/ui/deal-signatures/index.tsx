import { PARTY_LABELS, SIGNATURE_METHOD_LABELS, type DealSignature } from "@/entities/contact-deal";
import { formatDateTime } from "@/shared/lib/date";
import Message from "@/shared/ui/message";
import Panel from "@/shared/ui/panel";
import styles from "./style.module.scss";

type DealSignaturesProps = {
  signatures: DealSignature[];
};

/** Лист простых электронных подписей: кто, как и когда подписал. */
const DealSignatures = ({ signatures }: DealSignaturesProps) => (
  <Panel title="Подписи">
    {signatures.length === 0 ? (
      <Message>Договор ещё никто не подписал.</Message>
    ) : (
      <ul className={styles.list}>
        {signatures.map((signature) => (
          <li key={`${signature.party}-${signature.signed_at}`} className={styles.item}>
            <span className={styles.party}>{PARTY_LABELS[signature.party]}</span>
            <span className={styles.signer}>{signature.signer_name}</span>
            <span className={styles.meta}>
              {SIGNATURE_METHOD_LABELS[signature.method]} · {formatDateTime(signature.signed_at)}
            </span>
          </li>
        ))}
      </ul>
    )}
  </Panel>
);

export default DealSignatures;

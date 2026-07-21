import type { ContactContractData } from "@/source/entities/expert-contact";
import { Title } from "@/source/shared/ui";
import s from "./ContactContract.module.scss";

interface ContactContractProps {
  contract: ContactContractData;
  documentHash: string;
}

export function ContactContract({ contract, documentHash }: ContactContractProps) {
  return (
    <div className={s.scrollArea}>
      <article className={s.paper}>
        <div className={s.documentHead}>
          <strong>{contract.title}</strong>
          <span>№ {contract.number} от {contract.date}</span>
        </div>
        <p className={s.preamble}>{contract.preamble}</p>
        <ol className={s.clauses}>
          {contract.clauses.map((clause, index) => <li key={index}>{clause}</li>)}
        </ol>
        <Title text="Реквизиты сторон" as="h3" className={s.requisitesTitle} />
        <div className={s.requisites}>
          <PartyRequisites title="Продавец" values={contract.seller_requisites} />
          <PartyRequisites title="Покупатель" values={contract.buyer_requisites} />
        </div>
        <p className={s.documentHash}>SHA-256 документа: {documentHash}</p>
      </article>
    </div>
  );
}

function PartyRequisites({ title, values }: { title: string; values: Record<string, string> }) {
  return (
    <section>
      <Title text={title} as="h3" className={s.partyTitle} />
      {Object.entries(values).map(([label, value]) => (
        <p key={label}><span>{label}:</span> {value}</p>
      ))}
    </section>
  );
}

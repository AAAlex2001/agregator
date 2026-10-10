import Panel from "@/shared/ui/panel";
import type { DealContract } from "../../model/types";
import styles from "./style.module.scss";

type DealContractProps = {
  contract: DealContract;
};

/** Реквизиты стороны строками: из словаря «подпись: значение» или готового текста. */
const requisiteLines = (requisites: Record<string, string> | string): string[] =>
  typeof requisites === "string"
    ? requisites.split("\n").filter(Boolean)
    : Object.entries(requisites)
        .filter(([, value]) => value)
        .map(([label, value]) => `${label}: ${value}`);

/** Текст договора: преамбула, пункты и реквизиты сторон. */
const DealContractPanel = ({ contract }: DealContractProps) => (
  <Panel title={`${contract.title} № ${contract.number} от ${contract.date}`}>
    <p className={styles.preamble}>{contract.preamble}</p>

    <ol className={styles.clauses}>
      {contract.clauses.map((clause, index) => (
        <li key={index}>{clause}</li>
      ))}
    </ol>

    <div className={styles.requisites}>
      {[
        ["Продавец", contract.seller_requisites],
        ["Покупатель", contract.buyer_requisites],
      ].map(([title, requisites]) => (
        <div key={title as string} className={styles.party}>
          <span className={styles.partyTitle}>{title as string}</span>
          {requisiteLines(requisites as Record<string, string> | string).map((line) => (
            <span key={line} className={styles.line}>
              {line}
            </span>
          ))}
        </div>
      ))}
    </div>
  </Panel>
);

export default DealContractPanel;

"use client";

import { useState } from "react";
import { Button } from "@/app/components";
import styles from "./sections.module.scss";

const GUARANTEES = [
  "При выборе вашей кандидатуры спишется только 5% от вашей цены, остаток вернётся на счёт",
  "При отклонении заказчиком вашей кандидатуры средства возвращаются в полном объёме",
  "Все возвраты выполняются автоматически в течение 1-10 рабочих дней",
];

interface CommissionSectionProps {
  commissionDisplay: string;
  balance: number;
  canTopUp: boolean;
  onTopUp: () => void;
}

function formatNumber(value: number): string {
  return value.toLocaleString("ru-RU");
}

export default function CommissionSection({ commissionDisplay, balance, canTopUp, onTopUp }: CommissionSectionProps) {
  const [guaranteesOpen, setGuaranteesOpen] = useState(false);

  return (
    <div className={styles.commission}>
      <div className={styles.commissionInfo}>
        <span className={styles.commissionLabel}>Для подачи заявки требуется взнос 5% от суммы заказа:</span>
        <div className={styles.commissionAmount}>
          <span className={styles.commissionValue}>{commissionDisplay}</span>
        </div>
      </div>

      <div className={styles.guarantees}>
        <button
          type="button"
          className={styles.guaranteesTitle}
          onClick={() => setGuaranteesOpen((prev) => !prev)}
        >
          <span className={styles.guaranteesTitleText}>Ваши гарантии</span>
          <svg
            className={`${styles.guaranteesChevron} ${guaranteesOpen ? styles.guaranteesChevronOpen : ""}`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M6 9L12 15L18 9" stroke="#FFDDA9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className={`${styles.guaranteesContent} ${guaranteesOpen ? styles.guaranteesContentOpen : ""}`}>
          <div className={styles.guaranteesInner}>
            {GUARANTEES.map((text) => (
              <div key={text} className={styles.guaranteeNote}>
                <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4.17 10L8.33 14.17L15.83 6.67"
                    stroke="#34C759"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={styles.guaranteeText}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.balanceRow}>
        <div className={styles.balanceInfo}>
          <span className={styles.balanceLabel}>На вашем счёте:</span>
          <span className={`${styles.balanceValue} ${!canTopUp ? styles.balanceValueOk : styles.balanceValueLow}`}>
            {formatNumber(balance)}{"\u00A0₽"}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className={styles.topUpButton}
          onClick={onTopUp}
          disabled={!canTopUp}
        >
          Пополнить баланс
        </Button>
      </div>
      {canTopUp && (
        <span className={styles.balanceHint}>Недостаточно средств для подачи заявки</span>
      )}
    </div>
  );
}

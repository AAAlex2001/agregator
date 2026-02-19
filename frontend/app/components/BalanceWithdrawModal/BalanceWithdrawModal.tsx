"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import styles from "./balanceWithdrawModal.module.scss";

interface BalanceWithdrawModalProps {
  isOpen: boolean;
  amount: string;
  cardNumber: string;
  onAmountChange: (value: string) => void;
  onCardNumberChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  balance: number;
}

function formatCardInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export default function BalanceWithdrawModal({
  isOpen,
  amount,
  cardNumber,
  onAmountChange,
  onCardNumberChange,
  onClose,
  onSubmit,
  isSubmitting = false,
  balance,
}: BalanceWithdrawModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) {
    return null;
  }

  const balanceRub = Math.floor(balance / 100);

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Вывод средств"
      >
        <div className={styles.content}>
          <div className={styles.titleWrap}>
            <h3 className={styles.title}>Вывод средств</h3>
            <p className={styles.balanceHint}>
              Доступно: {balanceRub.toLocaleString("ru-RU")} ₽
            </p>
          </div>

          <div className={styles.fieldWrap}>
            <div className={styles.fieldLabel}>Номер карты</div>
            <Input
              type="text"
              variant="text"
              inputMode="numeric"
              className={styles.amountField}
              inputClassName={styles.amountInput}
              value={cardNumber}
              onChange={(event) =>
                onCardNumberChange(formatCardInput(event.target.value))
              }
              placeholder="0000 0000 0000 0000"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fieldWrap}>
            <div className={styles.fieldLabel}>Сумма вывода, ₽</div>
            <Input
              type="text"
              variant="text"
              inputMode="numeric"
              className={styles.amountField}
              inputClassName={styles.amountInput}
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="Введите сумму"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="outline"
            size="md"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="chat"
            size="md"
            className={styles.submitButton}
            onClick={onSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Вывести средства
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

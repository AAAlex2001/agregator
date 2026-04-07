"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import styles from "./balanceTopUpModal.module.scss";

interface BalanceTopUpModalProps {
  isOpen: boolean;
  amount: string;
  onAmountChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function BalanceTopUpModal({
  isOpen,
  amount,
  onAmountChange,
  onClose,
  onSubmit,
  isSubmitting = false,
}: BalanceTopUpModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Пополнение баланса"
      >
        <div className={styles.content}>
          <div className={styles.titleWrap}>
            <h3 className={styles.title}>Пополнение баланса</h3>
          </div>

          <div className={styles.fieldWrap}>
            <div className={styles.fieldLabel}>Сумма пополнения, ₽</div>
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
            Пополнить баланс
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

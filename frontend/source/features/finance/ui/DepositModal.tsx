"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
import s from "./DepositModal.module.scss";

interface DepositModalProps {
  isOpen: boolean;
  amount: string;
  onAmountChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function DepositModal({
  isOpen, amount, onAmountChange, onClose, onSubmit, isSubmitting,
}: DepositModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className={s.overlay} onClick={onClose} role="presentation">
      <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={s.content}>
          <h3 className={s.title}>Пополнение баланса</h3>
          <div className={s.field}>
            <div className={s.label}>Сумма пополнения, ₽</div>
            <Input
              type="text" variant="text" inputMode="numeric"
              className={s.input} inputClassName={s.inputInner}
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="Введите сумму"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className={s.actions}>
          <Button variant="outline" size="md" className={s.cancel} onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button variant="chat" size="md" className={s.submit} onClick={onSubmit}
            disabled={isSubmitting} isLoading={isSubmitting}>
            Пополнить баланс
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

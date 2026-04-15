"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
import s from "./WithdrawModal.module.scss";

interface WithdrawModalProps {
  isOpen: boolean;
  amount: string;
  cardNumber: string;
  onAmountChange: (value: string) => void;
  onCardChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  balance: number;
}

function formatCardInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function WithdrawModal({
  isOpen, amount, cardNumber, onAmountChange, onCardChange,
  onClose, onSubmit, isSubmitting, balance,
}: WithdrawModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!isOpen || !mounted) return null;

  const balanceRub = Math.floor(balance / 100);

  return createPortal(
    <div className={s.overlay} onClick={onClose} role="presentation">
      <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={s.content}>
          <div className={s.titleWrap}>
            <h3 className={s.title}>Вывод средств</h3>
            <p className={s.hint}>Доступно: {balanceRub.toLocaleString("ru-RU")} ₽</p>
          </div>
          <div className={s.field}>
            <div className={s.label}>Номер карты</div>
            <Input
              type="text" variant="text" inputMode="numeric"
              className={s.input} inputClassName={s.inputInner}
              value={cardNumber}
              onChange={(e) => onCardChange(formatCardInput(e.target.value))}
              placeholder="0000 0000 0000 0000"
              disabled={isSubmitting}
            />
          </div>
          <div className={s.field}>
            <div className={s.label}>Сумма вывода, ₽</div>
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
            Вывести средства
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

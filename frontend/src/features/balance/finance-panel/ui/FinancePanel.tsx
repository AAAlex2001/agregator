"use client";

import { useEffect, useState } from "react";
import { BalanceTopUpModal, BalanceWithdrawModal, Button } from "@/shared/ui";
import Subtitle from "@/shared/ui/Typography/Subtitle";
import { useNotifications } from "@/shared/ui/Notifications";
import { createPayment, fetchPaymentHistory, withdrawFunds, type PaymentItem } from "@/features/balance/topup/model/api";

interface FinancePanelProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  returnUrl: string;
  styles: Record<string, string>;
}

function formatBalance(kopecks: number): string {
  return Math.floor(kopecks / 100).toLocaleString("ru-RU") + " ₽";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function formatTransactionText(item: PaymentItem): string {
  const rub = Math.floor(item.amount / 100).toLocaleString("ru-RU");
  if (item.payment_type === "DEPOSIT") {
    if (item.status === "SUCCEEDED") return `Пополнение баланса +${rub} ₽`;
    if (item.status === "CANCELED") return `Пополнение баланса ${rub} ₽ (отменено)`;
    return `Пополнение баланса ${rub} ₽ (в обработке)`;
  }
  if (item.payment_type === "COMMISSION") {
    if (item.status === "SUCCEEDED") return `Комиссия за проект −${rub} ₽`;
    if (item.status === "CANCELED") return `Комиссия за проект ${rub} ₽ (отменено)`;
    return `Комиссия за проект −${rub} ₽ (в обработке)`;
  }
  if (item.payment_type === "WITHDRAWAL") {
    if (item.status === "SUCCEEDED") return `Вывод средств −${rub} ₽`;
    if (item.status === "CANCELED") return `Вывод средств ${rub} ₽ (отменено)`;
    return `Вывод средств −${rub} ₽ (в обработке)`;
  }
  if (item.status === "REFUNDED") return `Возврат средств +${rub} ₽`;
  return `Операция ${rub} ₽`;
}

export function FinancePanel({ balance, onBalanceChange, returnUrl, styles }: FinancePanelProps) {
  const { showSuccess, showError } = useNotifications();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCard, setWithdrawCard] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    fetchPaymentHistory().then(setPayments).catch(() => {});
  }, []);

  const handleDeposit = async () => {
    if (isDepositing) return;
    const rub = parseFloat(topUpAmount.replace(/\s/g, "").replace(",", "."));
    if (!rub || rub <= 0) { showError("Введите корректную сумму"); return; }
    setIsDepositing(true);
    try {
      const { confirmation_url } = await createPayment(Math.round(rub * 100), returnUrl);
      setIsTopUpModalOpen(false);
      window.location.href = confirmation_url;
    } catch (err) {
      showError(err instanceof Error ? err.message : "Ошибка создания платежа");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (isWithdrawing) return;
    const rub = parseFloat(withdrawAmount.replace(/\s/g, "").replace(",", "."));
    if (!rub || rub <= 0) { showError("Введите корректную сумму"); return; }
    const card = withdrawCard.replace(/\s/g, "");
    if (!card || card.length < 13 || card.length > 19) { showError("Введите корректный номер карты"); return; }
    setIsWithdrawing(true);
    try {
      const result = await withdrawFunds(Math.round(rub * 100), card);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount("");
      setWithdrawCard("");
      onBalanceChange(result.new_balance);
      showSuccess("Заявка на вывод создана");
      setPayments(await fetchPaymentHistory());
    } catch (err) {
      showError(err instanceof Error ? err.message : "Ошибка вывода средств");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const mid = Math.ceil(payments.length / 2);
  const left = payments.slice(0, mid);
  const right = payments.slice(mid);

  return (
    <div className={styles.finance}>
      <Subtitle text={`Баланс: ${formatBalance(balance)}`} className={styles.financeSubtitle} />

      <div className={styles.financeButtons}>
        <Button variant="outline" size="md" fullWidth className={styles.financeActionButton}
          onClick={() => { setWithdrawAmount(""); setWithdrawCard(""); setIsWithdrawModalOpen(true); }}
          isLoading={isWithdrawing}>
          Вывести средства
        </Button>
        <Button variant="chat" size="md" fullWidth className={styles.financeActionButton}
          onClick={() => { setTopUpAmount(""); setIsTopUpModalOpen(true); }} isLoading={isDepositing}>
          Пополнить
        </Button>
      </div>

      {payments.length > 0 ? (
        <div className={styles.financeColumns}>
          <div className={styles.transactionColumn}>
            {left.map((item) => (
              <div key={item.id} className={styles.transaction}>
                <span className={styles.transactionDate}>{formatDate(item.created_at)}</span>
                <span className={styles.transactionText}>{formatTransactionText(item)}</span>
              </div>
            ))}
          </div>
          {right.length > 0 && (
            <div className={styles.transactionColumn}>
              {right.map((item) => (
                <div key={item.id} className={styles.transaction}>
                  <span className={styles.transactionDate}>{formatDate(item.created_at)}</span>
                  <span className={styles.transactionText}>{formatTransactionText(item)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className={styles.emptyHistory}>Операций пока нет</p>
      )}

      <BalanceTopUpModal
        isOpen={isTopUpModalOpen}
        amount={topUpAmount}
        onAmountChange={setTopUpAmount}
        onClose={() => setIsTopUpModalOpen(false)}
        onSubmit={() => void handleDeposit()}
        isSubmitting={isDepositing}
      />

      <BalanceWithdrawModal
        isOpen={isWithdrawModalOpen}
        amount={withdrawAmount}
        cardNumber={withdrawCard}
        onAmountChange={setWithdrawAmount}
        onCardNumberChange={setWithdrawCard}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSubmit={() => void handleWithdraw()}
        isSubmitting={isWithdrawing}
        balance={balance}
      />
    </div>
  );
}

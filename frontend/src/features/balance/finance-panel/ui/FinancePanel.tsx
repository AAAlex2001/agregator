"use client";

import { Button } from "@/shared/ui";
import Subtitle from "@/shared/ui/Typography/Subtitle";
import { formatBalance } from "@/shared/lib/formatMoney";
import { useNotifications } from "@/shared/ui/Notifications";
import { BalanceTopUpModal, useDepositState, usePaymentHistoryState, handleDeposit } from "@/features/balance/topup";
import { BalanceWithdrawModal, useWithdrawState, handleWithdraw } from "@/features/balance/withdraw";
import { TransactionList } from "@/entities/payment";

interface FinancePanelProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  returnUrl: string;
  styles: Record<string, string>;
}

export function FinancePanel({ balance, onBalanceChange, returnUrl, styles }: FinancePanelProps) {
  const { showSuccess, showError } = useNotifications();
  const { payments, setPayments } = usePaymentHistoryState();
  const deposit = useDepositState();
  const withdraw = useWithdrawState();

  const onDeposit = async () => {
    deposit.setLoading(true);
    await handleDeposit(
      deposit.amount,
      returnUrl,
      (url) => { deposit.close(); window.location.href = url; },
      showError,
    );
    deposit.setLoading(false);
  };

  const onWithdraw = async () => {
    withdraw.setLoading(true);
    await handleWithdraw(
      withdraw.amount,
      withdraw.card,
      (newBalance, history) => {
        withdraw.close();
        withdraw.setAmount("");
        withdraw.setCard("");
        onBalanceChange(newBalance);
        setPayments(history);
        showSuccess("Заявка на вывод создана");
      },
      showError,
    );
    withdraw.setLoading(false);
  };

  return (
    <div className={styles.finance}>
      <Subtitle text={`Баланс: ${formatBalance(balance)}`} className={styles.financeSubtitle} />

      <div className={styles.financeButtons}>
        <Button variant="outline" size="md" fullWidth className={styles.financeActionButton}
          onClick={withdraw.open} isLoading={withdraw.loading}>
          Вывести средства
        </Button>
        <Button variant="chat" size="md" fullWidth className={styles.financeActionButton}
          onClick={deposit.open} isLoading={deposit.loading}>
          Пополнить
        </Button>
      </div>

      <TransactionList payments={payments} />

      <BalanceTopUpModal
        isOpen={deposit.isOpen}
        amount={deposit.amount}
        onAmountChange={deposit.setAmount}
        onClose={deposit.close}
        onSubmit={() => void onDeposit()}
        isSubmitting={deposit.loading}
      />

      <BalanceWithdrawModal
        isOpen={withdraw.isOpen}
        amount={withdraw.amount}
        cardNumber={withdraw.card}
        onAmountChange={withdraw.setAmount}
        onCardNumberChange={withdraw.setCard}
        onClose={withdraw.close}
        onSubmit={() => void onWithdraw()}
        isSubmitting={withdraw.loading}
        balance={balance}
      />
    </div>
  );
}

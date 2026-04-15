"use client";

import Button from "@/source/shared/ui/Button";
import { Subtitle } from "@/source/shared/ui/Typography";
import { formatBalance } from "@/source/shared/lib/formatMoney";
import { TransactionList } from "@/source/entities/payment";
import { useFinance } from "../model/useFinance";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import s from "./FinancePanel.module.scss";

interface FinancePanelProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  returnUrl: string;
}

export function FinancePanel({ balance, onBalanceChange, returnUrl }: FinancePanelProps) {
  const { state, dispatch, handleDeposit, handleWithdraw } = useFinance(balance, returnUrl);

  const onDeposit = async () => {
    await handleDeposit();
  };

  const onWithdraw = async () => {
    await handleWithdraw();
    if (state.success) onBalanceChange(state.balance);
  };

  return (
    <div className={s.finance}>
      <Subtitle text={`Баланс: ${formatBalance(state.balance)}`} className={s.subtitle} />

      {state.error && <p className={s.error}>{state.error}</p>}
      {state.success && <p className={s.success}>{state.success}</p>}

      <div className={s.buttons}>
        <Button variant="outline" size="md" fullWidth className={s.actionButton}
          onClick={() => dispatch({ type: "OPEN_WITHDRAW" })}>
          Вывести средства
        </Button>
        <Button variant="chat" size="md" fullWidth className={s.actionButton}
          onClick={() => dispatch({ type: "OPEN_DEPOSIT" })}>
          Пополнить
        </Button>
      </div>

      <TransactionList payments={state.payments} />

      <DepositModal
        isOpen={state.depositOpen}
        amount={state.depositAmount}
        onAmountChange={(v) => dispatch({ type: "SET_DEPOSIT_AMOUNT", value: v })}
        onClose={() => dispatch({ type: "CLOSE_DEPOSIT" })}
        onSubmit={() => void onDeposit()}
        isSubmitting={state.depositLoading}
      />

      <WithdrawModal
        isOpen={state.withdrawOpen}
        amount={state.withdrawAmount}
        cardNumber={state.withdrawCard}
        onAmountChange={(v) => dispatch({ type: "SET_WITHDRAW_AMOUNT", value: v })}
        onCardChange={(v) => dispatch({ type: "SET_WITHDRAW_CARD", value: v })}
        onClose={() => dispatch({ type: "CLOSE_WITHDRAW" })}
        onSubmit={() => void onWithdraw()}
        isSubmitting={state.withdrawLoading}
        balance={state.balance}
      />
    </div>
  );
}

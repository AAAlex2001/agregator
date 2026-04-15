"use client";

import { useEffect, useReducer } from "react";
import { parseRubToKopecks } from "@/source/shared/lib/formatMoney";
import { financeReducer, createInitialFinanceState } from "./reducer";
import { fetchPaymentHistory, createPayment, withdrawFunds } from "../api/finance.api";

export function useFinance(initialBalance: number, returnUrl: string) {
  const [state, dispatch] = useReducer(financeReducer, initialBalance, createInitialFinanceState);

  useEffect(() => {
    fetchPaymentHistory()
      .then((payments) => dispatch({ type: "SET_PAYMENTS", payments }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_BALANCE", balance: initialBalance });
  }, [initialBalance]);

  const handleDeposit = async () => {
    const kopecks = parseRubToKopecks(state.depositAmount);
    if (!kopecks) {
      dispatch({ type: "SET_ERROR", error: "Введите корректную сумму" });
      return;
    }
    dispatch({ type: "SET_DEPOSIT_LOADING", value: true });
    try {
      const { confirmation_url } = await createPayment(kopecks, returnUrl);
      dispatch({ type: "CLOSE_DEPOSIT" });
      window.location.href = confirmation_url;
    } catch (err) {
      dispatch({ type: "SET_ERROR", error: err instanceof Error ? err.message : "Ошибка создания платежа" });
    } finally {
      dispatch({ type: "SET_DEPOSIT_LOADING", value: false });
    }
  };

  const handleWithdraw = async () => {
    const kopecks = parseRubToKopecks(state.withdrawAmount);
    if (!kopecks) {
      dispatch({ type: "SET_ERROR", error: "Введите корректную сумму" });
      return;
    }
    const digits = state.withdrawCard.replace(/\s/g, "");
    if (!digits || digits.length < 13 || digits.length > 19) {
      dispatch({ type: "SET_ERROR", error: "Введите корректный номер карты" });
      return;
    }
    dispatch({ type: "SET_WITHDRAW_LOADING", value: true });
    try {
      const result = await withdrawFunds(kopecks, digits);
      const payments = await fetchPaymentHistory();
      dispatch({ type: "SET_BALANCE", balance: result.new_balance });
      dispatch({ type: "SET_PAYMENTS", payments });
      dispatch({ type: "SET_SUCCESS", message: "Заявка на вывод создана" });
      dispatch({ type: "CLOSE_WITHDRAW" });
    } catch (err) {
      dispatch({ type: "SET_ERROR", error: err instanceof Error ? err.message : "Ошибка вывода средств" });
    } finally {
      dispatch({ type: "SET_WITHDRAW_LOADING", value: false });
    }
  };

  return { state, dispatch, handleDeposit, handleWithdraw };
}

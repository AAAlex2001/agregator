"use client";

import { useEffect, useState } from "react";
import { fetchPaymentHistory } from "./api";
import type { PaymentItem } from "./types";

export function useDepositState() {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function open() {
    setAmount("");
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return { amount, setAmount, isOpen, open, close, loading, setLoading };
}

export function usePaymentHistoryState() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);

  useEffect(() => {
    fetchPaymentHistory().then(setPayments).catch(() => {});
  }, []);

  return { payments, setPayments };
}

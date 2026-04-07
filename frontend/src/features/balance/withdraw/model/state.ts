"use client";

import { useState } from "react";

export function useWithdrawState() {
  const [amount, setAmount] = useState("");
  const [card, setCard] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function open() {
    setAmount("");
    setCard("");
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return { amount, setAmount, card, setCard, isOpen, open, close, loading, setLoading };
}

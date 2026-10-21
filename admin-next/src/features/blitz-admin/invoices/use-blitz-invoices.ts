"use client";

import { useEffect, useState } from "react";
import { confirmBlitzInvoice, fetchBlitzInvoices, type BlitzAdminInvoice } from "@/entities/blitz-order";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";

/** Счета для сверки с банком: только ждущие оплаты или все. Подтверждение двигает заявку дальше. */
export function useBlitzInvoices() {
  const toast = useToast();
  const [query, setQuery] = useState({ onlyOpen: true, version: 0 });
  const [invoices, setInvoices] = useState<BlitzAdminInvoice[] | null>(null);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  useEffect(() => {
    const request = new AbortController();

    fetchBlitzInvoices(query.onlyOpen, request.signal)
      .then((result) => {
        if (!request.signal.aborted) setInvoices(result);
      })
      .catch((failure) => {
        if (!request.signal.aborted) setError(errorMessage(failure, "Не удалось загрузить счета"));
      });

    return () => request.abort();
  }, [query]);

  function load(onlyOpen: boolean) {
    setInvoices(null);
    setError("");
    setQuery({ onlyOpen, version: query.version + 1 });
  }

  async function confirm(id: number) {
    if (confirmingId !== null) return;

    setConfirmingId(id);

    try {
      await confirmBlitzInvoice(id);
      toast("Оплата подтверждена, заявка идёт дальше");
      load(query.onlyOpen);
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось подтвердить оплату"), "error");
    } finally {
      setConfirmingId(null);
    }
  }

  return {
    invoices,
    error,
    onlyOpen: query.onlyOpen,
    confirmingId,
    showOpen: () => load(true),
    showAll: () => load(false),
    reload: () => load(query.onlyOpen),
    confirm,
  };
}

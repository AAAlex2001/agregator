"use client";

import { useState } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";

/** Выполняет решение модератора, закрывает подтверждение и обновляет список. */
export function useModeration() {
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function run(action: () => Promise<void>, onDone: () => void) {
    if (pending) return;

    setPending(true);

    try {
      await action();
      setConfirming(false);
      toast("Решение сохранено");
      onDone();
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось выполнить действие"), "error");
    } finally {
      setPending(false);
    }
  }

  return {
    pending,
    confirming,
    run,
    askRemove: () => setConfirming(true),
    cancelRemove: () => {
      if (!pending) setConfirming(false);
    },
  };
}

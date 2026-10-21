"use client";

import { useState } from "react";
import type { BlitzOrder } from "@/entities/blitz-order";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";

/** Выполняет действие администратора над заявкой и показывает её новую версию. */
export function useBlitzCommand(onChange: (order: BlitzOrder) => void) {
  const toast = useToast();
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<BlitzOrder>, success: string): Promise<boolean> {
    if (pending) return false;

    setPending(true);

    try {
      onChange(await action());
      toast(success);
      return true;
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось выполнить действие"), "error");
      return false;
    } finally {
      setPending(false);
    }
  }

  return { pending, run };
}

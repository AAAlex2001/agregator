"use client";

import { useEffect, useState } from "react";
import { fetchAuditTariff, saveAuditTariff } from "@/entities/blitz-order";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";

/** Минимальная стоимость аудита СУПБ. */
export const MIN_AUDIT_TARIFF = 100_000;

/** Цена из поля или null, если поле пустое. */
const parsePrice = (value: string) => {
  const cleaned = value.replace(/\s/g, "").replace(",", ".");

  return cleaned ? Number(cleaned) : null;
};

/** Тариф аудита: загрузка, правка и сохранение. Пустое поле убирает ориентир из формы заказчика. */
export function useAuditTariff() {
  const toast = useToast();
  const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const price = parsePrice(value);
  const tooLow = price !== null && !(price >= MIN_AUDIT_TARIFF);

  useEffect(() => {
    const request = new AbortController();

    fetchAuditTariff(request.signal)
      .then((tariff) => {
        if (request.signal.aborted) return;

        setValue(tariff === null ? "" : String(tariff));
        setLoaded(true);
      })
      .catch((failure) => {
        if (!request.signal.aborted) setError(errorMessage(failure, "Не удалось загрузить тариф аудита"));
      });

    return () => request.abort();
  }, []);

  async function save() {
    if (saving || tooLow) return;

    setSaving(true);

    try {
      const saved = await saveAuditTariff(price);

      setValue(saved === null ? "" : String(saved));
      toast(saved === null ? "Тариф аудита убран" : "Тариф аудита сохранён");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить тариф аудита"), "error");
    } finally {
      setSaving(false);
    }
  }

  return { value, loaded, error, saving, tooLow, changeValue: setValue, save };
}
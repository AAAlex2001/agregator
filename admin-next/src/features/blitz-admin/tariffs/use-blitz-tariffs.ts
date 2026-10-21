"use client";

import { useEffect, useState } from "react";
import {
  fetchBlitzCatalog,
  fetchBlitzTariffs,
  saveBlitzTariffs,
  type BlitzCatalog,
  type BlitzTariff,
} from "@/entities/blitz-order";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";

/** Ключ ячейки сетки. */
export const tariffKey = (area: string, object: string) => `${area}|${object}`;

/** Цены тарифов по ключу ячейки строками для полей ввода. */
const toValues = (tariffs: BlitzTariff[]): Record<string, string> =>
  Object.fromEntries(tariffs.map((tariff) => [tariffKey(tariff.area_code, tariff.object_code), String(tariff.price)]));

/** Цена из поля или null, если поле пустое. */
const parsePrice = (value: string | undefined) => {
  const cleaned = (value ?? "").replace(/\s/g, "").replace(",", ".");

  return cleaned ? Number(cleaned) : null;
};

/** Сетка тарифов «область × объект»: загрузка, правка ячеек и сохранение целиком. */
export function useBlitzTariffs() {
  const toast = useToast();
  const [catalog, setCatalog] = useState<BlitzCatalog | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const request = new AbortController();

    Promise.all([fetchBlitzCatalog(request.signal), fetchBlitzTariffs(request.signal)])
      .then(([loadedCatalog, tariffs]) => {
        if (request.signal.aborted) return;

        setCatalog(loadedCatalog);
        setValues(toValues(tariffs));
      })
      .catch((failure) => {
        if (!request.signal.aborted) setError(errorMessage(failure, "Не удалось загрузить тарифы"));
      });

    return () => request.abort();
  }, []);

  async function save() {
    if (!catalog || saving) return;

    const cells = catalog.areas.flatMap((area) =>
      area.objects.map((object) => ({
        area_code: area.code,
        object_code: object,
        price: parsePrice(values[tariffKey(area.code, object)]),
      })),
    );

    if (cells.some((cell) => cell.price !== null && !(cell.price > 0))) {
      toast("Цена должна быть больше нуля", "error");
      return;
    }

    setSaving(true);

    try {
      setValues(toValues(await saveBlitzTariffs(cells)));
      toast("Тарифы сохранены");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить тарифы"), "error");
    } finally {
      setSaving(false);
    }
  }

  return {
    catalog,
    values,
    error,
    saving,
    changeValue: (key: string, value: string) => setValues({ ...values, [key]: value }),
    save,
  };
}

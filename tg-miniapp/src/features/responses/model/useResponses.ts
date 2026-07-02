import { useCallback, useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import {
  listResponses,
  withdrawResponse,
  restoreResponse,
  type ExpertResponse,
  type ResponseTab,
} from "@/entites/response";

export function useResponses(tab: ResponseTab) {
  const [items, setItems] = useState<ExpertResponse[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await listResponses(tab);
      setItems(data.items);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось загрузить отклики");
      setItems([]);
    }
  }, [tab]);

  useEffect(() => {
    setItems(null);
    void reload();
  }, [reload]);

  const withdraw = async (id: number) => {
    setBusyId(id);
    try {
      await withdrawResponse(id);
      notifyHaptic("success");
      await reload();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отозвать отклик");
    } finally {
      setBusyId(null);
    }
  };

  const restore = async (id: number) => {
    setBusyId(id);
    try {
      await restoreResponse(id);
      notifyHaptic("success");
      await reload();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось восстановить отклик");
    } finally {
      setBusyId(null);
    }
  };

  return { items, busyId, withdraw, restore };
}

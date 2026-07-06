import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { openChatByOrder } from "@/entites/chat";
import {
  listResponses,
  withdrawResponse,
  restoreResponse,
  setResponseStatus,
  type ExpertResponse,
  type ResponseCounters,
  type ResponseTab,
} from "@/entites/response";

const EMPTY_COUNTERS: ResponseCounters = {
  all: 0,
  review: 0,
  in_progress: 0,
  rejected: 0,
  accepted: 0,
  withdrawn_by_expert: 0,
};

export function useResponses(tab: ResponseTab, onOpenChat: (uuid: string) => void) {
  const [items, setItems] = useState<ExpertResponse[] | null>(null);
  const [counters, setCounters] = useState<ResponseCounters>(EMPTY_COUNTERS);
  const [busyId, setBusyId] = useState<number | null>(null);

  const reload = async () => {
    try {
      const data = await listResponses(tab);
      setItems(data.items);
      setCounters(data.counters);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось загрузить отклики");
      setItems([]);
    }
  };

  useEffect(() => {
    setItems(null);
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

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

  const confirmProject = async (id: number) => {
    setBusyId(id);
    try {
      await setResponseStatus(id, "IN_PROGRESS");
      notifyHaptic("success");
      await reload();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось принять проект");
    } finally {
      setBusyId(null);
    }
  };

  const openChat = async (response: ExpertResponse) => {
    setBusyId(response.id);
    try {
      const chat = await openChatByOrder(response.order_id);
      onOpenChat(chat.uuid);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось открыть чат");
    } finally {
      setBusyId(null);
    }
  };

  return { items, counters, busyId, withdraw, restore, confirmProject, openChat, reload };
}

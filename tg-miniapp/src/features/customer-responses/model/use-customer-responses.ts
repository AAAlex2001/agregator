import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { openChatByOrder } from "@/entites/chat";
import {
  listResponses,
  setResponseStatus,
  type CustomerSortBy,
  type ExpertResponse,
  type ResponseCounters,
  type ResponseTab,
  type SortDir,
} from "@/entites/response";

export function useCustomerResponses(sortBy: CustomerSortBy, sortDir: SortDir, onOpenChat: (uuid: string) => void) {
  const [tab, setTab] = useState<ResponseTab>("all");
  const [items, setItems] = useState<ExpertResponse[] | null>(null);
  const [counters, setCounters] = useState<ResponseCounters | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const reload = async () => {
    try {
      const data = await listResponses(tab, sortBy, sortDir);
      setItems(data.items);
      setCounters(data.counters);
    } catch {
      setItems((prev) => prev ?? []);
    }
  };

  useEffect(() => {
    setItems(null);
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, sortBy, sortDir]);

  const changeStatus = async (id: number, status: string, fallback: string, reason?: string) => {
    setBusyId(id);
    try {
      await setResponseStatus(id, status, reason);
      notifyHaptic("success");
      await reload();
      return true;
    } catch (e) {
      emitError(e instanceof Error ? e.message : fallback);
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const accept = async (response: ExpertResponse) => {
    const changed = await changeStatus(response.id, "ACCEPTED", "Не удалось принять отклик");
    if (!changed) return;
    try {
      const chat = await openChatByOrder(response.order_id);
      onOpenChat(chat.uuid);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось открыть чат");
    }
  };

  const reject = (id: number, reason: string) =>
    changeStatus(id, "REJECTED", "Не удалось отклонить отклик", reason.trim() || undefined);

  const complete = (id: number) => changeStatus(id, "COMPLETED", "Не удалось завершить проект");

  const returnToReview = (id: number) => changeStatus(id, "REVIEW", "Не удалось вернуть отклик");

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

  return { tab, setTab, items, counters, busyId, accept, reject, complete, returnToReview, openChat };
}

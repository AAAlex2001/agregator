"use client";

import { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { mapApiToCard } from "@/source/entities/response";
import type { ResponseCardData, ResponseTabKey } from "@/source/entities/response";
import { fetchResponses, deleteResponse, updateStatus, editResponse } from "../api/responses.api";
import { copyOrderLink } from "@/shared/lib/copyOrderLink";
import { openChatByOrder } from "@/shared/lib/chatApi";
import { reducer, initial } from "./reducer";

const TABS: Array<{ key: ResponseTabKey; label: string }> = [
  { key: "review", label: "На рассмотрении" },
  { key: "in_progress", label: "В работе" },
  { key: "rejected", label: "Отклоненные" },
  { key: "accepted", label: "В переговорах" },
  { key: "completed", label: "Завершены" },
];

export function useExpertResponses() {
  const [s, d] = useReducer(reducer, initial);
  const router = useRouter();

  const reload = async () => {
    d({ type: "LOADING", value: true });
    d({ type: "ERROR", value: null });
    try {
      const data = await fetchResponses(s.activeTab);
      d({ type: "DATA", items: data.items.map(mapApiToCard), counters: data.counters });
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      d({ type: "LOADING", value: false });
    }
  };

  useEffect(() => { void reload(); }, [s.activeTab]);

  const setTab = (tab: ResponseTabKey) => d({ type: "TAB", tab });

  const tabs = TABS.map((t) => ({ id: t.key, label: t.label, count: s.counters[t.key] }));

  const onShare = (publicId: string, onCopied: () => void) => copyOrderLink(publicId, onCopied);

  const onChat = async (rid: number, oid: number) => {
    d({ type: "ACTION_LOADING", id: rid, mode: "chat" });
    try {
      const detail = await openChatByOrder(oid);
      router.push(`/expert/chat/${detail.uuid}`);
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Не удалось открыть чат" });
    } finally {
      d({ type: "ACTION_LOADING", id: rid, mode: null });
    }
  };

  const onStart = async (id: number) => {
    d({ type: "ACTION_LOADING", id, mode: "start" });
    try {
      await updateStatus(id, "IN_PROGRESS");
      void reload();
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка" });
    } finally {
      d({ type: "ACTION_LOADING", id, mode: null });
    }
  };

  const onComplete = async (id: number) => {
    d({ type: "ACTION_LOADING", id, mode: "complete" });
    try {
      await updateStatus(id, "COMPLETED");
      void reload();
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка" });
    } finally {
      d({ type: "ACTION_LOADING", id, mode: null });
    }
  };

  const onWithdrawConfirm = async () => {
    if (!s.withdrawTarget) return;
    const id = s.withdrawTarget.id;
    d({ type: "ACTION_LOADING", id, mode: "withdraw" });
    try {
      await deleteResponse(id);
      d({ type: "WITHDRAW_TARGET", value: null });
      void reload();
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка" });
    } finally {
      d({ type: "ACTION_LOADING", id, mode: null });
    }
  };

  const onEditSubmit = async (formData: { comment: string; costEstimate: number; deadline: string; files?: File[]; keepFiles?: string[] }) => {
    if (!s.editing) return;
    d({ type: "EDIT_SUBMITTING", value: true });
    try {
      await editResponse(s.editing.id, {
        comment: formData.comment,
        sumAmount: formData.costEstimate,
        deadline: formData.deadline,
        files: formData.files,
        keepFiles: formData.keepFiles,
      });
      d({ type: "EDITING", value: null });
      void reload();
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка" });
    } finally {
      d({ type: "EDIT_SUBMITTING", value: false });
    }
  };

  return {
    ...s, tabs, setTab, reload,
    onWithdraw: (r: ResponseCardData) => d({ type: "WITHDRAW_TARGET", value: r }),
    onEdit: (r: ResponseCardData) => d({ type: "EDITING", value: r }),
    closeEdit: () => d({ type: "EDITING", value: null }),
    closeWithdraw: () => d({ type: "WITHDRAW_TARGET", value: null }),
    onShare, onChat, onStart, onComplete, onWithdrawConfirm, onEditSubmit,
  };
}

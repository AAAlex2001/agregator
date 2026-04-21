"use client";

import { useEffect, useReducer } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mapApiToCard } from "@/source/entities/response";
import type { ResponseCardData, ResponseTabKey, UserRole } from "@/source/entities/response";
import { fetchResponses, deleteResponse, updateStatus, editResponse, createReview } from "../api/responses.api";
import { openChatByOrder } from "@/source/features/chat";
import { copyOrderLink } from "@/source/shared/lib/copyOrderLink";
import { reducer, initial } from "./reducer";

const VALID_TABS: ResponseTabKey[] = ["review", "in_progress", "rejected", "accepted", "completed"];

const TAB_LABELS: Record<UserRole, Array<{ key: ResponseTabKey; label: string }>> = {
  expert: [
    { key: "review", label: "На рассмотрении" },
    { key: "in_progress", label: "В работе" },
    { key: "rejected", label: "Отклоненные" },
    { key: "accepted", label: "В переговорах" },
    { key: "completed", label: "Завершены" },
  ],
  customer: [
    { key: "review", label: "Новые" },
    { key: "in_progress", label: "В работе" },
    { key: "rejected", label: "Отклоненные" },
    { key: "accepted", label: "В переговорах" },
    { key: "completed", label: "Завершены" },
  ],
};

export function useResponses(role: UserRole | null) {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") as ResponseTabKey | null;
  const [s, d] = useReducer(
    reducer,
    initialTab && VALID_TABS.includes(initialTab) ? { ...initial, activeTab: initialTab } : initial,
  );
  const router = useRouter();

  const reload = async () => {
    if (!role) return;
    d({ type: "LOADING", value: true });
    d({ type: "ERROR", value: null });
    try {
      const data = await fetchResponses(s.activeTab);
      d({ type: "DATA", items: data.items.map((item) => mapApiToCard(item, role)), counters: data.counters });
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      d({ type: "LOADING", value: false });
    }
  };

  useEffect(() => {
    if (!role) return;
    void reload();
  }, [role, s.activeTab]);

  const setTab = (tab: ResponseTabKey) => d({ type: "TAB", tab });
  const tabs = role
    ? TAB_LABELS[role].map((t) => ({ id: t.key, label: t.label, count: s.counters[t.key] }))
    : [];

  const statusAction = async (id: number, mode: string, status: string, after?: () => void) => {
    d({ type: "ACTION_LOADING", id, mode: mode as never });
    try {
      await updateStatus(id, status);
      after?.();
      void reload();
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка" });
    } finally {
      d({ type: "ACTION_LOADING", id, mode: null });
    }
  };

  const onChat = async (rid: number, oid: number) => {
    if (!role) return;
    d({ type: "ACTION_LOADING", id: rid, mode: "chat" });
    try {
      const detail = await openChatByOrder(oid);
      router.push(`/chat/${detail.uuid}`);
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Не удалось открыть чат" });
    } finally {
      d({ type: "ACTION_LOADING", id: rid, mode: null });
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

  const onAccept = async (id: number, oid: number) => {
    d({ type: "ACTION_LOADING", id, mode: "accept" });
    try {
      await updateStatus(id, "ACCEPTED");
      void onChat(id, oid);
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
      if (role === "customer") {
        d({ type: "REVIEW_TARGET", value: s.items.find((i) => i.id === id) ?? null });
        d({ type: "COMPLETION_MODAL", value: true });
      }
      void reload();
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка" });
    } finally {
      d({ type: "ACTION_LOADING", id, mode: null });
    }
  };

  const onSubmitReview = async (payload: { rating: number; comment: string }) => {
    if (!s.reviewTarget) return;
    try {
      await createReview({ response_id: s.reviewTarget.id, ...payload });
      d({ type: "REVIEW_MODAL", value: false });
      d({ type: "COMPLETION_MODAL", value: false });
      void reload();
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка" });
    }
  };

  return {
    ...s, role, tabs, setTab, reload, onChat, onComplete,
    onShare: (pid: string, cb: () => void) => copyOrderLink(pid, cb),
    onWithdraw: (r: ResponseCardData) => d({ type: "WITHDRAW_TARGET", value: r }),
    onEdit: (r: ResponseCardData) => d({ type: "EDITING", value: r }),
    closeEdit: () => d({ type: "EDITING", value: null }),
    closeWithdraw: () => d({ type: "WITHDRAW_TARGET", value: null }),
    onWithdrawConfirm, onEditSubmit,
    onStart: (id: number) => statusAction(id, "start", "IN_PROGRESS"),
    onReject: (id: number) => statusAction(id, "reject", "REJECTED"),
    onSelect: (id: number) => statusAction(id, "select", "IN_PROGRESS"),
    onAccept,
    onLeaveReview: (r: ResponseCardData) => { d({ type: "REVIEW_TARGET", value: r }); d({ type: "REVIEW_MODAL", value: true }); },
    closeCompletion: () => d({ type: "COMPLETION_MODAL", value: false }),
    openReviewFromCompletion: () => { d({ type: "COMPLETION_MODAL", value: false }); d({ type: "REVIEW_MODAL", value: true }); },
    closeReview: () => d({ type: "REVIEW_MODAL", value: false }),
    onSubmitReview,
  };
}

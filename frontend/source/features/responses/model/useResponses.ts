"use client";

import { useEffect, useReducer } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mapApiToCard } from "@/source/entities/response";
import type { ResponseCardData, ResponseTabKey, UserRole, CustomerSortBy, SortDir } from "@/source/entities/response";
import { fetchResponses, deleteResponse, updateStatus, editResponse, createReview } from "../api/responses.api";
import { openChatByOrder } from "@/source/features/chat";
import { copyOrderLink } from "@/source/shared/lib/copyOrderLink";
import { reducer, initial } from "./reducer";

const VALID_TABS: ResponseTabKey[] = ["all", "review", "in_progress", "rejected", "accepted"];

const TAB_LABELS: Record<UserRole, Array<{ key: ResponseTabKey; label: string }>> = {
  expert: [
    { key: "all", label: "Все" },
    { key: "review", label: "На рассмотрении" },
    { key: "in_progress", label: "В работе" },
    { key: "rejected", label: "Отклоненные" },
    { key: "accepted", label: "В переговорах" },
  ],
  customer: [
    { key: "all", label: "Все" },
    { key: "review", label: "Новые" },
    { key: "in_progress", label: "В работе" },
    { key: "rejected", label: "Отклоненные" },
    { key: "accepted", label: "В переговорах" },
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
      const data = await fetchResponses(s.activeTab, s.sortBy ?? "created_at", s.sortDir ?? "desc", 0, 50);
      d({
        type: "DATA",
        items: data.items.map((item) => mapApiToCard(item, role)),
        counters: data.counters,
        hasMore: data.has_more,
      });
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      d({ type: "LOADING", value: false });
    }
  };

  const loadMore = async () => {
    if (!role || s.isLoading || s.isLoadingMore || !s.hasMore) return;
    d({ type: "LOADING_MORE", value: true });
    try {
      const data = await fetchResponses(
        s.activeTab,
        s.sortBy ?? "created_at",
        s.sortDir ?? "desc",
        s.items.length,
        50,
      );
      d({
        type: "APPEND",
        items: data.items.map((item) => mapApiToCard(item, role)),
        hasMore: data.has_more,
      });
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      d({ type: "LOADING_MORE", value: false });
    }
  };

  useEffect(() => {
    if (!role) return;
    void reload();
  }, [role, s.activeTab, s.sortBy, s.sortDir]);

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

  const onEditSubmit = async (formData: { comment: string; costEstimate: number; deadline: string; vatKind: string; files?: File[]; keepFiles?: string[] }) => {
    if (!s.editing) return;
    d({ type: "EDIT_SUBMITTING", value: true });
    try {
      await editResponse(s.editing.id, {
        comment: formData.comment,
        sumAmount: formData.costEstimate,
        deadline: formData.deadline,
        vatKind: formData.vatKind,
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

  const onRejectConfirm = async (reason: string) => {
    if (!s.rejectTarget) return;
    const id = s.rejectTarget.id;
    d({ type: "ACTION_LOADING", id, mode: "reject" });
    try {
      await updateStatus(id, "REJECTED", reason || undefined);
      d({ type: "REJECT_TARGET", value: null });
      void reload();
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка" });
    } finally {
      d({ type: "ACTION_LOADING", id, mode: null });
    }
  };

  return {
    ...s, role, tabs, setTab, reload, loadMore, onChat, onComplete,
    onShare: (pid: string, cb: () => void) => copyOrderLink(pid, cb),
    onWithdraw: (r: ResponseCardData) => d({ type: "WITHDRAW_TARGET", value: r }),
    onEdit: (r: ResponseCardData) => d({ type: "EDITING", value: r }),
    closeEdit: () => d({ type: "EDITING", value: null }),
    closeWithdraw: () => d({ type: "WITHDRAW_TARGET", value: null }),
    onWithdrawConfirm, onEditSubmit,
    onStart: (id: number) => statusAction(id, "start", "IN_PROGRESS"),
    onReject: (r: ResponseCardData) => d({ type: "REJECT_TARGET", value: r }),
    closeReject: () => d({ type: "REJECT_TARGET", value: null }),
    onRejectConfirm,
    onSelect: (id: number) => statusAction(id, "select", "IN_PROGRESS"),
    onRestore: (id: number) => statusAction(id, "restore", "REVIEW"),
    onAccept,
    onLeaveReview: (r: ResponseCardData) => { d({ type: "REVIEW_TARGET", value: r }); d({ type: "REVIEW_MODAL", value: true }); },
    closeCompletion: () => d({ type: "COMPLETION_MODAL", value: false }),
    openReviewFromCompletion: () => { d({ type: "COMPLETION_MODAL", value: false }); d({ type: "REVIEW_MODAL", value: true }); },
    closeReview: () => d({ type: "REVIEW_MODAL", value: false }),
    onSubmitReview,
    setSort: (sortBy: CustomerSortBy | null, sortDir: SortDir | null) => { d({ type: "SORT_BY", value: sortBy }); d({ type: "SORT_DIR", value: sortDir }); },
  };
}

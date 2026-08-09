"use client";

import { useEffect, useReducer } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { mapApiToCard } from "@/source/entities/response";
import type { ResponseCardData, ResponseTabKey, UserRole, CustomerSortBy, SortDir } from "@/source/entities/response";
import {
  fetchResponses,
  deleteResponse,
  restoreWithdrawnResponse,
  updateStatus,
  editResponse,
  createReview,
  deleteRejectedResponse,
  deleteAllRejectedResponses,
} from "@/source/entities/response";
import { openChatByOrder } from "@/source/features/chat";
import { copyOrderLink } from "@/source/shared/lib/copyOrderLink";
import { reducer, initial } from "./reducer";

const VALID_TABS: ResponseTabKey[] = ["all", "review", "in_progress", "rejected", "accepted", "withdrawn_by_expert"];

const TAB_LABELS: Record<UserRole, Array<{ key: ResponseTabKey; label: string }>> = {
  expert: [
    { key: "all", label: "Все" },
    { key: "review", label: "На рассмотрении" },
    { key: "in_progress", label: "В работе" },
    { key: "rejected", label: "Отклоненные" },
    { key: "accepted", label: "В переговорах" },
    { key: "withdrawn_by_expert", label: "Отозванные мной" },
  ],
  customer: [
    { key: "all", label: "Все" },
    { key: "review", label: "Новые" },
    { key: "in_progress", label: "В работе" },
    { key: "rejected", label: "Отклоненные" },
    { key: "accepted", label: "В переговорах" },
  ],
};

type ActionMode = "withdraw" | "start" | "complete" | "chat" | "reject" | "accept" | "select" | "restore";

export function useResponses(role: UserRole | null) {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") as ResponseTabKey | null;
  const [s, d] = useReducer(
    reducer,
    initialTab && VALID_TABS.includes(initialTab) ? { ...initial, activeTab: initialTab } : initial,
  );
  const router = useRouter();
  const { showError } = useNotifications();
  const toast = (e: unknown, fallback = "Ошибка") =>
    showError(e instanceof Error ? e.message : fallback);

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
      toast(e, "Ошибка загрузки");
    } finally {
      d({ type: "LOADING_MORE", value: false });
    }
  };

  useEffect(() => {
    if (!role) return;
    void reload();
  }, [role, s.activeTab, s.sortBy, s.sortDir]);

  const tabs = role
    ? TAB_LABELS[role].map((t) => ({ id: t.key, label: t.label, count: s.counters[t.key] }))
    : [];

  const runAction = async (id: number, mode: ActionMode, action: () => Promise<void>) => {
    d({ type: "ACTION_LOADING", id, mode });
    try {
      await action();
    } catch (e) {
      toast(e);
    } finally {
      d({ type: "ACTION_LOADING", id, mode: null });
    }
  };

  const statusAction = (id: number, mode: ActionMode, status: string) =>
    runAction(id, mode, async () => {
      await updateStatus(id, status);
      void reload();
    });

  const onChat = (rid: number, oid: number, expertId?: number) =>
    runAction(rid, "chat", async () => {
      if (!role) return;
      const detail = await openChatByOrder(oid, role === "customer" ? expertId : undefined);
      router.push(`/chat/${detail.uuid}`);
    });

  const onWithdrawConfirm = () => {
    const target = s.withdrawTarget;
    if (!target) return;
    return runAction(target.id, "withdraw", async () => {
      await deleteResponse(target.id);
      d({ type: "WITHDRAW_TARGET", value: null });
      void reload();
    });
  };

  const onEditSubmit = async (formData: { comment: string; costEstimate: number; startDate: string; deadline: string; vatKind: string; files?: File[]; keepFiles?: string[] }) => {
    if (!s.editing) return;
    d({ type: "EDIT_SUBMITTING", value: true });
    try {
      await editResponse(s.editing.id, {
        comment: formData.comment,
        sumAmount: formData.costEstimate,
        startDate: formData.startDate,
        deadline: formData.deadline,
        vatKind: formData.vatKind,
        files: formData.files,
        keepFiles: formData.keepFiles,
      });
      d({ type: "EDITING", value: null });
      void reload();
    } catch (e) {
      toast(e);
    } finally {
      d({ type: "EDIT_SUBMITTING", value: false });
    }
  };

  const onAccept = (id: number, oid: number, expertId?: number) =>
    runAction(id, "accept", async () => {
      await updateStatus(id, "ACCEPTED");
      void onChat(id, oid, expertId);
    });

  const onComplete = (id: number) =>
    runAction(id, "complete", async () => {
      await updateStatus(id, "COMPLETED");
      if (role === "customer") {
        d({ type: "REVIEW_TARGET", value: s.items.find((i) => i.id === id) ?? null });
        d({ type: "COMPLETION_MODAL", value: true });
      }
      void reload();
    });

  const onSubmitReview = async (payload: { rating: number; comment: string }) => {
    if (!s.reviewTarget) return;
    try {
      await createReview({ response_id: s.reviewTarget.id, ...payload });
      d({ type: "REVIEW_MODAL", value: false });
      d({ type: "COMPLETION_MODAL", value: false });
      void reload();
    } catch (e) {
      toast(e);
    }
  };

  const onRejectConfirm = (reason: string) => {
    const target = s.rejectTarget;
    if (!target) return;
    return runAction(target.id, "reject", async () => {
      await updateStatus(target.id, "REJECTED", reason || undefined);
      d({ type: "REJECT_TARGET", value: null });
      void reload();
    });
  };

  const onDeleteRejectedConfirm = async () => {
    const target = s.deleteRejectedTarget;
    if (target === null) return;
    d({ type: "DELETE_REJECTED_LOADING", value: true });
    try {
      if (target === "all") {
        await deleteAllRejectedResponses();
      } else {
        await deleteRejectedResponse(target.id);
      }
      d({ type: "DELETE_REJECTED_TARGET", value: null });
      void reload();
    } catch (e) {
      toast(e);
    } finally {
      d({ type: "DELETE_REJECTED_LOADING", value: false });
    }
  };

  return {
    ...s, role, tabs, reload, loadMore, onChat, onComplete,
    setTab: (tab: ResponseTabKey) => d({ type: "TAB", tab }),
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
    onRestoreWithdrawn: (id: number) =>
      runAction(id, "restore", async () => {
        await restoreWithdrawnResponse(id);
        void reload();
      }),
    onDeleteRejected: (id: number) =>
      d({ type: "DELETE_REJECTED_TARGET", value: s.items.find((item) => item.id === id) ?? null }),
    onDeleteAllRejected: () => d({ type: "DELETE_REJECTED_TARGET", value: "all" }),
    closeDeleteRejected: () => d({ type: "DELETE_REJECTED_TARGET", value: null }),
    onDeleteRejectedConfirm,
    onAccept,
    onLeaveReview: (r: ResponseCardData) => { d({ type: "REVIEW_TARGET", value: r }); d({ type: "REVIEW_MODAL", value: true }); },
    closeCompletion: () => d({ type: "COMPLETION_MODAL", value: false }),
    openReviewFromCompletion: () => { d({ type: "COMPLETION_MODAL", value: false }); d({ type: "REVIEW_MODAL", value: true }); },
    closeReview: () => d({ type: "REVIEW_MODAL", value: false }),
    onSubmitReview,
    setSort: (sortBy: CustomerSortBy | null, sortDir: SortDir | null) => { d({ type: "SORT_BY", value: sortBy }); d({ type: "SORT_DIR", value: sortDir }); },
  };
}

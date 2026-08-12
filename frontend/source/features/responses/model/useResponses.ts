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
  const [state, dispatch] = useReducer(
    reducer,
    initialTab && VALID_TABS.includes(initialTab) ? { ...initial, activeTab: initialTab } : initial,
  );
  const router = useRouter();
  const { showError } = useNotifications();
  const toast = (e: unknown, fallback = "Ошибка") =>
    showError(e instanceof Error ? e.message : fallback);

  const reload = async () => {
    if (!role) return;
    dispatch({ type: "LOADING", value: true });
    dispatch({ type: "ERROR", value: null });
    try {
      const data = await fetchResponses(state.activeTab, state.sortBy ?? "created_at", state.sortDir ?? "desc", 0, 50);
      dispatch({
        type: "DATA",
        items: data.items.map((item) => mapApiToCard(item, role)),
        counters: data.counters,
        hasMore: data.has_more,
      });
    } catch (e) {
      dispatch({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      dispatch({ type: "LOADING", value: false });
    }
  };

  const loadMore = async () => {
    if (!role || state.isLoading || state.isLoadingMore || !state.hasMore) return;
    dispatch({ type: "LOADING_MORE", value: true });
    try {
      const data = await fetchResponses(
        state.activeTab,
        state.sortBy ?? "created_at",
        state.sortDir ?? "desc",
        state.items.length,
        50,
      );
      dispatch({
        type: "APPEND",
        items: data.items.map((item) => mapApiToCard(item, role)),
        hasMore: data.has_more,
      });
    } catch (e) {
      toast(e, "Ошибка загрузки");
    } finally {
      dispatch({ type: "LOADING_MORE", value: false });
    }
  };

  useEffect(() => {
    if (!role) return;
    void reload();
  }, [role, state.activeTab, state.sortBy, state.sortDir]);

  const tabs = role
    ? TAB_LABELS[role].map((t) => ({ id: t.key, label: t.label, count: state.counters[t.key] }))
    : [];

  const runAction = async (id: number, mode: ActionMode, action: () => Promise<void>) => {
    dispatch({ type: "ACTION_LOADING", id, mode });
    try {
      await action();
    } catch (e) {
      toast(e);
    } finally {
      dispatch({ type: "ACTION_LOADING", id, mode: null });
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
    const target = state.withdrawTarget;
    if (!target) return;
    return runAction(target.id, "withdraw", async () => {
      await deleteResponse(target.id);
      dispatch({ type: "WITHDRAW_TARGET", value: null });
      void reload();
    });
  };

  const onEditSubmit = async (formData: { comment: string; costEstimate: number; startDate: string; deadline: string; vatKind: string; files?: File[]; keepFiles?: string[] }) => {
    if (!state.editing) return;
    dispatch({ type: "EDIT_SUBMITTING", value: true });
    try {
      await editResponse(state.editing.id, {
        comment: formData.comment,
        sumAmount: formData.costEstimate,
        startDate: formData.startDate,
        deadline: formData.deadline,
        vatKind: formData.vatKind,
        files: formData.files,
        keepFiles: formData.keepFiles,
      });
      dispatch({ type: "EDITING", value: null });
      void reload();
    } catch (e) {
      toast(e);
    } finally {
      dispatch({ type: "EDIT_SUBMITTING", value: false });
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
        dispatch({ type: "REVIEW_TARGET", value: state.items.find((i) => i.id === id) ?? null });
        dispatch({ type: "COMPLETION_MODAL", value: true });
      }
      void reload();
    });

  const onSubmitReview = async (payload: { rating: number; comment: string }) => {
    if (!state.reviewTarget) return;
    try {
      await createReview({ response_id: state.reviewTarget.id, ...payload });
      dispatch({ type: "REVIEW_MODAL", value: false });
      dispatch({ type: "COMPLETION_MODAL", value: false });
      void reload();
    } catch (e) {
      toast(e);
    }
  };

  const onRejectConfirm = (reason: string) => {
    const target = state.rejectTarget;
    if (!target) return;
    return runAction(target.id, "reject", async () => {
      await updateStatus(target.id, "REJECTED", reason || undefined);
      dispatch({ type: "REJECT_TARGET", value: null });
      void reload();
    });
  };

  const onDeleteRejectedConfirm = async () => {
    const target = state.deleteRejectedTarget;
    if (target === null) return;
    dispatch({ type: "DELETE_REJECTED_LOADING", value: true });
    try {
      if (target === "all") {
        await deleteAllRejectedResponses();
      } else {
        await deleteRejectedResponse(target.id);
      }
      dispatch({ type: "DELETE_REJECTED_TARGET", value: null });
      void reload();
    } catch (e) {
      toast(e);
    } finally {
      dispatch({ type: "DELETE_REJECTED_LOADING", value: false });
    }
  };

  return {
    ...state, role, tabs, reload, loadMore, onChat, onComplete,
    setTab: (tab: ResponseTabKey) => dispatch({ type: "TAB", tab }),
    onShare: (pid: string, cb: () => void) => copyOrderLink(pid, cb),
    onWithdraw: (r: ResponseCardData) => dispatch({ type: "WITHDRAW_TARGET", value: r }),
    onEdit: (r: ResponseCardData) => dispatch({ type: "EDITING", value: r }),
    closeEdit: () => dispatch({ type: "EDITING", value: null }),
    closeWithdraw: () => dispatch({ type: "WITHDRAW_TARGET", value: null }),
    onWithdrawConfirm, onEditSubmit,
    onStart: (id: number) => statusAction(id, "start", "IN_PROGRESS"),
    onReject: (r: ResponseCardData) => dispatch({ type: "REJECT_TARGET", value: r }),
    closeReject: () => dispatch({ type: "REJECT_TARGET", value: null }),
    onRejectConfirm,
    onSelect: (id: number) => statusAction(id, "select", "IN_PROGRESS"),
    onRestore: (id: number) => statusAction(id, "restore", "REVIEW"),
    onRestoreWithdrawn: (id: number) =>
      runAction(id, "restore", async () => {
        await restoreWithdrawnResponse(id);
        void reload();
      }),
    onDeleteRejected: (id: number) =>
      dispatch({ type: "DELETE_REJECTED_TARGET", value: state.items.find((item) => item.id === id) ?? null }),
    onDeleteAllRejected: () => dispatch({ type: "DELETE_REJECTED_TARGET", value: "all" }),
    closeDeleteRejected: () => dispatch({ type: "DELETE_REJECTED_TARGET", value: null }),
    onDeleteRejectedConfirm,
    onAccept,
    onLeaveReview: (r: ResponseCardData) => { dispatch({ type: "REVIEW_TARGET", value: r }); dispatch({ type: "REVIEW_MODAL", value: true }); },
    closeCompletion: () => dispatch({ type: "COMPLETION_MODAL", value: false }),
    openReviewFromCompletion: () => { dispatch({ type: "COMPLETION_MODAL", value: false }); dispatch({ type: "REVIEW_MODAL", value: true }); },
    closeReview: () => dispatch({ type: "REVIEW_MODAL", value: false }),
    onSubmitReview,
    setSort: (sortBy: CustomerSortBy | null, sortDir: SortDir | null) => { dispatch({ type: "SORT_BY", value: sortBy }); dispatch({ type: "SORT_DIR", value: sortDir }); },
  };
}

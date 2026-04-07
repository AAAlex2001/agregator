import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResponsesState } from "@/features/response/shared/model/state";
import { CUSTOMER_TAB_META } from "@/features/response/shared/model/tab-meta";
import type { ResponseCardViewModel, ResponseTabKey } from "@/features/response/shared/model/types";
import {
  fetchCustomerResponses,
  handleStatusUpdate,
  handleOpenChat,
  handleSubmitReview,
} from "./actions";

export function useCustomerResponsesState() {
  const rs = useResponsesState();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ResponseTabKey>("review");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [chatOpeningId, setChatOpeningId] = useState<number | null>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ResponseCardViewModel | null>(null);

  const reload = async () => {
    rs.setLoading(true);
    rs.setError(null);
    try {
      await fetchCustomerResponses(activeTab,
        ({ items, counters }) => { rs.setItems(items); rs.setCounters(counters); },
        (msg) => rs.setError(msg),
      );
    } finally { rs.setLoading(false); }
  };

  useEffect(() => { void reload(); }, [activeTab]);

  const tabs = CUSTOMER_TAB_META.map((m) => ({ ...m, count: rs.counters[m.key] }));
  const activeTabLabel = CUSTOMER_TAB_META.find((t) => t.key === activeTab)?.label ?? "Новые";

  const onStatusUpdate = async (responseId: number, newStatus: "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED") => {
    if (updatingId !== null) return false;
    setUpdatingId(responseId);
    rs.setError(null);
    let ok = false;
    await handleStatusUpdate(responseId, newStatus,
      () => {
        ok = true;
        if (newStatus === "COMPLETED") {
          setReviewTarget(rs.items.find((i) => i.id === responseId) ?? null);
          setIsCompletionModalOpen(true);
        }
      },
      (msg) => rs.setError(msg),
    );
    if (ok) await reload();
    setUpdatingId(null);
    return ok;
  };

  const onOpenChat = async (responseId: number, orderId: number) => {
    setChatOpeningId(responseId);
    await handleOpenChat(orderId, (uuid) => router.push(`/customer/chat/${uuid}`), () => {});
    setChatOpeningId(null);
  };

  return {
    ...rs, activeTab, setActiveTab, tabs, activeTabLabel,
    updatingId, chatOpeningId, reviewTarget, setReviewTarget,
    isCompletionModalOpen, setIsCompletionModalOpen,
    isReviewModalOpen, setIsReviewModalOpen,
    reload,

    onReject: (id: number) => void onStatusUpdate(id, "REJECTED"),
    onSelect: (id: number) => void onStatusUpdate(id, "IN_PROGRESS"),
    onComplete: (id: number) => void onStatusUpdate(id, "COMPLETED"),
    onChat: onOpenChat,
    onAccept: async (responseId: number, orderId: number) => {
      if (await onStatusUpdate(responseId, "ACCEPTED")) await onOpenChat(responseId, orderId);
    },
    onLeaveReview: (r: ResponseCardViewModel) => { setReviewTarget(r); setIsReviewModalOpen(true); },
    onCloseCompletion: () => setIsCompletionModalOpen(false),
    onOpenReviewFromCompletion: () => { if (reviewTarget) { setIsCompletionModalOpen(false); setIsReviewModalOpen(true); } },
    onCloseReview: () => setIsReviewModalOpen(false),
    onSubmitReview: async (payload: { rating: number; comment: string }) => {
      if (!reviewTarget) return;
      await handleSubmitReview(reviewTarget.id, payload,
        () => {
          rs.setItems(rs.items.map((i) => (i.id === reviewTarget.id ? { ...i, hasReview: true } : i)));
          setIsReviewModalOpen(false);
          setIsCompletionModalOpen(false);
          void reload();
        },
        () => {},
      );
    },
  };
}

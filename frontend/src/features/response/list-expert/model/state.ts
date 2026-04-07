import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResponsesState } from "@/features/response/shared/model/state";
import { EXPERT_TAB_META } from "@/features/response/shared/model/tab-meta";
import type { ResponseCardViewModel, ResponseTabKey } from "@/features/response/shared/model/types";
import type { Step2FormData } from "@/features/order/details/ui/OrderDetailsModal/types";
import {
  fetchExpertResponses,
  handleShareResponse,
  handleOpenChat,
  handleWithdrawReview,
  handleStartOrComplete,
  handleEditResponse,
  buildEditOrderDetails,
  buildEditInitialData,
  buildWithdrawProps,
} from "./actions";

export { useResponsesState } from "@/features/response/shared/model/state";

type ActionMode = "withdraw" | "start" | "complete" | "chat" | null;

export function useExpertResponsesState() {
  const rs = useResponsesState();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ResponseTabKey>("review");
  const [actionLoading, setActionLoadingMap] = useState<Record<number, ActionMode>>({});
  const [editingResponse, setEditingResponse] = useState<ResponseCardViewModel | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState<ResponseCardViewModel | null>(null);

  const setAction = (id: number, mode: ActionMode) =>
    setActionLoadingMap((prev) => ({ ...prev, [id]: mode }));

  const reload = async () => {
    rs.setLoading(true);
    rs.setError(null);
    try {
      await fetchExpertResponses(activeTab,
        ({ items, counters }) => { rs.setItems(items); rs.setCounters(counters); },
        (msg) => rs.setError(msg),
      );
    } finally { rs.setLoading(false); }
  };

  useEffect(() => { void reload(); }, [activeTab]);

  const tabs = EXPERT_TAB_META.map((m) => ({ ...m, count: rs.counters[m.key] }));
  const activeTabLabel = EXPERT_TAB_META.find((t) => t.key === activeTab)?.label ?? "На рассмотрении";

  return {
    ...rs, activeTab, setActiveTab, tabs, activeTabLabel,
    actionLoading, editingResponse, setEditingResponse,
    isEditSubmitting, withdrawTarget, setWithdrawTarget,
    reload,

    editOrderDetails: editingResponse ? buildEditOrderDetails(editingResponse) : null,
    editInitialData: editingResponse ? buildEditInitialData(editingResponse) : undefined,
    withdrawProps: buildWithdrawProps(withdrawTarget),

    onShare: (publicId: string, onCopied: () => void) => handleShareResponse(publicId, onCopied),

    onChat: (rid: number, oid: number) => {
      setAction(rid, "chat");
      void handleOpenChat(oid,
        (uuid) => { setAction(rid, null); router.push(`/expert/chat/${uuid}`); },
        (msg) => { setAction(rid, null); rs.setError(msg); },
      );
    },

    onStart: (id: number) => {
      setAction(id, "start");
      void handleStartOrComplete(id, false,
        () => { setAction(id, null); void reload(); },
        (msg) => { setAction(id, null); rs.setError(msg); },
      );
    },

    onComplete: (id: number) => {
      setAction(id, "complete");
      void handleStartOrComplete(id, true,
        () => { setAction(id, null); void reload(); },
        (msg) => { setAction(id, null); rs.setError(msg); },
      );
    },

    onWithdrawConfirm: () => {
      if (!withdrawTarget) return;
      const wid = withdrawTarget.id;
      setAction(wid, "withdraw");
      void handleWithdrawReview(wid,
        () => { setAction(wid, null); setWithdrawTarget(null); void reload(); },
        (msg) => { setAction(wid, null); rs.setError(msg); },
      );
    },

    onEditSubmit: (_order: unknown, formData: Step2FormData) => {
      if (!editingResponse) return;
      setIsEditSubmitting(true);
      void handleEditResponse(editingResponse.id, formData,
        () => { setIsEditSubmitting(false); setEditingResponse(null); void reload(); },
        (msg) => { setIsEditSubmitting(false); rs.setError(msg); },
      );
    },
  };
}

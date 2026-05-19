"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { copyOrderLink } from "@/shared/lib/copyOrderLink";
import { fetchOrders, respondToOrder } from "../api/expert-orders.api";
import type { RespondFormData } from "../ui/OrderModal";
import { reducer, initial } from "./reducer";
import { deleteDraft } from "./responseDraft";

const PAGE = 50;

export function useExpertOrders() {
  const [s, d] = useReducer(reducer, initial);
  const { user } = useSession();
  const router = useRouter();
  const { showError } = useNotifications();
  const loadingMoreRef = useRef(false);
  const [useDraft, setUseDraft] = useState(false);

  const [returnOrderId] = useState(() =>
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("orderId") : null,
  );

  const reload = async () => {
    d({ type: "LOADING", value: true });
    try {
      const data = await fetchOrders(0, PAGE);
      d({ type: "DATA", items: data.items.map(mapApiToOrderCard), hasMore: data.has_more });
    } catch (e) {
      showError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      d({ type: "LOADING", value: false });
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    if (!returnOrderId || s.items.length === 0) return;
    const found = s.items.find((item) => String(item.id) === returnOrderId);
    if (!found) return;
    setUseDraft(false);
    d({ type: "SELECT", order: found });
  }, [returnOrderId, s.items]);

  const hasMore = s.hasMore;

  const loadMore = async () => {
    if (s.isLoading || s.isLoadingMore || loadingMoreRef.current || !hasMore) return;
    loadingMoreRef.current = true;
    d({ type: "LOADING_MORE", value: true });
    try {
      const data = await fetchOrders(s.items.length, PAGE);
      d({ type: "APPEND", items: data.items.map(mapApiToOrderCard), hasMore: data.has_more });
    } catch (e) {
      showError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      loadingMoreRef.current = false;
      d({ type: "LOADING_MORE", value: false });
    }
  };

  const openDetails = (order: OrderCardData) => {
    setUseDraft(false);
    d({ type: "SELECT", order });
  };

  const openRespond = (order: OrderCardData) => {
    setUseDraft(false);
    d({ type: "SELECT", order });
  };

  const continueDraft = (order: OrderCardData) => {
    setUseDraft(true);
    d({ type: "SELECT", order });
  };

  const closeModal = () => {
    setUseDraft(false);
    d({ type: "SELECT", order: null });
  };

  const onShare = (publicId: string, onCopied: () => void) => copyOrderLink(publicId, onCopied);

  const onRespond = async (order: OrderCardData, form: RespondFormData) => {
    d({ type: "RESPONDING", value: true });
    try {
      await respondToOrder(order.id, {
        comment: form.comment,
        proposed_sum_amount: form.costAmount,
        proposed_start_date: form.startDate || undefined,
        proposed_deadline: form.deadline,
        vat_kind: form.vatKind,
        expert_inn: form.expertInn,
        expert_company_data: form.expertCompanyData,
        files: form.files,
      });
      deleteDraft(order.id);
      d({ type: "REMOVE", id: order.id });
      closeModal();
      router.push("/responses");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Ошибка";
      showError(message);
      if (message.toLowerCase().includes("подписк") || message.includes("402")) {
        router.push("/settings?section=subscription");
      }
    } finally {
      d({ type: "RESPONDING", value: false });
    }
  };

  return {
    ...s,
    returnOrderId,
    hasMore,
    useDraft,
    reload,
    loadMore,
    openDetails,
    openRespond,
    continueDraft,
    closeModal,
    onShare,
    onRespond,
  };
}

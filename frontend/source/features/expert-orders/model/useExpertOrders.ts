"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/features/session";
import { copyOrderLink } from "@/shared/lib/copyOrderLink";
import { fetchOrders, respondToOrder, createPayment } from "../api/expert-orders.api";
import { useOrdersWs } from "../lib/useOrdersWs";
import { reducer, initial } from "./reducer";
import type { Step2FormData } from "@/features/order/details/ui/OrderDetailsModal/types";

type ModalStep = "details" | "step1";

const PAGE = 50;

export function useExpertOrders() {
  const [s, d] = useReducer(reducer, initial);
  const { user } = useSession();
  const balance = user?.balance ?? 0;
  const loadingMoreRef = useRef(false);
  const [pendingStep, setPendingStep] = useState<ModalStep>("details");

  const [returnOrderId] = useState(() =>
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("orderId") : null,
  );

  // WebSocket
  useOrdersWs({
    onCreated: (raw) => d({ type: "PREPEND", item: mapApiToOrderCard(raw) }),
    onUpdated: (raw) => d({ type: "UPDATE", item: mapApiToOrderCard(raw) }),
    onRemoved: (id) => d({ type: "REMOVE", id }),
  });

  // Initial fetch
  const reload = async () => {
    d({ type: "LOADING", value: true });
    d({ type: "ERROR", value: null });
    try {
      const data = await fetchOrders(0, PAGE);
      d({ type: "DATA", items: data.items.map(mapApiToOrderCard), total: data.total });
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      d({ type: "LOADING", value: false });
    }
  };

  useEffect(() => { void reload(); }, []);

  // Deep-link: auto-select order after payment return
  useEffect(() => {
    if (!returnOrderId || s.items.length === 0) return;
    const found = s.items.find((i) => String(i.id) === returnOrderId);
    if (found) {
      setPendingStep("step1");
      d({ type: "SELECT", order: found });
    }
  }, [returnOrderId, s.items]);

  const hasMore = s.items.length < s.total;

  const loadMore = async () => {
    if (s.isLoading || s.isLoadingMore || loadingMoreRef.current || !hasMore) return;
    loadingMoreRef.current = true;
    d({ type: "LOADING_MORE", value: true });
    try {
      const data = await fetchOrders(s.items.length, PAGE);
      d({ type: "APPEND", items: data.items.map(mapApiToOrderCard), total: data.total });
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      loadingMoreRef.current = false;
      d({ type: "LOADING_MORE", value: false });
    }
  };

  const openDetails = (order: OrderCardData) => {
    setPendingStep("details");
    d({ type: "SELECT", order });
  };

  const openRespond = (order: OrderCardData) => {
    setPendingStep("step1");
    d({ type: "SELECT", order });
  };

  const closeModal = () => {
    setPendingStep("details");
    d({ type: "SELECT", order: null });
  };

  const onShare = (publicId: string, onCopied: () => void) => copyOrderLink(publicId, onCopied);

  const onRespond = async (order: { id: number }, form: Step2FormData) => {
    d({ type: "RESPONDING", value: true });
    try {
      await respondToOrder(order.id, {
        comment: form.comment,
        proposed_sum_amount: form.costEstimate,
        proposed_deadline: form.deadline,
        files: form.files,
      });
      d({ type: "REMOVE", id: order.id });
      closeModal();
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка" });
    } finally {
      d({ type: "RESPONDING", value: false });
    }
  };

  const onTopUp = async (amount: number) => {
    if (!s.selectedOrder) return;
    const returnUrl = `${window.location.origin}/expert/orders?orderId=${s.selectedOrder.id}`;
    try {
      const { confirmation_url } = await createPayment(amount, returnUrl);
      window.location.href = confirmation_url;
    } catch {
      window.location.href = `/settings?section=finance&returnOrderId=${s.selectedOrder.id}`;
    }
  };

  return {
    ...s, balance, returnOrderId, hasMore, pendingStep,
    reload, loadMore, openDetails, openRespond, closeModal, onShare, onRespond, onTopUp,
  };
}

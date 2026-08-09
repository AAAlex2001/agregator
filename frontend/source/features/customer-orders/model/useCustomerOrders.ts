"use client";

import { useEffect, useReducer, useState } from "react";
import { mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { fetchCustomerOrders, createOrder, updateOrder, deleteOrder } from "@/source/entities/order";
import { buildCreatePayload, buildUpdatePayload } from "./mappers";
import { reducer, initial } from "./reducer";
import type { OrderFormValues } from "./orderForm";
import type { DocumentsFormState } from "./formFiles";
import { clearDraft, loadDraft } from "./orderDraft";

export function useCustomerOrders() {
  const [s, d] = useReducer(reducer, initial);
  const [draft, setDraft] = useState<OrderFormValues | null>(null);

  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  const { user } = useSession();
  const { showSuccess, showError } = useNotifications();

  const reload = async (requestedCount = 50) => {
    d({ type: "LOADING", value: true });
    d({ type: "ERROR", value: null });
    try {
      const items: OrderCardData[] = [];
      let hasMore = true;
      while (items.length < requestedCount && hasMore) {
        const data = await fetchCustomerOrders(items.length, Math.min(100, requestedCount - items.length));
        items.push(...data.items.map(mapApiToOrderCard));
        hasMore = data.has_more;
      }
      d({ type: "DATA", items, hasMore });
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      d({ type: "LOADING", value: false });
    }
  };

  const loadMore = async () => {
    if (s.isLoading || s.isLoadingMore || !s.hasMore) return;
    d({ type: "LOADING_MORE", value: true });
    try {
      const data = await fetchCustomerOrders(s.items.length, 50);
      d({ type: "APPEND", items: data.items.map(mapApiToOrderCard), hasMore: data.has_more });
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      d({ type: "LOADING_MORE", value: false });
    }
  };

  useEffect(() => { void reload(); }, []);

  const openCreate = () => d({ type: "MODE", mode: "create" });
  const openEdit = (order: OrderCardData) => d({ type: "MODE", mode: "edit", editTarget: order });
  const backToList = () => d({ type: "MODE", mode: "list" });

  const onCreate = async (values: OrderFormValues, documents: DocumentsFormState) => {
    d({ type: "SUBMITTING", value: true });
    try {
      await createOrder(buildCreatePayload(values, documents, user?.id ?? 0));
      showSuccess("Заказ создан");
      setDraft(null);
      backToList();
      await reload(Math.max(50, s.items.length));
    } catch (e) {
      showError(e instanceof Error ? e.message : "Ошибка создания");
    } finally {
      d({ type: "SUBMITTING", value: false });
    }
  };

  const onUpdate = async (
    values: OrderFormValues,
    documents: DocumentsFormState,
    options: { notifyResponders: boolean },
  ) => {
    if (!s.editTarget) return;
    d({ type: "SUBMITTING", value: true });
    try {
      await updateOrder(
        s.editTarget.id,
        buildUpdatePayload(values, documents, options.notifyResponders),
      );
      showSuccess("Заказ обновлён");
      await reload(Math.max(50, s.items.length));
      backToList();
    } catch (e) {
      showError(e instanceof Error ? e.message : "Ошибка обновления");
    } finally {
      d({ type: "SUBMITTING", value: false });
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот заказ?")) return;
    d({ type: "DELETING", id });
    try {
      await deleteOrder(id);
      showSuccess("Заказ удалён");
      void reload();
    } catch (e) {
      showError(e instanceof Error ? e.message : "Ошибка удаления");
    } finally {
      d({ type: "DELETING", id: null });
    }
  };

  const dismissDraft = () => {
    clearDraft();
    setDraft(null);
  };

  return {
    ...s,
    customerId: user?.id ?? 0,
    draft,
    reload,
    loadMore,
    openCreate,
    openEdit,
    backToList,
    onCreate,
    onUpdate,
    onDelete,
    dismissDraft,
  };
}

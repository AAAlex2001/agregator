"use client";

import { useEffect, useReducer } from "react";
import { mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/shared/ui/Notifications";
import { fetchCustomerOrders, createOrder, updateOrder, deleteOrder } from "../api/customer-orders.api";
import { buildCreatePayload, buildUpdatePayload } from "./mappers";
import { reducer, initial } from "./reducer";
import type { OrderFormValues } from "./schema";
import { hasDraft } from "./orderDraft";

export function useCustomerOrders() {
  const [s, d] = useReducer(reducer, initial);

  useEffect(() => {
    if (hasDraft()) d({ type: "MODE", mode: "create" });
  }, []);
  const { user } = useSession();
  const { showSuccess, showError } = useNotifications();

  const reload = async () => {
    d({ type: "LOADING", value: true });
    d({ type: "ERROR", value: null });
    try {
      const data = await fetchCustomerOrders();
      d({ type: "DATA", items: data.items.map(mapApiToOrderCard), total: data.total });
    } catch (e) {
      d({ type: "ERROR", value: e instanceof Error ? e.message : "Ошибка загрузки" });
    } finally {
      d({ type: "LOADING", value: false });
    }
  };

  useEffect(() => { void reload(); }, []);

  const openCreate = () => d({ type: "MODE", mode: "create" });
  const openEdit = (order: OrderCardData) => d({ type: "MODE", mode: "edit", editTarget: order });
  const backToList = () => d({ type: "MODE", mode: "list" });

  const onCreate = async (values: OrderFormValues, files: File[]) => {
    d({ type: "SUBMITTING", value: true });
    try {
      await createOrder(buildCreatePayload(values, files, user?.id ?? 0));
      showSuccess("Заказ создан");
      backToList();
      void reload();
    } catch (e) {
      showError(e instanceof Error ? e.message : "Ошибка создания");
    } finally {
      d({ type: "SUBMITTING", value: false });
    }
  };

  const onUpdate = async (values: OrderFormValues, files: File[], keepFiles: string[]) => {
    if (!s.editTarget) return;
    d({ type: "SUBMITTING", value: true });
    try {
      await updateOrder(s.editTarget.id, buildUpdatePayload(values, files, keepFiles));
      showSuccess("Заказ обновлён");
      backToList();
      void reload();
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

  return { ...s, reload, openCreate, openEdit, backToList, onCreate, onUpdate, onDelete };
}

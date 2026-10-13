"use client";

import { useReducer, useState, type FormEvent } from "react";
import {
  countDocuments,
  createOrder,
  MAX_ORDER_DOCUMENTS,
  MAX_ORDER_FILES_TOTAL_BYTES,
  orderNewFiles,
  updateOrder,
  type OrderCardData,
  type SingleDocumentCategory,
} from "@/source/entities/order";
import { useSession } from "@/source/entities/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { toOrderDocuments, toOrderPayload } from "./payload";
import { initOrderForm, orderFormReducer } from "./reducer";
import type { OrderFormState } from "./types";

const MAX_TOTAL_MB = Math.round(MAX_ORDER_FILES_TOTAL_BYTES / 1024 / 1024);

interface UseOrderFormOptions {
  editTarget?: OrderCardData;
  copyTemplate?: OrderCardData;
  onSaved: () => void;
}

export function filesCount(state: OrderFormState): number {
  return countDocuments(state.documents) + orderNewFiles(state.files).length;
}

export function filesBytes(state: OrderFormState): number {
  return orderNewFiles(state.files).reduce((sum, file) => sum + file.size, 0);
}

function problem(state: OrderFormState): string {
  if (!state.startDate) return "Укажите срок начала выполнения работ";
  if (!state.deadline) return "Укажите срок окончания выполнения работ";
  if (!state.requiresExpert && !state.requiresLicense) return "Выберите, что требуется: исполнитель и/или лицензия";
  if (state.workType === "DESIGN" && filesCount(state) === 0) return "Приложите задание на проектирование";
  return "";
}

/** Форма заказа: заполнение, лимиты файлов, создание или обновление. */
export function useOrderForm({ editTarget, copyTemplate, onSaved }: UseOrderFormOptions) {
  const isEdit = Boolean(editTarget);
  const { showError, showSuccess } = useNotifications();
  const { user } = useSession();
  const [state, dispatch] = useReducer(
    orderFormReducer,
    { template: copyTemplate ?? editTarget, copySourceOrderId: copyTemplate?.id ?? null, user },
    initOrderForm,
  );
  const [isSaving, setIsSaving] = useState(false);

  const addFile = (category: SingleDocumentCategory, file: File) => {
    const replaces = state.documents[category].length > 0 || state.files[category] !== null;
    if (!replaces && filesCount(state) >= MAX_ORDER_DOCUMENTS) return showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
    if (filesBytes(state) + file.size > MAX_ORDER_FILES_TOTAL_BYTES) return showError(`Суммарный размер новых файлов не должен превышать ${MAX_TOTAL_MB} МБ`);
    dispatch({ type: "file", category, file });
  };

  const addOtherFiles = (picked: File[]) => {
    const free = MAX_ORDER_DOCUMENTS - filesCount(state);
    if (picked.length > free) showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
    const accepted = picked.slice(0, free);
    if (filesBytes(state) + accepted.reduce((sum, file) => sum + file.size, 0) > MAX_ORDER_FILES_TOTAL_BYTES) {
      return showError(`Суммарный размер новых файлов не должен превышать ${MAX_TOTAL_MB} МБ`);
    }
    if (accepted.length > 0) dispatch({ type: "otherFiles", files: accepted });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const message = problem(state);
    if (message) return showError(message);
    setIsSaving(true);
    try {
      if (editTarget) await updateOrder(editTarget.id, toOrderPayload(state), toOrderDocuments(state), state.notifyResponders);
      else await createOrder(user?.id ?? 0, toOrderPayload(state), toOrderDocuments(state));
      showSuccess(editTarget ? "Заказ обновлён" : "Заказ создан");
      onSaved();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить заказ");
    } finally {
      setIsSaving(false);
    }
  };

  return { isEdit, state, dispatch, isSaving, addFile, addOtherFiles, submit };
}

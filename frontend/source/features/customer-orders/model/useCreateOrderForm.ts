"use client";

import { useEffect, useReducer, type FormEvent } from "react";
import type { OrderCardData } from "@/source/entities/order";
import { MAX_ORDER_DOCUMENTS, MAX_ORDER_FILES_TOTAL_BYTES, ORDER_WORK_OPTIONS } from "@/source/entities/order";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useSession } from "@/source/features/session";
import { clearDraft, saveDraft } from "./orderDraft";
import { freeSlots, singleSlotIsFilled, totalNewFilesBytes, type DocumentsFormState } from "@/source/entities/order";
import { initOrderForm, orderFormValues, reducer, type OrderFormValues, type SingleCategory } from "./orderForm";

const MAX_TOTAL_MB = Math.round(MAX_ORDER_FILES_TOTAL_BYTES / 1024 / 1024);

interface Props {
  editTarget?: OrderCardData;
  copyTemplate?: OrderCardData;
  onSubmit: (values: OrderFormValues, documents: DocumentsFormState, options: { notifyResponders: boolean }) => void;
}

export function useCreateOrderForm({ editTarget, copyTemplate, onSubmit }: Props) {
  const isEdit = Boolean(editTarget);
  const { showError } = useNotifications();
  const { user } = useSession();
  const [state, dispatch] = useReducer(reducer, { editTarget, copyTemplate }, initOrderForm);

  const company = user?.company_data?.value ?? "";
  useEffect(() => {
    if (company) dispatch({ type: "set", key: "company", value: company });
  }, [company]);

  const directions = (user?.directions ?? []).join(",");
  useEffect(() => {
    if (isEdit || !directions) return;
    const available = directions.split(",");
    if (available.includes(state.workType)) return;
    const first = ORDER_WORK_OPTIONS.find((option) => available.includes(option.value));
    if (first) dispatch({ type: "workType", value: first.value });
  }, [isEdit, directions, state.workType]);

  useEffect(() => {
    if (isEdit) return;
    saveDraft(orderFormValues(state));
  }, [state, isEdit]);

  const setSingle = (category: SingleCategory, file: File | null) => {
    const slotWasEmpty = !singleSlotIsFilled(state.documents[category]);
    if (file !== null && slotWasEmpty && freeSlots(state.documents) <= 0) {
      showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
      return;
    }
    if (file !== null && totalNewFilesBytes(state.documents) + file.size > MAX_ORDER_FILES_TOTAL_BYTES) {
      showError(`Суммарный размер новых файлов не должен превышать ${MAX_TOTAL_MB} МБ`);
      return;
    }
    dispatch({ type: "docSingle", category, file });
  };

  const addOther = (incoming: File[]) => {
    const free = freeSlots(state.documents);
    if (free <= 0) {
      showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
      return;
    }
    const trimmed = incoming.slice(0, free);
    if (trimmed.length < incoming.length) {
      showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
    }
    const accepted: File[] = [];
    let runningBytes = totalNewFilesBytes(state.documents);
    let rejectedBySize = false;
    for (const file of trimmed) {
      if (runningBytes + file.size > MAX_ORDER_FILES_TOTAL_BYTES) {
        rejectedBySize = true;
        continue;
      }
      runningBytes += file.size;
      accepted.push(file);
    }
    if (rejectedBySize) {
      showError(`Суммарный размер новых файлов не должен превышать ${MAX_TOTAL_MB} МБ`);
    }
    if (accepted.length > 0) {
      dispatch({ type: "docAddOther", files: accepted });
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!state.startDate) {
      showError("Укажите срок начала выполнения работ");
      return;
    }
    if (!state.deadline) {
      showError("Укажите срок окончания выполнения работ");
      return;
    }
    if (!state.requiresExpert && !state.requiresLicense) {
      showError("Выберите, что требуется: исполнитель и/или лицензия");
      return;
    }
    onSubmit(orderFormValues(state), state.documents, { notifyResponders: state.notifyResponders });
    if (!isEdit) clearDraft();
  };

  return { isEdit, state, dispatch, submit, setSingle, addOther };
}

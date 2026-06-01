"use client";

import { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OrderCardData } from "@/source/entities/order";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { clearDraft, loadDraft, saveDraft } from "./orderDraft";
import {
  documentsFormReducer,
  initialDocumentsFormState,
  freeSlots,
  singleSlotIsFilled,
  totalNewFilesBytes,
  type DocumentsFormState,
} from "./formFiles";
import { MAX_ORDER_DOCUMENTS, MAX_ORDER_FILES_TOTAL_BYTES } from "@/source/entities/order";
import { getDefaultValues } from "./mappers";
import { orderFormSchema, type OrderFormValues } from "./schema";

const MAX_TOTAL_MB = Math.round(MAX_ORDER_FILES_TOTAL_BYTES / 1024 / 1024);

interface Props {
  editTarget?: OrderCardData;
  onSubmit: (values: OrderFormValues, documents: DocumentsFormState, options: { notifyResponders: boolean }) => void;
}

function wouldExceedTotalSize(state: DocumentsFormState, incomingBytes: number): boolean {
  return totalNewFilesBytes(state) + incomingBytes > MAX_ORDER_FILES_TOTAL_BYTES;
}

export function useCreateOrderForm({ editTarget, onSubmit }: Props) {
  const isEdit = Boolean(editTarget);
  const { showError } = useNotifications();
  const [documents, dispatch] = useReducer(
    documentsFormReducer,
    initialDocumentsFormState(editTarget?.documents),
  );
  const [notifyResponders, setNotifyResponders] = useState(true);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: isEdit ? getDefaultValues(editTarget) : { ...getDefaultValues(), ...(loadDraft() ?? {}) },
  });

  useEffect(() => {
    if (isEdit) return;
    const subscription = form.watch((values) => saveDraft(values as OrderFormValues));
    return () => subscription.unsubscribe();
  }, [form, isEdit]);

  const setSingle = (category: "technical" | "contract" | "company", file: File | null) => {
    const slotWasEmpty = !singleSlotIsFilled(documents[category]);
    if (file !== null && slotWasEmpty && freeSlots(documents) <= 0) {
      showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
      return;
    }
    if (file !== null && wouldExceedTotalSize(documents, file.size)) {
      showError(`Суммарный размер новых файлов не должен превышать ${MAX_TOTAL_MB} МБ`);
      return;
    }
    dispatch({ type: "SET_SINGLE", category, file });
  };

  const removeSingleExisting = (category: "technical" | "contract" | "company") => {
    dispatch({ type: "REMOVE_SINGLE_EXISTING", category });
  };

  const addOther = (incoming: File[]) => {
    const free = freeSlots(documents);
    if (free <= 0) {
      showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
      return;
    }
    const trimmed = incoming.slice(0, free);
    if (trimmed.length < incoming.length) {
      showError(`Можно прикрепить не более ${MAX_ORDER_DOCUMENTS} файлов`);
    }
    const accepted: File[] = [];
    let runningBytes = totalNewFilesBytes(documents);
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
      dispatch({ type: "ADD_OTHER", files: accepted });
    }
  };

  const removeOtherNew = (index: number) => dispatch({ type: "REMOVE_OTHER_NEW", index });
  const removeOtherExisting = (index: number) => dispatch({ type: "REMOVE_OTHER_EXISTING", index });

  const submit = form.handleSubmit(
    (values) => {
      onSubmit(values, documents, { notifyResponders });
      if (!isEdit) clearDraft();
    },
    (errors) => {
      Object.values(errors).forEach((error) => {
        if (error && "message" in error && typeof error.message === "string") {
          showError(error.message);
        }
      });
    },
  );

  return {
    isEdit,
    form,
    submit,
    documents,
    setSingle,
    removeSingleExisting,
    addOther,
    removeOtherNew,
    removeOtherExisting,
    notifyResponders,
    setNotifyResponders,
  };
}

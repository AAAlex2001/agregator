"use client";

import { useEffect, useReducer } from "react";
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
  type DocumentsFormState,
} from "./formFiles";
import { MAX_ORDER_DOCUMENTS } from "@/source/entities/order";
import { getDefaultValues } from "./mappers";
import { orderFormSchema, type OrderFormValues } from "./schema";

interface Props {
  editTarget?: OrderCardData;
  onSubmit: (values: OrderFormValues, documents: DocumentsFormState) => void;
}

export function useCreateOrderForm({ editTarget, onSubmit }: Props) {
  const isEdit = Boolean(editTarget);
  const { showError } = useNotifications();
  const [documents, dispatch] = useReducer(
    documentsFormReducer,
    initialDocumentsFormState(editTarget?.documents),
  );

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: isEdit ? getDefaultValues(editTarget) : (loadDraft() ?? getDefaultValues()),
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
    dispatch({ type: "ADD_OTHER", files: trimmed });
  };

  const removeOtherNew = (index: number) => dispatch({ type: "REMOVE_OTHER_NEW", index });
  const removeOtherExisting = (index: number) => dispatch({ type: "REMOVE_OTHER_EXISTING", index });

  const submit = form.handleSubmit(
    (values) => {
      onSubmit(values, documents);
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
  };
}

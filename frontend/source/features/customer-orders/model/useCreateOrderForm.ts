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
  canAddMoreOther,
  type DocumentsFormState,
} from "./formFiles";
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
    dispatch({ type: "SET_SINGLE", category, file });
  };

  const removeSingleExisting = (category: "technical" | "contract" | "company") => {
    dispatch({ type: "REMOVE_SINGLE_EXISTING", category });
  };

  const addOther = (incoming: File[]) => {
    const free = canAddMoreOther(documents);
    if (!free) {
      showError("Достигнут общий лимит файлов");
      return;
    }
    dispatch({ type: "ADD_OTHER", files: incoming });
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

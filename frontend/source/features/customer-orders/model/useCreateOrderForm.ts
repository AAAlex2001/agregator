"use client";

import { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DropzoneOptions } from "react-dropzone";
import type { OrderCardData } from "@/source/entities/order";
import { mergeFilesWithLimits } from "@/shared/lib/fileUploadValidation";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { clearDraft, loadDraft, saveDraft } from "./orderDraft";
import { createInitialFormFilesState, formFilesReducer } from "./formReducer";
import { getDefaultValues } from "./mappers";
import { orderFormSchema, type OrderFormValues } from "./schema";

interface Props {
  editTarget?: OrderCardData;
  onSubmit: (values: OrderFormValues, files: File[], keepFiles?: string[]) => void;
}

export function useCreateOrderForm({ editTarget, onSubmit }: Props) {
  const isEdit = Boolean(editTarget);
  const { showError } = useNotifications();
  const [fileState, dispatch] = useReducer(
    formFilesReducer,
    createInitialFormFilesState(editTarget?.technicalFiles),
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

  const dropzoneOptions: DropzoneOptions = {
    noKeyboard: true,
    multiple: true,
    maxFiles: 6,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    onDrop: (acceptedFiles) => {
      const result = mergeFilesWithLimits(fileState.files, acceptedFiles);
      if (result.errorMessage) {
        showError(result.errorMessage);
        return;
      }
      dispatch({ type: "ADD_FILES", files: result.nextFiles });
    },
  };

  const submit = form.handleSubmit(
    (values) => {
      onSubmit(values, fileState.files, isEdit ? fileState.keepFiles : undefined);
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
    files: fileState.files,
    keepFiles: fileState.keepFiles,
    removeFile: (index: number) => dispatch({ type: "REMOVE_FILE", index }),
    removeExistingFile: (index: number) => dispatch({ type: "REMOVE_EXISTING_FILE", index }),
    dropzoneOptions,
  };
}

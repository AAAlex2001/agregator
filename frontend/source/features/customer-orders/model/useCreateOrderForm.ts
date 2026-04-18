"use client";

import { useReducer } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DropzoneOptions } from "react-dropzone";
import type { OrderCardData } from "@/source/entities/order";
import { mergeFilesWithLimits } from "@/shared/lib/fileUploadValidation";
import { useNotifications } from "@/shared/ui/Notifications";
import { fetchOrderBadgeOptions } from "../api/customer-orders.api";
import type { BadgeOptionDto } from "../api/customer-orders.api";
import { createInitialFormFilesState, formFilesReducer } from "./formReducer";
import { getDefaultValues } from "./mappers";
import { orderFormSchema } from "./schema";
import type { OrderFormValues } from "./schema";

interface Props {
  editTarget?: OrderCardData;
  onSubmit: (values: OrderFormValues, files: File[], keepFiles?: string[]) => void;
}

export function useCreateOrderForm({ editTarget, onSubmit }: Props) {
  const isEdit = Boolean(editTarget);
  const { showError } = useNotifications();
  const [badgeOptions, setBadgeOptions] = useState<BadgeOptionDto[]>([]);
  const [fileState, dispatch] = useReducer(
    formFilesReducer,
    createInitialFormFilesState(editTarget?.technicalFiles),
  );

  useEffect(() => {
    let active = true;

    const loadBadgeOptions = async () => {
      try {
        const nextOptions = await fetchOrderBadgeOptions();
        if (active) setBadgeOptions(nextOptions);
      } catch (error) {
        if (!active) return;
        showError(error instanceof Error ? error.message : "Не удалось загрузить бейджи");
      }
    };

    void loadBadgeOptions();

    return () => {
      active = false;
    };
  }, [showError]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: getDefaultValues(editTarget),
  });

  const selectedBadgeVariants = form.watch("selectedBadgeVariants");
  const typicalNamesMap = form.watch("typicalNamesMap");

  const toggleBadge = (variant: string) => {
    const next = selectedBadgeVariants.includes(variant)
      ? selectedBadgeVariants.filter((item) => item !== variant)
      : [...selectedBadgeVariants, variant];

    form.setValue("selectedBadgeVariants", next, { shouldDirty: true });
  };

  const setTypicalNames = (variant: string, value: string) => {
    form.setValue(
      "typicalNamesMap",
      { ...typicalNamesMap, [variant]: value },
      { shouldDirty: true },
    );
  };

  const replaceFiles = (nextFiles: File[]) => {
    dispatch({ type: "ADD_FILES", files: nextFiles });
  };

  const removeFile = (index: number) => {
    dispatch({ type: "REMOVE_FILE", index });
  };

  const removeExistingFile = (index: number) => {
    dispatch({ type: "REMOVE_EXISTING_FILE", index });
  };

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
      replaceFiles(result.nextFiles);
    },
  };

  const submit = form.handleSubmit(
    (values) => {
      onSubmit(values, fileState.files, isEdit ? fileState.keepFiles : undefined);
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
    badgeOptions,
    form,
    submit,
    selectedBadgeVariants,
    typicalNamesMap,
    files: fileState.files,
    keepFiles: fileState.keepFiles,
    toggleBadge,
    setTypicalNames,
    removeFile,
    removeExistingFile,
    dropzoneOptions,
  };
}
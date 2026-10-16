"use client";

import { useReducer } from "react";
import { updateResponse, useResponseFiles } from "@/entities/response";
import type { ResponseItem, VatKind } from "@/entities/response";
import { getFileDisplayName, resolveFileUrl } from "@/shared/lib/file-url";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { useNotifications } from "@/shared/ui/notifications";
import { createEditResponseState, editResponseReducer } from "./reducer";
import type { EditResponseTextField } from "./types";

/** Хранит черновик предложения и сохраняет новые условия отклика. */
export function useEditResponse(response: ResponseItem, onSaved: () => void) {
  const [state, dispatch] = useReducer(
    editResponseReducer,
    response,
    createEditResponseState,
  );
  const attachments = useResponseFiles();
  const { showError } = useNotifications();
  const canSubmit = state.deadline.trim() !== "" && Number(state.cost) > 0;

  const keptFiles: FileGalleryItem[] = state.keepFiles.map((path) => ({
    id: path,
    name: getFileDisplayName(path),
    url: resolveFileUrl(path),
    onRemove: () => dispatch({ type: "file/remove", path }),
  }));

  /** Сохраняет дату или комментарий предложения. */
  function changeField(field: EditResponseTextField, value: string) {
    dispatch({ type: "field/change", field, value });
  }

  /** Обновляет стоимость работ в рублях. */
  function changeCost(value: string) {
    dispatch({ type: "cost/change", value });
  }

  /** Выбирает ставку НДС для предлагаемой стоимости. */
  function changeVatKind(value: VatKind) {
    dispatch({ type: "vat/change", value });
  }

  /** Отправляет условия и файлы; при ошибке оставляет заполненный черновик. */
  async function submit() {
    if (state.isSubmitting || !canSubmit) {
      return;
    }

    dispatch({ type: "submit/start" });

    try {
      await updateResponse(response.id, {
        comment: state.comment,
        proposed_sum_amount: Math.round(Number(state.cost) * 100),
        proposed_start_date: state.startDate,
        proposed_deadline: state.deadline,
        vat_kind: state.vatKind,
        keep_files: state.keepFiles,
        files: attachments.files,
      });
      dispatch({ type: "submit/success" });
      onSaved();
    } catch (error) {
      dispatch({ type: "submit/error" });
      showError(error instanceof Error ? error.message : "Не удалось обновить отклик");
    }
  }

  return {
    state,
    canSubmit,
    files: [...keptFiles, ...attachments.items],
    addFiles: attachments.addFiles,
    changeField,
    changeCost,
    changeVatKind,
    submit,
  };
}

"use client";

import { useReducer, useState } from "react";
import type { FormEvent } from "react";
import {
  getResponseTermsError,
  responseOfferReducer,
  toResponseOfferRequest,
  updateResponse,
  useResponseFiles,
} from "@/entities/response";
import type { ResponseItem, ResponseOffer } from "@/entities/response";
import { getFileDisplayName, resolveFileUrl } from "@/shared/lib/file-url";
import { toStepError, withStep } from "@/shared/lib/step-error";
import { useSteps } from "@/shared/lib/use-steps";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { useNotifications } from "@/shared/ui/notifications";
import { EDIT_RESPONSE_FIELD_PLACES } from "../config/fields";
import { EDIT_RESPONSE_STEPS } from "../config/steps";
import type { EditResponseStep } from "../config/steps";

/** Название шага по ключу. */
function titleOf(step: EditResponseStep): string {
  return EDIT_RESPONSE_STEPS.find((item) => item.key === step)?.title ?? "";
}

/** Сохранённое предложение как черновик. */
function offerOf(response: ResponseItem): ResponseOffer {
  return {
    startDate: response.proposed_start_date_raw,
    deadline: response.proposed_deadline_raw,
    cost: response.proposed_sum_amount_raw > 0
      ? String(response.proposed_sum_amount_raw / 100)
      : "",
    vatKind: response.vat_kind,
    comment: response.comment,
  };
}

/** Изменение предложения по шагам с теми же проверками сроков, что и при отклике. */
export function useEditResponse(response: ResponseItem, onSaved: () => void) {
  const [offer, dispatch] = useReducer(responseOfferReducer, response, offerOf);
  const [keepFiles, setKeepFiles] = useState(response.response_files);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const attachments = useResponseFiles();
  const steps = useSteps(EDIT_RESPONSE_STEPS.length);
  const { showError } = useNotifications();
  const bounds = { startDate: response.order_start_date, deadline: response.order_date, budget: 0 };

  const keptFiles: FileGalleryItem[] = keepFiles.map((path) => ({
    id: path,
    name: getFileDisplayName(path),
    url: resolveFileUrl(path),
    onRemove: () => setKeepFiles(keepFiles.filter((item) => item !== path)),
  }));

  /** Сохраняет условия и файлы; при ошибке оставляет черновик. */
  async function save() {
    setIsSubmitting(true);

    try {
      await updateResponse(response.id, {
        ...toResponseOfferRequest(offer),
        keep_files: keepFiles,
        files: attachments.files,
      });
      onSaved();
    } catch (error) {
      const located = toStepError(
        error,
        EDIT_RESPONSE_FIELD_PLACES,
        titleOf,
        "Не удалось обновить отклик",
      );

      showError(located.message);

      if (located.step) {
        steps.open(EDIT_RESPONSE_STEPS.findIndex((item) => item.key === located.step));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  /** Проверяет сроки и стоимость; дальше идёт к комментарию или сохраняет. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const problem = getResponseTermsError(offer, bounds);

    if (problem) {
      showError(steps.isFirst ? problem : withStep(titleOf("terms"), problem));
      steps.open(0);
      return;
    }

    if (steps.isLast) {
      await save();
      return;
    }

    steps.forward();
  }

  return {
    offer,
    dispatch,
    files: [...keptFiles, ...attachments.items],
    addFiles: attachments.addFiles,
    steps,
    isSubmitting,
    submit,
  };
}
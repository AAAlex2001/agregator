"use client";

import { useEffect, useReducer, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { Modal } from "@/source/shared/ui";
import { mergeFilesWithLimits } from "@/source/shared/lib/fileUploadValidation";
import { isValidInn } from "@/source/shared/lib/inn";
import {
  emptyRespondForm,
  respondFormReducer,
  type RespondFormState,
} from "../../model/respondForm";
import { loadDraft, saveDraft, type ResponseDraft } from "../../model/responseDraft";
import { DetailsStep } from "./DetailsStep";
import { OfferStep } from "./OfferStep";
import { TenderStep } from "./TenderStep";
import type { ModalStep, OrderModalProps } from "./types";
import styles from "./OrderModal.module.scss";

function parseDeadline(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function draftToForm(draft: ResponseDraft): RespondFormState {
  return {
    startDate: draft.startDate ?? "",
    deadline: draft.deadline,
    cost: draft.cost,
    vatKind: draft.vatKind as RespondFormState["vatKind"],
    comment: draft.comment,
    companyName: draft.companyName,
    companyData: draft.companyData as RespondFormState["companyData"],
  };
}

export function OrderModal({
  isOpen,
  onClose,
  order,
  onRespond,
  isResponding,
  initialStep = "details",
  useDraft = false,
}: OrderModalProps) {
  const { showError } = useNotifications();
  const [step, setStep] = useState<ModalStep>(initialStep);
  const [files, setFiles] = useState<File[]>([]);
  const [state, dispatch] = useReducer(respondFormReducer, emptyRespondForm);
  const requiresCompany = order?.requiresLicense ?? true;

  // При смене заказа: подгружаем черновик только если открыто через "Продолжить"
  useEffect(() => {
    if (!order?.id) {
      dispatch({ type: "reset", state: emptyRespondForm });
      setStep(initialStep);
      setFiles([]);
      return;
    }
    const draft = useDraft ? loadDraft(order.id) : null;
    if (draft) {
      dispatch({ type: "reset", state: draftToForm(draft) });
      setStep(draft.step);
    } else {
      dispatch({ type: "reset", state: emptyRespondForm });
      setStep(initialStep);
    }
    setFiles([]);
  }, [order?.id, initialStep, useDraft]);

  // Сохраняем черновик при изменении формы или шага — только если исполнитель реально что-то ввёл
  useEffect(() => {
    if (!order?.id) return;
    const hasContent =
      Boolean(state.deadline) ||
      Boolean(state.cost) ||
      Boolean(state.comment) ||
      Boolean(state.companyName) ||
      step !== "details";
    if (!hasContent) return;
    saveDraft({
      orderId: order.id,
      orderTitle: order.title,
      customer: order.customer,
      step,
      startDate: state.startDate,
      deadline: state.deadline,
      cost: state.cost,
      vatKind: state.vatKind,
      comment: state.comment,
      companyName: state.companyName,
      companyData: state.companyData,
      updatedAt: Date.now(),
    });
  }, [order?.id, order?.title, order?.customer, step, state]);

  if (!order) {
    return null;
  }

  const handleAddFiles = (nextFiles: FileList | null) => {
    if (!nextFiles || nextFiles.length === 0) return;
    const result = mergeFilesWithLimits(files, Array.from(nextFiles));
    if (result.errorMessage) {
      showError(result.errorMessage);
      return;
    }
    setFiles(result.nextFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const submit = () => {
    if (isResponding) return;

    if (!state.startDate) {
      showError("Укажите срок начала выполнения работ");
      return;
    }
    if (!state.deadline) {
      showError("Укажите срок окончания выполнения работ");
      return;
    }
    if (!state.cost || Number(state.cost) <= 0) {
      showError("Укажите стоимость работ");
      return;
    }

    const costAmount = Math.round(Number(state.cost) * 100);
    if (order.sumAmountRaw > 0 && costAmount > order.sumAmountRaw) {
      showError("Стоимость не может превышать бюджет заказчика");
      return;
    }

    const customerStartDate = parseDeadline(order.startDateRaw);
    const customerDeadline = parseDeadline(order.deadlineRaw);
    const offerStartDate = parseDeadline(state.startDate);
    const offerDeadline = parseDeadline(state.deadline);

    if (customerStartDate && offerStartDate && offerStartDate < customerStartDate) {
      showError("Срок начала выполнения работ не может быть раньше срока заказчика");
      return;
    }
    if (customerDeadline && offerDeadline && offerDeadline > customerDeadline) {
      showError("Срок окончания выполнения работ не может быть позже срока заказчика");
      return;
    }
    if (offerStartDate && offerDeadline && offerStartDate > offerDeadline) {
      showError("Срок начала выполнения работ не может быть позже срока окончания");
      return;
    }

    const expertInn = state.companyData?.data?.inn ?? "";
    if (requiresCompany && (!state.companyData || !isValidInn(expertInn))) {
      showError("Выберите вашу компанию из списка");
      return;
    }

    onRespond(order, {
      startDate: state.startDate,
      deadline: state.deadline,
      costAmount,
      vatKind: state.vatKind,
      comment: state.comment,
      files,
      expertInn: requiresCompany ? expertInn : "",
      expertCompanyData:
        requiresCompany && state.companyData
          ? (state.companyData as unknown as Record<string, unknown>)
          : {},
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="lg" isBusy={isResponding} dialogClassName={styles.dialog}>
      {step === "details" && (
        <DetailsStep order={order} onRespond={() => setStep("tender")} />
      )}

      {step === "tender" && (
        <TenderStep
          order={order}
          onBack={() => setStep("details")}
          onContinue={() => setStep("offer")}
        />
      )}

      {step === "offer" && (
        <OfferStep
          order={order}
          state={state}
          dispatch={dispatch}
          showCompanyField={requiresCompany}
          files={files}
          isSubmitting={isResponding}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onBack={() => setStep("tender")}
          onSubmit={submit}
        />
      )}
    </Modal>
  );
}

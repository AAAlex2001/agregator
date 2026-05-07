"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { mergeFilesWithLimits } from "@/shared/lib/fileUploadValidation";
import { respondFormSchema, type RespondFormValues } from "../../model/respond.schema";
import { loadDraft, saveDraft } from "../../model/responseDraft";
import { DetailsStep } from "./DetailsStep";
import { OfferStep } from "./OfferStep";
import { TenderStep } from "./TenderStep";
import type { ModalStep, OrderModalProps } from "./types";
import styles from "./OrderModal.module.scss";

const emptyValues: RespondFormValues = {
  deadline: "",
  cost: "",
  vatKind: "NONE",
  comment: "",
  companyName: "",
  companyData: null,
};

function parseDeadline(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
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

  const form = useForm<RespondFormValues>({
    resolver: zodResolver(respondFormSchema),
    defaultValues: emptyValues,
    mode: "onBlur",
  });

  // При смене заказа: подгружаем черновик только если открыто через "Продолжить"
  useEffect(() => {
    if (!order?.id) {
      form.reset(emptyValues);
      setStep(initialStep);
      setFiles([]);
      return;
    }
    const draft = useDraft ? loadDraft(order.id) : null;
    if (draft) {
      form.reset({
        deadline: draft.deadline,
        cost: draft.cost,
        vatKind: draft.vatKind as RespondFormValues["vatKind"],
        comment: draft.comment,
        companyName: draft.companyName,
        companyData: draft.companyData as RespondFormValues["companyData"],
      });
      setStep(draft.step);
    } else {
      form.reset(emptyValues);
      setStep(initialStep);
    }
    setFiles([]);
  }, [order?.id, initialStep, useDraft, form]);

  // Сохраняем черновик при изменении формы или шага — только если эксперт реально что-то ввёл
  useEffect(() => {
    if (!order?.id) return;
    const persist = () => {
      const v = form.getValues();
      const hasContent =
        Boolean(v.deadline) ||
        Boolean(v.cost) ||
        Boolean(v.comment) ||
        Boolean(v.companyName) ||
        step !== "details";
      if (!hasContent) return;
      saveDraft({
        orderId: order.id,
        orderTitle: order.title,
        customer: order.customer,
        step,
        deadline: v.deadline,
        cost: v.cost,
        vatKind: v.vatKind,
        comment: v.comment,
        companyName: v.companyName,
        companyData: v.companyData,
        updatedAt: Date.now(),
      });
    };
    persist();
    const sub = form.watch(() => persist());
    return () => sub.unsubscribe();
  }, [order?.id, order?.title, order?.customer, step, form]);

  if (!isOpen || !order) {
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

  const submit = form.handleSubmit(
    (values) => {
      if (isResponding) return;

      const costAmount = Math.round(Number(values.cost) * 100);
      if (order.sumAmountRaw > 0 && costAmount > order.sumAmountRaw) {
        showError("Стоимость не может превышать бюджет заказчика");
        return;
      }

      const customerDeadline = parseDeadline(order.deadlineRaw);
      const offerDeadline = parseDeadline(values.deadline);
      if (customerDeadline && offerDeadline && offerDeadline > customerDeadline) {
        showError("Срок не может быть позже дедлайна заказчика");
        return;
      }

      const expertInn = values.companyData?.data?.inn ?? "";
      if (!values.companyData || !expertInn) {
        showError("Выберите вашу компанию из списка");
        return;
      }

      onRespond(order, {
        deadline: values.deadline,
        costAmount,
        vatKind: values.vatKind,
        comment: values.comment,
        files,
        expertInn,
        expertCompanyData: values.companyData as Record<string, unknown>,
      });
    },
    (errors) => {
      const first = Object.values(errors)[0];
      if (first && "message" in first && typeof first.message === "string") {
        showError(first.message);
      }
    },
  );

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

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
            form={form}
            files={files}
            isSubmitting={isResponding}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onBack={() => setStep("tender")}
            onSubmit={submit}
          />
        )}
      </div>
    </div>
  );
}

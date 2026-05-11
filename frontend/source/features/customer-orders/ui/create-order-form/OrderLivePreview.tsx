"use client";

import { useEffect, useState } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import {
  DocumentsGallery,
  OrderCard,
  countDocuments,
  emptyDocuments,
  type OrderDocuments,
} from "@/source/entities/order";
import type { DocumentsFormState } from "../../model/formFiles";
import { buildPreviewBadges } from "../../model/mappers";
import type { OrderFormValues } from "../../model/schema";
import s from "./OrderLivePreview.module.scss";

interface Props {
  form: UseFormReturn<OrderFormValues>;
  documents: DocumentsFormState;
}

function formatBudget(budget: string): string {
  if (!budget) return "";
  const value = Number.parseInt(budget, 10);
  if (!Number.isFinite(value) || value <= 0) return "";
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function formatDeadline(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function OrderLivePreview({ form, documents }: Props) {
  const values = useWatch({ control: form.control }) as Partial<OrderFormValues>;
  const previewDocuments = usePreviewDocuments(documents);

  const badges = buildPreviewBadges(values.selectionsByType ?? {});
  const comment = values.comment?.trim() ?? "";
  const hasDocuments = countDocuments(previewDocuments) > 0;
  const hasDetails = Boolean(comment) || hasDocuments;

  return (
    <aside className={s.wrap}>
      <span className={s.heading}>Как увидят эксперты:</span>
      <OrderCard
        badges={badges}
        title={values.title?.trim() || "Название заказа"}
        customer={values.company?.trim() || "—"}
        date={formatDeadline(values.deadline ?? "")}
        sum={formatBudget(values.budget ?? "")}
        responsesDeadline={values.responsesDeadline || null}
        details={hasDetails ? (
          <>
            {comment && (
              <div className={s.comment}>
                <span className={s.commentLabel}>Комментарий заказчика:</span>
                <p className={s.commentText}>{comment}</p>
              </div>
            )}
            {hasDocuments && <DocumentsGallery documents={previewDocuments} />}
          </>
        ) : undefined}
      />
    </aside>
  );
}

function usePreviewDocuments(state: DocumentsFormState): OrderDocuments {
  const [blobUrls, setBlobUrls] = useState<Map<File, string>>(new Map());

  useEffect(() => {
    const newFiles: File[] = [
      ...(state.technical.newFile ? [state.technical.newFile] : []),
      ...(state.contract.newFile ? [state.contract.newFile] : []),
      ...(state.company.newFile ? [state.company.newFile] : []),
      ...state.other.newFiles,
    ];

    const next = new Map<File, string>();
    for (const file of newFiles) {
      next.set(file, `${URL.createObjectURL(file)}#name=${encodeURIComponent(file.name)}`);
    }
    setBlobUrls(next);
    return () => { next.forEach((url) => URL.revokeObjectURL(url.split("#")[0])); };
  }, [
    state.technical.newFile,
    state.contract.newFile,
    state.company.newFile,
    state.other.newFiles,
  ]);

  const result = emptyDocuments();
  const slotUrl = (slot: { newFile: File | null; existing: string | null }) => {
    if (slot.newFile) return blobUrls.get(slot.newFile);
    return slot.existing ?? undefined;
  };
  const tech = slotUrl(state.technical);
  const contract = slotUrl(state.contract);
  const company = slotUrl(state.company);
  if (tech) result.technical = [tech];
  if (contract) result.contract = [contract];
  if (company) result.company = [company];
  result.other = [
    ...state.other.existing,
    ...state.other.newFiles.map((f) => blobUrls.get(f)).filter((u): u is string => Boolean(u)),
  ];
  return result;
}

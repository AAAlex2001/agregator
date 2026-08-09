"use client";

import { useEffect, useState } from "react";
import {
  DocumentsGallery,
  OrderCard,
  OrderDetailsList,
  countDocuments,
  emptyDocuments,
  orderDetailsFields,
  type OrderDocuments,
  type OrderWorkType,
} from "@/source/entities/order";
import { useSession } from "@/source/features/session";
import type { DocumentsFormState } from "@/source/entities/order";
import { buildPreviewBadges } from "../../model/expertiseBadges";
import { activeDirectionDetails } from "../../model/orderDetails";
import type { OrderFormState } from "../../model/orderForm";
import s from "./OrderLivePreview.module.scss";

interface Props {
  state: OrderFormState;
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

export function OrderLivePreview({ state }: Props) {
  const previewDocuments = usePreviewDocuments(state.documents);
  const { user } = useSession();

  const badges = buildPreviewBadges(state.selectionsByType);
  const comment = state.comment.trim();
  const hasDocuments = countDocuments(previewDocuments) > 0;
  const workType: OrderWorkType = state.workType;
  const directionDetails = activeDirectionDetails(state.workType, state) ?? null;
  const hasDirectionFields =
    orderDetailsFields(workType).length > 0 && Boolean(directionDetails);
  const hasDetails = Boolean(comment) || hasDocuments || hasDirectionFields;

  return (
    <aside className={s.wrap}>
      <span className={s.heading}>Как увидят исполнители:</span>
      <OrderCard
        badges={badges}
        workType={state.workType}
        title={state.title.trim() || "Название заказа"}
        customer={state.company.trim() || "—"}
        customerInn={user?.inn ?? undefined}
        startDate={state.startDate ? formatDeadline(state.startDate) : undefined}
        date={formatDeadline(state.deadline)}
        sum={formatBudget(state.budget)}
        responsesDeadline={state.responsesDeadline || null}
        details={hasDetails ? (
          <>
            <OrderDetailsList workType={workType} details={directionDetails} />
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

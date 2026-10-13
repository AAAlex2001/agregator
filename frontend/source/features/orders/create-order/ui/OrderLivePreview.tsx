"use client";

import { TYPE_COLOR, type ExpertiseType } from "@/source/entities/expertise";
import { countDocuments, DocumentsGallery, OrderCard, OrderDetailsList, type Badge, type OrderDocuments } from "@/source/entities/order";
import { useSession } from "@/source/entities/session";
import { formatDateRuOrEmpty } from "@/source/shared/lib/formatDate";
import { localFileUrl } from "@/source/shared/lib/localFile";
import type { OrderFormState } from "../model/types";
import s from "./OrderLivePreview.module.scss";

function badgeFromCode(code: string): Badge {
  const type = code.split(" ")[1] as ExpertiseType;
  return { text: code, variant: TYPE_COLOR[type] ?? "orange" };
}

/** Загруженные пути плюс выбранные файлы: имя файла едет в адресе, чтобы галерея его показала. */
function withLocal(paths: string[], files: (File | null)[]): string[] {
  const picked = files.filter((file) => file !== null);
  return [...paths, ...picked.map((file) => `${localFileUrl(file)}#name=${encodeURIComponent(file.name)}`)];
}

interface OrderLivePreviewProps {
  state: OrderFormState;
}

/** «Как увидят исполнители»: карточка заказа из текущих значений формы. */
export function OrderLivePreview({ state }: OrderLivePreviewProps) {
  const { user } = useSession();
  const documents: OrderDocuments = {
    technical: withLocal(state.documents.technical, [state.files.technical]),
    contract: withLocal(state.documents.contract, [state.files.contract]),
    company: withLocal(state.documents.company, [state.files.company]),
    other: withLocal(state.documents.other, state.files.other),
  };
  const hasDocuments = countDocuments(documents) > 0;
  const comment = state.comment.trim();
  const budget = Number(state.budget);

  return (
    <aside className={s.wrap}>
      <span className={s.heading}>Как увидят исполнители:</span>
      <OrderCard
        order={{
          id: 0,
          title: state.title.trim() || "Название заказа",
          customer: state.company.trim() || "—",
          customerInn: user?.inn ?? "",
          startDate: formatDateRuOrEmpty(state.startDate),
          date: formatDateRuOrEmpty(state.deadline),
          sum: budget > 0 ? `${budget.toLocaleString("ru-RU")} ₽` : "",
          responsesDeadline: state.responsesDeadline || null,
          createdAtDisplay: "",
          status: "OPEN",
          workType: state.workType,
          badges: state.badgeCodes.map(badgeFromCode),
          previousTitle: null,
          previousSum: null,
          previousDeadline: null,
          previousBadges: null,
        }}
        details={
          state.details || comment || hasDocuments ? (
            <>
              <OrderDetailsList workType={state.workType} details={state.details} />
              {comment && (
                <div className={s.comment}>
                  <span className={s.commentLabel}>Комментарий заказчика:</span>
                  <p className={s.commentText}>{comment}</p>
                </div>
              )}
              {hasDocuments && <DocumentsGallery documents={documents} />}
            </>
          ) : undefined
        }
      />
    </aside>
  );
}

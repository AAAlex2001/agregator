"use client";

import { ListCard } from "@/source/shared/ui/ListCard";
import { useSession } from "@/source/features/session";
import { OrderQuestionsBlock } from "@/source/features/order-questions";
import {
  ActionButtons,
  CommentSection,
  ExpertInfo,
} from "@/source/entities/response";
import type { CardAction } from "@/source/entities/response";
import { DocumentsGallery, RequirementsBadges, countDocuments } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import s from "./ReportCard.module.scss";

interface Props {
  card: OrderCardData;
  onView: () => void;
  onDownload: () => void;
}

export function ReportCard({ card, onView, onDownload }: Props) {
  const { user, role } = useSession();
  const hasExecutor = Boolean(card.executorName);

  const actions: CardAction[] = [
    { text: "Скачать PDF", variant: "outline", onClick: onDownload },
    { text: "Посмотреть отчёт", variant: "primary", onClick: onView },
  ];

  const bottomLeft = hasExecutor ? (
    <div className={s.executorBlock}>
      <span className={s.label}>Исполнитель</span>
      <ExpertInfo
        name={card.executorName}
        avatarUrl={card.executorAvatarUrl}
        rating={card.executorRating}
        reviewCount={card.executorReviewCount}
        expertPublicId={card.executorPublicId}
      />
    </div>
  ) : (
    <>
      <span className={s.label}>Организатор:</span>
      <span className={s.value}>{card.customer || "—"}</span>
    </>
  );

  return (
    <ListCard
      meta={`№ ${card.id}`}
      statusText="Тендер завершён"
      statusColor="#0b5723"
      statusBg="#b2dfb6"
      titleLabel="Название заказа:"
      title={card.title}
      bottomLeftCustom={bottomLeft}
      rightItems={[
        { label: "Начальная максимальная цена", value: card.sum || "—", valueAccent: true },
        ...(card.executorProposedSum ? [{ label: "Цена исполнителя", value: card.executorProposedSum }] : []),
        ...(card.executorProposedStartDate ? [{ label: "Срок начала выполнения работ исполнителя", value: card.executorProposedStartDate }] : []),
        ...(card.executorProposedDeadline ? [{ label: "Срок окончания выполнения работ исполнителя", value: card.executorProposedDeadline }] : []),
        { label: "Срок начала выполнения работ", value: card.startDate || "—" },
        { label: "Срок окончания выполнения работ", value: card.date || "—" },
      ]}
      actions={<ActionButtons actions={actions} />}
      leftExtra={<RequirementsBadges badges={card.badges} />}
      details={
        <>
          {card.comment && (
            <CommentSection title="Комментарий заказчика:" text={card.comment} />
          )}
          {hasExecutor && card.executorComment && (
            <CommentSection title="Комментарий исполнителя:" text={card.executorComment} />
          )}
          {countDocuments(card.documents) > 0 && (
            <DocumentsGallery documents={card.documents} />
          )}
          <OrderQuestionsBlock
            orderId={card.id}
            currentUserId={user?.id ?? null}
            customerId={card.customerId}
            isCustomer={role === "CUSTOMER"}
            isExpert={role === "EXPERT"}
            expertCanAsk={false}
          />
        </>
      }
    />
  );
}

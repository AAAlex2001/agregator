"use client";

import { Button } from "@/shared/ui";
import { ListCard } from "@/source/shared/ui/ListCard";
import { useSession } from "@/source/features/session";
import { OrderQuestionsBlock } from "@/source/features/order-questions";
import {
  ExpertInfo,
  CommentSection,
  TechSpecFiles,
} from "@/source/entities/response";
import { DocumentsGallery, RequirementsBadges, countDocuments } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import s from "./ArchivedCard.module.scss";

interface Props {
  card: OrderCardData;
  canLeaveReview?: boolean;
  onLeaveReview?: () => void;
}

export function ArchivedCard({ card, canLeaveReview, onLeaveReview }: Props) {
  const { user, role } = useSession();
  const hasExecutor = Boolean(card.executorName);

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
      statusText="Архив"
      statusColor="#8a4500"
      statusBg="#ffe0b2"
      titleLabel="Название заказа:"
      title={card.title}
      bottomLeftCustom={bottomLeft}
      rightItems={[
        { label: "Начальная максимальная цена", value: card.sum || "—", valueAccent: true },
        ...(card.executorProposedSum
          ? [{ label: "Цена исполнителя", value: card.executorProposedSum }]
          : []),
        ...(card.executorProposedDeadline
          ? [{ label: "Срок исполнителя", value: card.executorProposedDeadline }]
          : []),
        { label: "Срок выполнения до", value: card.date || "—", valueOrange: true },
        ...(card.createdAtDisplay
          ? [{ label: "Создан", value: card.createdAtDisplay }]
          : []),
      ]}
      actions={
        canLeaveReview && onLeaveReview ? (
          <Button variant="primary" size="sm" onClick={onLeaveReview}>
            Оставить отзыв
          </Button>
        ) : undefined
      }
      leftExtra={<RequirementsBadges badges={card.badges} />}
      details={
        <>
          {card.comment && (
            <CommentSection title="Комментарий заказчика:" text={card.comment} />
          )}
          {hasExecutor && card.executorComment && (
            <CommentSection title="Комментарий исполнителя:" text={card.executorComment} />
          )}
          {hasExecutor && card.executorFiles.length > 0 && (
            <TechSpecFiles title="Файлы отклика:" files={card.executorFiles} />
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

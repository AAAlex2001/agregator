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
import { RequirementsBadges } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";

interface Props {
  card: OrderCardData;
  canLeaveReview?: boolean;
  onLeaveReview?: () => void;
}

export function ArchivedCard({ card, canLeaveReview, onLeaveReview }: Props) {
  const { user, role } = useSession();
  const hasExecutor = Boolean(card.executorName);

  return (
    <ListCard
      meta={`№ ${card.id}`}
      statusText="Архив"
      statusColor="#cc6e00"
      statusBg="#fff5e6"
      titleLabel="Название заказа"
      title={card.title}
      bottomLeftLabel={hasExecutor ? "Исполнитель" : "Организатор"}
      bottomLeftValue={hasExecutor ? card.executorName : card.customer || "—"}
      rightItems={[
        { label: "Начальная максимальная цена", value: card.sum || "—", valueAccent: true },
        ...(card.executorProposedSum
          ? [{ label: "Цена исполнителя", value: card.executorProposedSum }]
          : []),
        ...(card.executorProposedDeadline
          ? [{ label: "Срок исполнителя", value: card.executorProposedDeadline }]
          : []),
        { label: "Срок выполнения до", value: card.date || "—" },
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
          {hasExecutor && (
            <ExpertInfo
              name={card.executorName}
              avatarUrl={card.executorAvatarUrl}
              rating={card.executorRating}
              reviewCount={card.executorReviewCount}
              expertPublicId={card.executorPublicId}
            />
          )}
          {card.comment && (
            <CommentSection title="Комментарий заказчика:" text={card.comment} />
          )}
          {hasExecutor && card.executorComment && (
            <CommentSection title="Комментарий исполнителя:" text={card.executorComment} />
          )}
          {hasExecutor && card.executorFiles.length > 0 && (
            <TechSpecFiles title="Файлы отклика:" files={card.executorFiles} />
          )}
          {card.technicalFiles.length > 0 && (
            <TechSpecFiles title="Техническое задание:" files={card.technicalFiles} />
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

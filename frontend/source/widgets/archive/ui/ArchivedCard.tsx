import {
  StatusHeader,
  OrderSection,
  TechSpecFiles,
  CommentSection,
  ExpertTerms,
  ExpertInfo,
  ActionButtons,
} from "@/source/entities/response";
import type { CardAction } from "@/source/entities/response";
import type { OrderCardData } from "@/source/entities/order";
import s from "./ArchivedCard.module.scss";

interface Props {
  card: OrderCardData;
  canLeaveReview?: boolean;
  onLeaveReview?: () => void;
}

export function ArchivedCard({ card, canLeaveReview, onLeaveReview }: Props) {
  const actions: CardAction[] = canLeaveReview && onLeaveReview
    ? [{ text: "Оставить отзыв", variant: "primary", onClick: onLeaveReview }]
    : [];

  return (
    <article className={s.card}>
      <div className={s.content}>
        <StatusHeader
          status="Архив"
          statusColor="#ff8a00"
          statusBg="#fff8eb"
        />
        <OrderSection
          title={card.title}
          customer={card.customer}
          date={card.date}
          badges={card.badges}
          sum={card.sum}
        />
        {card.executorName && (
          <ExpertInfo
            name={card.executorName}
            avatarUrl={card.executorAvatarUrl}
            rating={card.executorRating}
            reviewCount={card.executorReviewCount}
            expertPublicId={card.executorPublicId}
          />
        )}
        <div className={s.info}>
          {(card.executorProposedDeadline || card.executorProposedSum) && (
            <ExpertTerms
              deadlineLabel="Срок:"
              deadline={card.executorProposedDeadline}
              costLabel="Цена:"
              cost={card.executorProposedSum}
            />
          )}
          {card.executorComment && (
            <CommentSection title="Комментарий исполнителя:" text={card.executorComment} />
          )}
          {card.executorFiles.length > 0 && (
            <TechSpecFiles title="Файлы отклика:" files={card.executorFiles} />
          )}
          {card.technicalFiles.length > 0 && (
            <TechSpecFiles title="Техническое задание:" files={card.technicalFiles} />
          )}
        </div>
      </div>
      <ActionButtons actions={actions} />
    </article>
  );
}

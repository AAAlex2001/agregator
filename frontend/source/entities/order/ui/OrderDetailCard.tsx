"use client";

import { useSession } from "@/source/features/session";
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
import { OrderQuestionsBlock } from "@/source/features/order-questions";
import type { OrderCardData } from "../model/types";
import s from "./OrderDetailCard.module.scss";

interface Status {
  text: string;
  color: string;
  bg: string;
}

interface Props {
  card: OrderCardData;
  status: Status;
  actions?: CardAction[];
  showExecutor?: boolean;
  showQuestions?: boolean;
  expertCanAsk?: boolean;
}

export function OrderDetailCard({
  card,
  status,
  actions = [],
  showExecutor = false,
  showQuestions = false,
  expertCanAsk = false,
}: Props) {
  const { user, role } = useSession();
  const hasExecutor = showExecutor && Boolean(card.executorName);

  return (
    <article className={s.card}>
      <div className={s.content}>
        <StatusHeader status={status.text} statusColor={status.color} statusBg={status.bg} />

        <OrderSection
          title={card.title}
          customer={card.customer}
          date={card.date}
          badges={card.badges}
          sum={card.sum}
        />

        {hasExecutor && (
          <ExpertInfo
            name={card.executorName}
            avatarUrl={card.executorAvatarUrl}
            rating={card.executorRating}
            reviewCount={card.executorReviewCount}
            expertPublicId={card.executorPublicId}
          />
        )}

        <div className={s.info}>
          {hasExecutor && (card.executorProposedDeadline || card.executorProposedSum) && (
            <ExpertTerms
              deadlineLabel="Срок:"
              deadline={card.executorProposedDeadline}
              costLabel="Цена:"
              cost={card.executorProposedSum}
            />
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
          {showQuestions && (
            <OrderQuestionsBlock
              orderId={card.id}
              currentUserId={user?.id ?? null}
              customerId={card.customerId}
              isCustomer={role === "CUSTOMER"}
              isExpert={role === "EXPERT"}
              expertCanAsk={expertCanAsk}
            />
          )}
        </div>
      </div>
      {actions.length > 0 && <ActionButtons actions={actions} />}
    </article>
  );
}

"use client";

import { ExpertInfo } from "@/entities/expert";
import { ArchivedOrderCard } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { ResponseFiles } from "@/entities/response";
import { useUser } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { OrderQuestions } from "../order-questions";

/** Завершённый заказ; в истории исполнителя нет отзыва и ссылки на эту же историю. */
interface ArchiveOrderItemProps {
  order: OrderListItem;
  isExpertHistory?: boolean;
  onLeaveReview?: (order: OrderListItem) => void;
}

/** Соединяет архивную карточку с исполнителем, вопросами и доступным отзывом. */
export function ArchiveOrderItem({
  order,
  isExpertHistory = false,
  onLeaveReview,
}: ArchiveOrderItemProps) {
  const { user, role } = useUser();
  const canReview = onLeaveReview !== undefined
    && role === "CUSTOMER"
    && user?.id === order.customer_id
    && order.accepted_response_id !== null
    && !order.customer_has_review;

  /** Открывает отзыв заказчика о завершённом заказе. */
  function openReview() {
    onLeaveReview?.(order);
  }

  return (
    <ArchivedOrderCard
      order={order}
      executor={
        <ExpertInfo
          name={order.executor_name}
          avatarUrl={order.executor_avatar_url}
          rating={order.executor_rating}
          reviewCount={order.executor_review_count}
          expertPublicId={order.executor_public_id}
          hideHistoryLink={isExpertHistory}
        />
      }
      responseFiles={
        order.executor_files.length > 0 ? (
          <ResponseFiles
            title="Файлы отклика:"
            files={order.executor_files}
          />
        ) : undefined
      }
      actions={
        canReview && (
          <Button
            variant="secondary"
            size="sm"
            onClick={openReview}
          >
            Оставить отзыв
          </Button>
        )
      }
      footer={
        <OrderQuestions
          orderId={order.id}
          customerId={order.customer_id}
          canAsk={false}
        />
      }
    />
  );
}

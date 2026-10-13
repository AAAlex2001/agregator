"use client";

import { hasOrderDetails, OrderComment, OrderDetails, RequirementsBadges, type OrderCardData } from "@/source/entities/order";
import { ExpertInfo, TechSpecFiles } from "@/source/entities/response";
import { OrderQuestions } from "@/source/features/orders/questions";
import Button from "@/source/shared/ui/Button";
import { ListCard } from "@/source/shared/ui/ListCard";
import s from "./ArchivedOrderCard.module.scss";

interface ArchivedOrderCardProps {
  order: OrderCardData;
  hideExpertHistoryLink?: boolean;
  onLeaveReview?: () => void;
}

/** Завершённый заказ: кто выполнил, по какой цене и в какие сроки. */
export function ArchivedOrderCard({ order, hideExpertHistoryLink = false, onLeaveReview }: ArchivedOrderCardProps) {
  const hasExecutor = Boolean(order.executorName);

  return (
    <ListCard
      meta={`№ ${order.id}`}
      statusText="Архив"
      statusColor="#8a4500"
      statusBg="#ffe0b2"
      titleLabel="Название заказа:"
      title={order.title}
      bottomLeftCustom={
        hasExecutor ? (
          <div className={s.executorBlock}>
            <span className={s.label}>Исполнитель</span>
            <ExpertInfo
              name={order.executorName}
              avatarUrl={order.executorAvatarUrl}
              rating={order.executorRating}
              reviewCount={order.executorReviewCount}
              expertPublicId={order.executorPublicId}
              hideHistoryLink={hideExpertHistoryLink}
            />
          </div>
        ) : (
          <>
            <span className={s.label}>Организатор:</span>
            <span className={s.value}>{order.customer || "—"}</span>
          </>
        )
      }
      rightItems={[
        { label: "Начальная максимальная цена", value: order.sum || "—", valueAccent: true },
        { label: "Цена исполнителя", value: order.executorProposedSum },
        { label: "Срок начала выполнения работ исполнителя", value: order.executorProposedStartDate },
        { label: "Срок окончания выполнения работ исполнителя", value: order.executorProposedDeadline },
        { label: "Срок начала выполнения работ", value: order.startDate || "—" },
        { label: "Срок окончания выполнения работ", value: order.date || "—" },
        { label: "Создан", value: order.createdAtDisplay },
      ].filter((item) => item.value)}
      actions={
        onLeaveReview && (
          <Button variant="secondary" size="sm" onClick={onLeaveReview}>
            Оставить отзыв
          </Button>
        )
      }
      leftExtra={<RequirementsBadges badges={order.badges} workType={order.workType} />}
      details={
        hasOrderDetails(order) || hasExecutor ? (
          <OrderDetails order={order}>
            {hasExecutor && order.executorComment && <OrderComment title="Комментарий исполнителя:" text={order.executorComment} />}
            {hasExecutor && order.executorFiles.length > 0 && <TechSpecFiles title="Файлы отклика:" files={order.executorFiles} />}
          </OrderDetails>
        ) : undefined
      }
      footer={<OrderQuestions orderId={order.id} customerId={order.customerId} canAsk={false} />}
    />
  );
}

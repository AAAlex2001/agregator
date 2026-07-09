"use client";

import { ListCard } from "@/source/shared/ui/ListCard";
import { DiffValue } from "@/source/shared/ui/DiffValue";
import { useSession } from "@/source/features/session";
import { OrderQuestionsBlock } from "@/source/features/order-questions";
import { ActionButtons, CommentSection } from "@/source/entities/response";
import type { CardAction } from "@/source/entities/response";
import { DocumentsGallery, RequirementsBadges, countDocuments } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import cardBottom from "@/source/entities/order/ui/OrderCardBottom.module.scss";
import { formatMoscowDateTime } from "@/source/shared/lib/formatDate";

interface Props {
  card: OrderCardData;
  isDeleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerActiveCard({ card, isDeleting, onEdit, onDelete }: Props) {
  const { user, role } = useSession();

  const actions: CardAction[] = [
    { text: "Редактировать", variant: "outline", onClick: onEdit },
    { text: "Удалить", variant: "danger", onClick: onDelete, isLoading: isDeleting },
  ];

  return (
    <ListCard
      meta={`№ ${card.id}`}
      statusText="Активен"
      statusColor="#0b5723"
      statusBg="#b2dfb6"
      titleLabel="Название заказа"
      title={<DiffValue previous={card.previousTitle} current={card.title} />}
      bottomLeftCustom={
        <div className={cardBottom.bottom}>
          <span className={cardBottom.label}>Организатор</span>
          <span className={cardBottom.value}>{card.customer || card.company || "—"}</span>
          {(card.customerInn || user?.inn) && (
            <span className={cardBottom.inn}>ИНН {card.customerInn || user?.inn}</span>
          )}
        </div>
      }
      rightItems={[
        {
          label: "Начальная максимальная цена",
          value: <DiffValue previous={card.previousSum} current={card.sum || "Не установлена"} />,
          valueAccent: true,
        },
        ...(card.createdAtDisplay ? [{ label: "Дата публикации", value: card.createdAtDisplay }] : []),
        { label: "Приём откликов до (МСК)", value: formatMoscowDateTime(card.responsesDeadline), valueOrange: true },
        {
          label: "Срок начала выполнения работ",
          value: card.startDate || "—",
        },
        {
          label: "Срок окончания выполнения работ",
          value: <DiffValue previous={card.previousDeadline} current={card.date || "—"} />,
        },
      ]}
      actions={<ActionButtons actions={actions} />}
      leftExtra={<RequirementsBadges badges={card.badges} previousBadges={card.previousBadges} />}
      details={
        <>
          {card.comment && (
            <CommentSection
              title="Комментарий заказчика:"
              text={card.comment}
              previous={card.previousComment}
            />
          )}
          {countDocuments(card.documents) > 0 && (
            <DocumentsGallery documents={card.documents} />
          )}
        </>
      }
      footer={
        <OrderQuestionsBlock
          orderId={card.id}
          currentUserId={user?.id ?? null}
          customerId={card.customerId}
          isCustomer={role === "CUSTOMER"}
          isExpert={role === "EXPERT"}
          expertCanAsk={false}
        />
      }
    />
  );
}

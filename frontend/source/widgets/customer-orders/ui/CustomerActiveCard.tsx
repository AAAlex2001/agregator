"use client";

import { ListCard } from "@/source/shared/ui/ListCard";
import { DiffValue } from "@/source/shared/ui/DiffValue";
import { useSession } from "@/source/features/session";
import { OrderQuestionsBlock } from "@/source/features/order-questions";
import { ActionButtons, CommentSection } from "@/source/entities/response";
import type { CardAction } from "@/source/entities/response";
import {
  DocumentsGallery,
  OrderDetailsList,
  OrderOrganizer,
  RequirementsBadges,
  countDocuments,
} from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
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
        <OrderOrganizer
          customer={card.customer || card.company || ""}
          customerInn={card.customerInn || user?.inn}
        />
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
      leftExtra={<RequirementsBadges badges={card.badges} previousBadges={card.previousBadges} workType={card.workType} />}
      details={
        <>
          <OrderDetailsList workType={card.workType} details={card.details} />
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

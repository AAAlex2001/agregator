"use client";

import { ListCard } from "@/source/shared/ui/ListCard";
import { useSession } from "@/source/features/session";
import { OrderQuestionsBlock } from "@/source/features/order-questions";
import { ActionButtons, CommentSection, TechSpecFiles } from "@/source/entities/response";
import type { CardAction } from "@/source/entities/response";
import { RequirementsBadges } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";

interface Props {
  card: OrderCardData;
  isDeleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function formatResponsesDeadline(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function CustomerActiveCard({ card, isDeleting, onEdit, onDelete }: Props) {
  const { user, role } = useSession();

  const actions: CardAction[] = [
    { text: "Редактировать", variant: "outline", onClick: onEdit },
    { text: "Удалить", variant: "transparent", onClick: onDelete, isLoading: isDeleting },
  ];

  return (
    <ListCard
      meta={`№ ${card.id}`}
      statusText="Активен"
      statusColor="#137333"
      statusBg="#e6f4ea"
      titleLabel="Название заказа"
      title={card.title}
      bottomLeftLabel="Организатор"
      bottomLeftValue={card.customer || card.company || "—"}
      rightItems={[
        { label: "Начальная максимальная цена", value: card.sum || "Не установлена", valueAccent: true },
        ...(card.createdAtDisplay ? [{ label: "Дата публикации", value: card.createdAtDisplay }] : []),
        { label: "Приём откликов до", value: formatResponsesDeadline(card.responsesDeadline) },
        { label: "Срок выполнения до", value: card.date || "—" },
      ]}
      actions={<ActionButtons actions={actions} />}
      leftExtra={<RequirementsBadges badges={card.badges} />}
      details={
        <>
          {card.comment && (
            <CommentSection title="Комментарий заказчика:" text={card.comment} />
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

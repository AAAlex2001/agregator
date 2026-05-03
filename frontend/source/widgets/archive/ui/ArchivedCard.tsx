import {
  StatusHeader,
  OrderSection,
  TechSpecFiles,
  CommentSection,
} from "@/source/entities/response";
import type { OrderCardData } from "@/source/entities/order";
import s from "./ArchivedCard.module.scss";

interface Props {
  card: OrderCardData;
}

export function ArchivedCard({ card }: Props) {
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
        <div className={s.info}>
          {card.assignedExpertName && (
            <CommentSection title="Исполнитель:" text={card.assignedExpertName} />
          )}
          {card.comment && (
            <CommentSection title="Комментарий заказчика:" text={card.comment} />
          )}
          {card.technicalFiles.length > 0 && (
            <TechSpecFiles title="Техническое задание:" files={card.technicalFiles} />
          )}
        </div>
      </div>
    </article>
  );
}

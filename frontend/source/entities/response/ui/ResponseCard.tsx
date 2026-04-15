import type { ResponseCardData, CardAction } from "../model/types";
import { StatusHeader } from "./StatusHeader";
import { OrderSection } from "./OrderSection";
import { ExpertTerms, CommentSection, CommissionInfo, ReminderSection } from "./InfoSections";
import { TechSpecFiles } from "./TechSpecFiles";
import { ActionButtons } from "./ActionButtons";
import s from "./ResponseCard.module.scss";

function getFlags(card: ResponseCardData) {
  const c = card.expertConfirmed;
  switch (card.rawStatus) {
    case "REVIEW":
      return { comment: false, orderComment: true,  commission: true,  balanceReturn: true,  reminder: false };
    case "ACCEPTED":
      return { comment: true,  orderComment: true,  commission: true,  balanceReturn: true,  reminder: true };
    case "IN_PROGRESS":
      return { comment: !c,    orderComment: !c,    commission: true,  balanceReturn: !c,    reminder: !c };
    case "REJECTED":
      return { comment: true,  orderComment: false,  commission: true,  balanceReturn: false, reminder: false };
    case "COMPLETED":
      return { comment: false, orderComment: true,  commission: true,  balanceReturn: false, reminder: false };
    default:
      return { comment: true,  orderComment: false,  commission: true,  balanceReturn: false, reminder: false };
  }
}

interface Props {
  card: ResponseCardData;
  actions: CardAction[];
}

export function ResponseCard({ card, actions }: Props) {
  const f = getFlags(card);
  const hasCommission = f.commission && card.commissionAmount && card.commissionAmount !== "0 ₽";

  return (
    <article className={s.card}>
      <div className={s.content}>
        <StatusHeader
          dateLabel={card.dateLabel} date={card.date}
          status={card.status} statusColor={card.statusColor}
          statusBg={card.statusBg} statusMessage={card.statusMessage}
        />
        <OrderSection
          title={card.orderTitle} customer={card.customer}
          date={card.orderDate} badges={card.badges}
          sum={card.orderSum || card.sum}
        />
        <div className={s.info}>
          {(card.deadline || card.costEstimate) && (
            <ExpertTerms deadline={card.deadline} cost={card.costEstimate} />
          )}
          {f.comment && card.commentText && (
            <CommentSection title={card.commentTitle} text={card.commentText} />
          )}
          {f.orderComment && card.orderComment && (
            <CommentSection title="Комментарий заказчика:" text={card.orderComment} />
          )}
          {card.techSpecFiles.length > 0 && (
            <TechSpecFiles title="Файлы отклика:" files={card.techSpecFiles} />
          )}
          {card.orderTechSpecFiles.length > 0 && (
            <TechSpecFiles title="Техническое задание:" files={card.orderTechSpecFiles} />
          )}
          {hasCommission && (
            <CommissionInfo
              text={card.commissionText} amount={card.commissionAmount}
              status={card.commissionStatus}
              returnText={f.balanceReturn ? card.balanceReturnText : undefined}
              returnAmount={f.balanceReturn ? card.balanceReturnAmount : undefined}
            />
          )}
          {f.reminder && card.reminderText && (
            <ReminderSection text={card.reminderText} />
          )}
        </div>
      </div>
      <ActionButtons actions={actions} />
    </article>
  );
}

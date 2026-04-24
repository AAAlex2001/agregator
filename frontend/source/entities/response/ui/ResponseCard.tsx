import type { ResponseCardData, CardAction, UserRole } from "../model/types";
import { StatusHeader } from "./StatusHeader";
import { ExpertInfo } from "./ExpertInfo";
import { OrderSection } from "./OrderSection";
import { ExpertTerms, CommentSection, ReminderSection } from "./InfoSections";
import { TechSpecFiles } from "./TechSpecFiles";
import { ActionButtons } from "./ActionButtons";
import s from "./ResponseCard.module.scss";

function getFlags(card: ResponseCardData, role: UserRole) {
  if (role === "customer") {
    return { expertInfo: true, comment: true, orderComment: false, reminder: false };
  }
  const c = card.expertConfirmed;
  switch (card.rawStatus) {
    case "REVIEW":
      return { expertInfo: false, comment: false, orderComment: true,  reminder: false };
    case "ACCEPTED":
      return { expertInfo: false, comment: true,  orderComment: true,  reminder: true };
    case "IN_PROGRESS":
      return { expertInfo: false, comment: !c,    orderComment: !c,    reminder: !c };
    case "REJECTED":
      return { expertInfo: false, comment: true,  orderComment: false, reminder: false };
    case "COMPLETED":
      return { expertInfo: false, comment: false, orderComment: true,  reminder: false };
    default:
      return { expertInfo: false, comment: true,  orderComment: false, reminder: false };
  }
}

interface Props {
  card: ResponseCardData;
  actions: CardAction[];
  role: UserRole;
}

export function ResponseCard({ card, actions, role }: Props) {
  const f = getFlags(card, role);
  const termsLabels = role === "customer"
    ? { deadline: "Срок:", cost: "Цена:" }
    : { deadline: "Ваши сроки:", cost: "Ваша оценка стоимости работ:" };

  return (
    <article className={s.card}>
      <div className={s.content}>
        <StatusHeader
          dateLabel={card.dateLabel} date={card.date}
          status={card.status} statusColor={card.statusColor}
          statusBg={card.statusBg} statusMessage={card.statusMessage}
        />
        {f.expertInfo && card.expertName && (
          <ExpertInfo
            name={card.expertName}
            avatarUrl={card.expertAvatarUrl}
            rating={card.expertRating}
            reviewCount={card.expertReviewCount}
            expertPublicId={card.expertPublicId}
          />
        )}
        <OrderSection
          title={card.orderTitle} customer={card.customer}
          date={card.orderDate} badges={card.badges}
          sum={card.orderSum || card.sum}
        />
        <div className={s.info}>
          {(card.deadline || card.costEstimate) && (
            <ExpertTerms
              deadlineLabel={termsLabels.deadline} deadline={card.deadline}
              costLabel={termsLabels.cost} cost={card.costEstimate}
            />
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
          {f.reminder && card.reminderText && (
            <ReminderSection text={card.reminderText} />
          )}
        </div>
      </div>
      <ActionButtons actions={actions} />
    </article>
  );
}

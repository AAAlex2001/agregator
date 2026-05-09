import { useSession } from "@/source/features/session";
import { OrderQuestionsBlock } from "@/source/features/order-questions";
import { ListCard } from "@/source/shared/ui/ListCard";
import { RequirementsBadges } from "@/source/entities/order";
import type { ResponseCardData, CardAction, UserRole } from "../model/types";
import { ExpertInfo } from "./ExpertInfo";
import { CommentSection, ReminderSection } from "./InfoSections";
import { OfferDiff } from "./OfferDiff";
import { TechSpecFiles } from "./TechSpecFiles";
import { ActionButtons } from "./ActionButtons";
import s from "./ResponseCardBottom.module.scss";

interface Props {
  card: ResponseCardData;
  actions: CardAction[];
  role: UserRole;
  onClick?: () => void;
}

function shouldShowComment(card: ResponseCardData, role: UserRole): boolean {
  if (role === "customer") return true;
  switch (card.rawStatus) {
    case "ACCEPTED":
    case "REJECTED":
      return true;
    case "IN_PROGRESS":
      return !card.expertConfirmed;
    default:
      return false;
  }
}

function shouldShowOrderComment(card: ResponseCardData, role: UserRole): boolean {
  if (role === "customer") return false;
  switch (card.rawStatus) {
    case "REVIEW":
    case "ACCEPTED":
    case "COMPLETED":
      return true;
    case "IN_PROGRESS":
      return !card.expertConfirmed;
    default:
      return false;
  }
}

function shouldShowReminder(card: ResponseCardData, role: UserRole): boolean {
  if (role === "customer") return false;
  if (card.rawStatus === "ACCEPTED") return true;
  if (card.rawStatus === "IN_PROGRESS") return !card.expertConfirmed;
  return false;
}

export function ResponseCard({ card, actions, role, onClick }: Props) {
  const { user } = useSession();
  const isExpert = role === "expert";
  const showCustomerExpertInfo = role === "customer" && Boolean(card.expertName);
  const showComment = shouldShowComment(card, role);
  const showOrderComment = shouldShowOrderComment(card, role);
  const showReminder = shouldShowReminder(card, role);

  const rightItems = [
    {
      label: "Начальная максимальная цена",
      value: card.orderSum || "Не установлена",
      valueAccent: true,
    },
    {
      label: isExpert ? "Ваша цена" : "Цена эксперта",
      value: <OfferDiff previous={card.previousSum} current={card.costEstimate || "—"} />,
    },
    {
      label: "Срок выполнения до",
      value: <OfferDiff previous={card.previousDeadline} current={card.deadline || "—"} />,
    },
    {
      label: "Дата отклика",
      value: card.date || "—",
    },
  ];

  const details = (
    <>
      {card.expertCompanyName && (
        <CommentSection
          title="Организация эксперта:"
          text={card.expertInn ? `${card.expertCompanyName} (ИНН ${card.expertInn})` : card.expertCompanyName}
        />
      )}
      {showComment && card.commentText && (
        <CommentSection title={card.commentTitle} text={card.commentText} />
      )}
      {showOrderComment && card.orderComment && (
        <CommentSection title="Комментарий заказчика:" text={card.orderComment} />
      )}
      {card.rawStatus === "REJECTED" && card.rejectionReason && (
        <CommentSection title="Причина отказа:" text={card.rejectionReason} variant="danger" />
      )}
      {card.techSpecFiles.length > 0 && (
        <TechSpecFiles title="Файлы отклика:" files={card.techSpecFiles} />
      )}
      {card.orderTechSpecFiles.length > 0 && (
        <TechSpecFiles title="Техническое задание:" files={card.orderTechSpecFiles} />
      )}
      {showReminder && card.reminderText && (
        <ReminderSection text={card.reminderText} />
      )}
      <OrderQuestionsBlock
        orderId={card.orderId}
        currentUserId={user?.id ?? null}
        customerId={card.orderCustomerId}
        isCustomer={role === "customer"}
        isExpert={role === "expert"}
        expertCanAsk={false}
      />
    </>
  );

  const bottomLeft = isExpert ? (
    <>
      <span className={s.label}>Организатор:</span>
      <span className={s.value}>{card.customer || "—"}</span>
    </>
  ) : showCustomerExpertInfo ? (
    <div className={s.expertBlock}>
      <span className={s.label}>Эксперт:</span>
      <ExpertInfo
        name={card.expertName}
        avatarUrl={card.expertAvatarUrl}
        rating={card.expertRating}
        reviewCount={card.expertReviewCount}
        expertPublicId={card.expertPublicId}
      />
    </div>
  ) : (
    <>
      <span className={s.label}>Эксперт:</span>
      <span className={s.value}>{card.expertName || "—"}</span>
    </>
  );

  return (
    <ListCard
      meta={`№ ${card.orderId}`}
      statusText={card.status}
      statusColor={card.statusColor}
      statusBg={card.statusBg}
      titleLabel="Название заказа:"
      title={card.orderTitle}
      bottomLeftCustom={bottomLeft}
      rightItems={rightItems}
      onClick={onClick}
      actions={actions.length > 0 ? <ActionButtons actions={actions} /> : undefined}
      details={details}
      leftExtra={<RequirementsBadges badges={card.badges} />}
    />
  );
}

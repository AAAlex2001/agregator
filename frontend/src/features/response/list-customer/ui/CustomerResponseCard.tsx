import {
  AcceptedCard,
  CompletedCard,
  InProgressCard,
  RejectedCard,
  ReviewCard,
} from "./cards";
import type { ResponseCardViewModel } from "@/features/response/list-expert/model/types";

interface CustomerResponseCardProps {
  response: ResponseCardViewModel;
  updatingId: number | null;
  chatOpeningId: number | null;
  onReject: (id: number) => void;
  onAccept: (id: number, orderId: number) => void;
  onSelect: (id: number) => void;
  onChat: (id: number, orderId: number) => void;
  onComplete: (id: number) => void;
  onLeaveReview: (r: ResponseCardViewModel) => void;
}

export function CustomerResponseCard({
  response,
  updatingId,
  chatOpeningId,
  onReject,
  onAccept,
  onSelect,
  onChat,
  onComplete,
  onLeaveReview,
}: CustomerResponseCardProps) {
  const common = {
    dateLabel: response.dateLabel,
    date: response.date,
    statusColor: response.statusColor,
    statusBg: response.statusBg,
    expertName: response.expertName || "",
    expertRating: response.expertRating,
    expertReviewCount: response.expertReviewCount,
    onExpertHistory: () => { /* TODO */ },
    orderTitle: response.orderTitle,
    customer: response.customerCompany || response.customer,
    orderDate: response.orderDate,
    badges: response.badges,
    sum: response.orderCustomerSum || response.sum,
    commentText: response.commentText,
    expertPrice: response.costEstimate,
    expertDeadline: response.deadline,
    techSpecTitle: response.techSpecTitle,
    techSpecFiles: response.techSpecFiles,
  };

  const updating = updatingId === response.id;
  const chatting = chatOpeningId === response.id;

  switch (response.rawStatus) {
    case "REVIEW":
      return (
        <ReviewCard
          {...common}
          status="Новый отклик"
          onReject={() => onReject(response.id)}
          onAccept={() => onAccept(response.id, response.orderId)}
          isRejectLoading={updating}
          isAcceptLoading={updating || chatting}
        />
      );
    case "ACCEPTED":
      return (
        <AcceptedCard
          {...common}
          status={response.status}
          onReject={() => onReject(response.id)}
          onSelectExpert={() => onSelect(response.id)}
          onChat={() => onChat(response.id, response.orderId)}
          isRejectLoading={updating}
          isSelectLoading={updating}
          isChatLoading={chatting}
        />
      );
    case "IN_PROGRESS":
      return (
        <InProgressCard
          {...common}
          status={`В работе от ${response.date}`}
          expertConfirmed={response.expertConfirmed}
          onReject={() => onReject(response.id)}
          onChat={() => onChat(response.id, response.orderId)}
          onComplete={() => onComplete(response.id)}
          isRejectLoading={updating}
          isChatLoading={chatting}
          isCompleteLoading={updating}
        />
      );
    case "COMPLETED":
      return (
        <CompletedCard
          {...common}
          status={response.status}
          hasReview={response.hasReview}
          onLeaveReview={() => onLeaveReview(response)}
        />
      );
    case "REJECTED":
      return <RejectedCard {...common} status={response.status} />;
    default:
      return null;
  }
}

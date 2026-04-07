import {
  AcceptedCard,
  CompletedCard,
  InProgressCard,
  RejectedCard,
  ReviewCard,
} from "./cards";
import type { ResponseCardViewModel } from "../model/types";

type ActionMode = "withdraw" | "start" | "complete" | "chat" | null;

interface ExpertResponseCardProps {
  response: ResponseCardViewModel;
  actionLoading: ActionMode;
  onWithdraw: (r: ResponseCardViewModel) => void;
  onChangeOffer: (r: ResponseCardViewModel) => void;
  onShare: (publicId: string) => void;
  onChat: (responseId: number, orderId: number) => void;
  onStart: (responseId: number) => void;
  onComplete: (responseId: number) => void;
}

export function ExpertResponseCard({
  response,
  actionLoading,
  onWithdraw,
  onChangeOffer,
  onShare,
  onChat,
  onStart,
  onComplete,
}: ExpertResponseCardProps) {
  const common = {
    dateLabel: response.dateLabel,
    date: response.date,
    status: response.status,
    statusColor: response.statusColor,
    statusBg: response.statusBg,
    orderTitle: response.orderTitle,
    customer: response.customerCompany || response.customer,
    orderDate: response.orderDate,
    badges: response.badges,
    sum: response.orderCustomerSum || response.sum,
    deadline: response.deadline,
    costEstimate: response.costEstimate,
    commissionText: response.commissionText,
    commissionAmount: response.commissionAmount,
    commissionStatus: response.commissionStatus,
    balanceReturnText: response.balanceReturnText,
    balanceReturnAmount: response.balanceReturnAmount,
    commentTitle: response.commentTitle,
    commentText: response.commentText,
    orderComment: response.orderComment,
    techSpecTitle: response.techSpecTitle,
    techSpecFiles: response.techSpecFiles,
    orderTechSpecFiles: response.orderTechSpecFiles,
  };

  switch (response.rawStatus) {
    case "REVIEW":
      return (
        <ReviewCard
          {...common}
          onWithdraw={() => onWithdraw(response)}
          onChangeOffer={() => onChangeOffer(response)}
          onShare={() => onShare(response.orderPublicId)}
          isWithdrawLoading={actionLoading === "withdraw"}
        />
      );
    case "ACCEPTED":
      return (
        <AcceptedCard
          {...common}
          reminderText={response.reminderText}
          onReject={() => onWithdraw(response)}
          onChat={() => onChat(response.id, response.orderId)}
          onShare={() => onShare(response.orderPublicId)}
          isRejectLoading={actionLoading === "withdraw"}
          isChatLoading={actionLoading === "chat"}
        />
      );
    case "IN_PROGRESS":
      return (
        <InProgressCard
          {...common}
          statusMessage={response.statusMessage}
          reminderText={response.reminderText}
          expertConfirmed={response.expertConfirmed}
          onReject={() => onWithdraw(response)}
          onChat={() => onChat(response.id, response.orderId)}
          onShare={() => onShare(response.orderPublicId)}
          onAcceptProject={() => onStart(response.id)}
          onComplete={() => onComplete(response.id)}
          isRejectLoading={actionLoading === "withdraw"}
          isChatLoading={actionLoading === "chat"}
          isAcceptProjectLoading={actionLoading === "start"}
          isCompleteLoading={actionLoading === "complete"}
        />
      );
    case "REJECTED":
      return <RejectedCard {...common} onShare={() => onShare(response.orderPublicId)} />;
    case "COMPLETED":
      return <CompletedCard {...common} onShare={() => onShare(response.orderPublicId)} />;
    default:
      return null;
  }
}

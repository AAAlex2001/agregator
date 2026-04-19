"use client";

import { useNotifications } from "@/shared/ui/Notifications";
import { AddReviewModalContainer } from "@/source/features/reviews";
import { CompletionModal, useResponses } from "@/source/features/responses";
import { ResponsesList } from "./ResponsesList";

export function CustomerResponsesWidget() {
  const { showSuccess } = useNotifications();
  const model = useResponses("customer");

  const actionHandlers = {
    onWithdraw: model.onWithdraw,
    onEdit: model.onEdit,
    onShare: (pid: string) => model.onShare(pid, () => showSuccess("Ссылка скопирована")),
    onChat: model.onChat,
    onStart: model.onStart,
    onComplete: model.onComplete,
    onReject: model.onReject,
    onAccept: model.onAccept,
    onSelect: model.onSelect,
    onLeaveReview: model.onLeaveReview,
  };

  return (
    <>
      <ResponsesList
        role="customer"
        title="Отклики по моим заказам"
        subtitle="Просматривайте и принимайте решения по откликам"
        model={model}
        actionHandlers={actionHandlers}
      />

      <CompletionModal
        isOpen={model.completionModal}
        onClose={model.closeCompletion}
        onLeaveReview={model.openReviewFromCompletion}
      />

      <AddReviewModalContainer
        isOpen={model.reviewModal && Boolean(model.reviewTarget)}
        customerName={model.reviewTarget?.customer ?? ""}
        orderTitle={model.reviewTarget?.orderTitle ?? ""}
        expertName={model.reviewTarget?.expertName ?? ""}
        onClose={model.closeReview}
        onSubmit={async (payload) => {
          await model.onSubmitReview(payload);
          showSuccess("Отзыв успешно опубликован");
        }}
      />
    </>
  );
}
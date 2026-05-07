"use client";

import { useNotifications } from "@/source/shared/ui/Notifications";
import { AddReviewModalContainer } from "@/source/features/reviews";
import { CompletionModal, RejectResponseModalContainer, useResponses } from "@/source/features/responses";
import { ResponsesList } from "./ResponsesList";
import { SortPills } from "@/source/features/responses-sort";

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
    onRestore: model.onRestore,
    onLeaveReview: model.onLeaveReview,
    canRestore: (card: typeof model.items[number]) => !card.orderLocked,
  };

  return (
    <>
      <ResponsesList
        role="customer"
        title="Взаимодействие по заказам"
        subtitle="Все отклики в одном месте — просмотр, управление и контроль статусов"
        model={model}
        actionHandlers={actionHandlers}
        sortSlot={<SortPills sortBy={model.sortBy} sortDir={model.sortDir} isLoading={model.isLoading} onChange={model.setSort} />}
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

      <RejectResponseModalContainer
        response={model.rejectTarget}
        isLoading={model.rejectTarget ? model.actionLoading[model.rejectTarget.id] === "reject" : false}
        onCancel={model.closeReject}
        onConfirm={model.onRejectConfirm}
      />
    </>
  );
}
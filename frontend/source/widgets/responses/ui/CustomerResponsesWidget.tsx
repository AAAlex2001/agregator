"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { AddReviewModalContainer } from "@/source/features/reviews";
import {
  CompletionModal,
  DeleteRejectedModal,
  RejectResponseModalContainer,
  useResponses,
} from "@/source/features/responses";
import { ChatModal } from "@/source/widgets/chat";
import { ResponsesList } from "./ResponsesList";
import { SortPills } from "@/source/features/responses-sort";

export function CustomerResponsesWidget() {
  const { showSuccess } = useNotifications();
  const [chatUuid, setChatUuid] = useState<string | null>(null);
  const model = useResponses("customer", setChatUuid);

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
    onDeleteRejected: model.onDeleteRejected,
    onLeaveReview: model.onLeaveReview,
    canRestore: (card: typeof model.items[number]) => !card.orderLocked,
  };

  const topSlot =
    model.activeTab === "rejected" && model.items.length > 0 ? (
      <Button variant="danger" size="sm" onClick={() => model.onDeleteAllRejected()}>
        Удалить все отклонённые
      </Button>
    ) : undefined;

  const deleteTarget = model.deleteRejectedTarget;
  const deleteMode: "single" | "all" = deleteTarget === "all" ? "all" : "single";
  const deleteCount = deleteMode === "all" ? model.items.length : undefined;
  const deleteOrderTitle =
    deleteTarget && deleteTarget !== "all" ? deleteTarget.orderTitle : undefined;

  return (
    <>
      <ResponsesList
        role="customer"
        title="Взаимодействие по заказам"
        subtitle="Все отклики в одном месте — просмотр, управление и контроль статусов"
        model={model}
        actionHandlers={actionHandlers}
        sortSlot={<SortPills sortBy={model.sortBy} sortDir={model.sortDir} isLoading={model.isLoading} onChange={model.setSort} />}
        topSlot={topSlot}
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

      <DeleteRejectedModal
        open={deleteTarget !== null}
        mode={deleteMode}
        count={deleteCount}
        orderTitle={deleteOrderTitle}
        isLoading={model.isDeletingRejected}
        onCancel={model.closeDeleteRejected}
        onConfirm={model.onDeleteRejectedConfirm}
      />

      <ChatModal
        chatUuid={chatUuid}
        open={chatUuid !== null}
        onClose={() => setChatUuid(null)}
      />
    </>
  );
}

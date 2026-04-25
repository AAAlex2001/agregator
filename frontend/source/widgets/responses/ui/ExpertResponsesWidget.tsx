"use client";

import { useNotifications } from "@/source/shared/ui/Notifications";
import { EditResponseModalContainer, useResponses, WithdrawResponseModalContainer } from "@/source/features/responses";
import { ResponsesList } from "./ResponsesList";

export function ExpertResponsesWidget() {
  const { showSuccess } = useNotifications();
  const model = useResponses("expert");

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
        role="expert"
        title="Взаимодействие по заказам"
        subtitle="Все отклики в одном месте — просмотр, управление и контроль статусов"
        model={model}
        actionHandlers={actionHandlers}
      />

      <EditResponseModalContainer
        response={model.editing}
        isSubmitting={model.editSubmitting}
        onClose={model.closeEdit}
        onSubmit={model.onEditSubmit}
      />

      <WithdrawResponseModalContainer
        response={model.withdrawTarget}
        onCancel={model.closeWithdraw}
        onConfirm={model.onWithdrawConfirm}
        isLoading={model.withdrawTarget ? model.actionLoading[model.withdrawTarget.id] === "withdraw" : false}
      />
    </>
  );
}
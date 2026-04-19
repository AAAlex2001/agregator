"use client";

import { Header } from "@/source/widgets/header";
import { useNotifications } from "@/shared/ui/Notifications";
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
      <Header />
      <ResponsesList
        role="expert"
        title="Все отклики"
        subtitle="Отслеживайте статус ваших откликов"
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
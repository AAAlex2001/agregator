"use client";

import { Header } from "@/source/widgets/header";
import { useNotifications } from "@/shared/ui/Notifications";
import OrderDetailsModal from "@/features/order/details/ui/OrderDetailsModal";
import WithdrawConfirmModal from "@/features/balance/withdraw/ui/WithdrawConfirmModal/WithdrawConfirmModal";
import { useResponses } from "@/source/features/responses";
import { ResponsesList } from "./ResponsesList";

function buildEditOrder(r: { orderId: number; orderTitle: string; customer: string; orderDate: string; badges: { text: string; variant: "blue" | "green" | "gray" | "orange" | "brown" | "purple" }[]; orderSum: string; orderCommissionAmount: string; orderTechSpecFiles: string[] }) {
  return {
    id: r.orderId,
    badges: r.badges,
    title: r.orderTitle,
    customer: r.customer,
    date: r.orderDate,
    deadlineRaw: r.orderDate,
    sum: r.orderSum,
    sumAmountRaw: 0,
    commissionAmount: r.orderCommissionAmount,
    commissionAmountRaw: 0,
    comment: "",
    technicalFiles: r.orderTechSpecFiles,
  };
}

function buildEditInit(r: { rawDeadline: string; rawSumAmount: number; commentText: string; techSpecFiles: string[]; dateLabel: string; date: string; status: string; statusColor: string; statusBg: string }) {
  return {
    deadline: r.rawDeadline,
    costEstimate: r.rawSumAmount > 0 ? String(r.rawSumAmount / 100) : "",
    comment: r.commentText,
    existingFiles: r.techSpecFiles,
    dateLabel: r.dateLabel,
    date: r.date,
    status: r.status,
    statusColor: r.statusColor,
    statusBg: r.statusBg,
  };
}

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

      <OrderDetailsModal
        isOpen={Boolean(model.editing)}
        order={model.editing ? buildEditOrder(model.editing) : null}
        onClose={model.closeEdit}
        onRespond={(_order: unknown, form: { comment: string; costEstimate: number; deadline: string; files?: File[]; keepFiles?: string[] }) => model.onEditSubmit(form)}
        isResponding={model.editSubmitting}
        initialStep="step2"
        initialData={model.editing ? buildEditInit(model.editing) : undefined}
        submitLabel="Сохранить"
      />

      <WithdrawConfirmModal
        isOpen={Boolean(model.withdrawTarget)}
        onCancel={model.closeWithdraw}
        onConfirm={model.onWithdrawConfirm}
        isLoading={model.withdrawTarget ? model.actionLoading[model.withdrawTarget.id] === "withdraw" : false}
        dateLabel={model.withdrawTarget?.dateLabel ?? ""}
        date={model.withdrawTarget?.date ?? ""}
        status={model.withdrawTarget?.status ?? ""}
        statusColor={model.withdrawTarget?.statusColor ?? ""}
        statusBg={model.withdrawTarget?.statusBg ?? ""}
        orderTitle={model.withdrawTarget?.orderTitle ?? ""}
        customer={model.withdrawTarget?.customer ?? ""}
        orderDate={model.withdrawTarget?.orderDate ?? ""}
        badges={model.withdrawTarget?.badges ?? []}
        sum={model.withdrawTarget?.orderSum || model.withdrawTarget?.sum || ""}
        balanceReturnAmount={model.withdrawTarget?.balanceReturnAmount}
      />
    </>
  );
}
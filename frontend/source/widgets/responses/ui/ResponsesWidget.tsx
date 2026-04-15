"use client";

import AuthHeader from "@/widgets/header/AuthHeader";
import { Loader, Button } from "@/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Tabs from "@/source/shared/ui/Tabs";
import { useUserProfile } from "@/shared/lib/hooks/useUserProfile";
import { useNotifications } from "@/shared/ui/Notifications";
import { ResponsesState } from "@/widgets/responses-state";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import { ResponseCard } from "@/source/entities/response";
import type { ResponseTabKey, UserRole } from "@/source/entities/response";
import { useResponses, getCardActions } from "@/source/features/responses";
import OrderDetailsModal from "@/features/order/details/ui/OrderDetailsModal";
import WithdrawConfirmModal from "@/features/balance/withdraw/ui/WithdrawConfirmModal/WithdrawConfirmModal";
import CompletionModal from "@/features/response/complete/ui/CompletionModal";
import AddReviewModal from "@/features/response/review/ui/AddReviewModal/AddReviewModal";
import s from "./ResponsesWidget.module.scss";

const PAGE_TEXT: Record<UserRole, { title: string; subtitle: string }> = {
  expert: { title: "Все отклики", subtitle: "Отслеживайте статус ваших откликов" },
  customer: { title: "Отклики по моим заказам", subtitle: "Просматривайте и принимайте решения по откликам" },
};

function buildEditOrder(r: { orderId: number; orderTitle: string; customer: string; orderDate: string; badges: { text: string; variant: "blue" | "green" | "gray" | "orange" | "brown" | "purple" }[]; orderSum: string; orderCommissionAmount: string; orderTechSpecFiles: string[] }) {
  return {
    id: r.orderId, badges: r.badges, title: r.orderTitle, customer: r.customer,
    date: r.orderDate, deadlineRaw: r.orderDate, sum: r.orderSum,
    sumAmountRaw: 0, commissionAmount: r.orderCommissionAmount, commissionAmountRaw: 0,
    comment: "", technicalFiles: r.orderTechSpecFiles,
  };
}

function buildEditInit(r: { rawDeadline: string; rawSumAmount: number; commentText: string; techSpecFiles: string[]; dateLabel: string; date: string; status: string; statusColor: string; statusBg: string }) {
  return {
    deadline: r.rawDeadline,
    costEstimate: r.rawSumAmount > 0 ? String(r.rawSumAmount / 100) : "",
    comment: r.commentText, existingFiles: r.techSpecFiles,
    dateLabel: r.dateLabel, date: r.date, status: r.status,
    statusColor: r.statusColor, statusBg: r.statusBg,
  };
}

export function ResponsesWidget() {
  const { role: profileRole } = useUserProfile();
  const role: UserRole = profileRole === "CUSTOMER" ? "customer" : "expert";
  const { showSuccess } = useNotifications();
  const h = useResponses(role);
  const text = PAGE_TEXT[role];

  const handlers = {
    onWithdraw: h.onWithdraw,
    onEdit: h.onEdit,
    onShare: (pid: string) => h.onShare(pid, () => showSuccess("Ссылка скопирована")),
    onChat: h.onChat,
    onStart: h.onStart,
    onComplete: h.onComplete,
    onReject: h.onReject,
    onAccept: h.onAccept,
    onSelect: h.onSelect,
    onLeaveReview: h.onLeaveReview,
  };

  const activeLabel = h.tabs.find((t) => t.id === h.activeTab)?.label ?? "";

  return (
    <>
      <AuthHeader />
      <div className={s.wrapper}>
        <div className={s.pageHead}>
          <Title text={text.title} as="h1" className={s.pageTitle} />
          <Subtitle text={text.subtitle} className={s.pageSubtitle} />
        </div>

        <Tabs
          variant="pill"
          tabs={h.tabs.map((t) => ({ id: t.id, label: t.label, count: t.count }))}
          activeTab={h.activeTab}
          onTabChange={(id) => h.setTab(id as ResponseTabKey)}
        />

        {h.isLoading ? (
          <div className={s.statusState}><Loader label="" size="lg" /></div>
        ) : h.error ? (
          <ResponsesState title="Ошибка загрузки" subtitle={h.error} styles={s}
            action={<Button variant="primary" size="sm" onClick={() => void h.reload()}>Повторить</Button>} />
        ) : h.items.length === 0 ? (
          <ResponsesState title={activeLabel} subtitle="Пока нет откликов" styles={s} />
        ) : (
          <ResponsesSwiper items={h.items} resetKey={h.activeTab} getKey={(r) => r.id}
            renderItem={(r) => (
              <ResponseCard card={r} role={role}
                actions={getCardActions(r, h.actionLoading[r.id] ?? null, role, handlers)} />
            )}
          />
        )}
      </div>

      {role === "expert" && (
        <>
          <OrderDetailsModal
            isOpen={Boolean(h.editing)}
            order={h.editing ? buildEditOrder(h.editing) : null}
            onClose={h.closeEdit}
            onRespond={(order: unknown, form: { comment: string; costEstimate: number; deadline: string; files?: File[]; keepFiles?: string[] }) => h.onEditSubmit(form)}
            isResponding={h.editSubmitting}
            initialStep="step2"
            initialData={h.editing ? buildEditInit(h.editing) : undefined}
            submitLabel="Сохранить"
          />
          <WithdrawConfirmModal
            isOpen={Boolean(h.withdrawTarget)}
            onCancel={h.closeWithdraw}
            onConfirm={h.onWithdrawConfirm}
            isLoading={h.withdrawTarget ? h.actionLoading[h.withdrawTarget.id] === "withdraw" : false}
            dateLabel={h.withdrawTarget?.dateLabel ?? ""}
            date={h.withdrawTarget?.date ?? ""}
            status={h.withdrawTarget?.status ?? ""}
            statusColor={h.withdrawTarget?.statusColor ?? ""}
            statusBg={h.withdrawTarget?.statusBg ?? ""}
            orderTitle={h.withdrawTarget?.orderTitle ?? ""}
            customer={h.withdrawTarget?.customer ?? ""}
            orderDate={h.withdrawTarget?.orderDate ?? ""}
            badges={h.withdrawTarget?.badges ?? []}
            sum={h.withdrawTarget?.orderSum || h.withdrawTarget?.sum || ""}
            balanceReturnAmount={h.withdrawTarget?.balanceReturnAmount}
          />
        </>
      )}

      {role === "customer" && (
        <>
          <CompletionModal
            isOpen={h.completionModal}
            onClose={h.closeCompletion}
            onLeaveReview={h.openReviewFromCompletion}
          />
          <AddReviewModal
            isOpen={h.reviewModal && Boolean(h.reviewTarget)}
            customerName={h.reviewTarget?.customer ?? ""}
            orderTitle={h.reviewTarget?.orderTitle ?? ""}
            expertName={h.reviewTarget?.expertName ?? ""}
            onClose={h.closeReview}
            onSubmit={async (payload) => {
              await h.onSubmitReview(payload);
              showSuccess("Отзыв успешно опубликован");
            }}
          />
        </>
      )}
    </>
  );
}

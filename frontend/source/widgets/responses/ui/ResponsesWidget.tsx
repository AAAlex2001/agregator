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
import styles from "./ResponsesWidget.module.scss";

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

export function ResponsesWidget({ role }: { role: UserRole }) {
  useUserProfile();
  const { showSuccess } = useNotifications();
  const s = useResponses(role);
  const text = PAGE_TEXT[role];

  const handlers = {
    onWithdraw: s.onWithdraw,
    onEdit: s.onEdit,
    onShare: (pid: string) => s.onShare(pid, () => showSuccess("Ссылка скопирована")),
    onChat: s.onChat,
    onStart: s.onStart,
    onComplete: s.onComplete,
    onReject: s.onReject,
    onAccept: s.onAccept,
    onSelect: s.onSelect,
    onLeaveReview: s.onLeaveReview,
  };

  const activeLabel = s.tabs.find((t) => t.id === s.activeTab)?.label ?? "";

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text={text.title} as="h1" className={styles.pageTitle} />
          <Subtitle text={text.subtitle} className={styles.pageSubtitle} />
        </div>

        <Tabs
          variant="pill"
          tabs={s.tabs.map((t) => ({ id: t.id, label: t.label, count: t.count }))}
          activeTab={s.activeTab}
          onTabChange={(id) => s.setTab(id as ResponseTabKey)}
        />

        {s.isLoading ? (
          <div className={styles.statusState}><Loader label="" size="lg" /></div>
        ) : s.error ? (
          <ResponsesState title="Ошибка загрузки" subtitle={s.error} styles={styles}
            action={<Button variant="primary" size="sm" onClick={() => void s.reload()}>Повторить</Button>} />
        ) : s.items.length === 0 ? (
          <ResponsesState title={activeLabel} subtitle="Пока нет откликов" styles={styles} />
        ) : (
          <ResponsesSwiper items={s.items} resetKey={s.activeTab} getKey={(r) => r.id}
            renderItem={(r) => (
              <ResponseCard card={r} role={role}
                actions={getCardActions(r, s.actionLoading[r.id] ?? null, role, handlers)} />
            )}
          />
        )}
      </div>

      {role === "expert" && (
        <>
          <OrderDetailsModal
            isOpen={Boolean(s.editing)}
            order={s.editing ? buildEditOrder(s.editing) : null}
            onClose={s.closeEdit}
            onRespond={(order: unknown, form: { comment: string; costEstimate: number; deadline: string; files?: File[]; keepFiles?: string[] }) => s.onEditSubmit(form)}
            isResponding={s.editSubmitting}
            initialStep="step2"
            initialData={s.editing ? buildEditInit(s.editing) : undefined}
            submitLabel="Сохранить"
          />
          <WithdrawConfirmModal
            isOpen={Boolean(s.withdrawTarget)}
            onCancel={s.closeWithdraw}
            onConfirm={s.onWithdrawConfirm}
            isLoading={s.withdrawTarget ? s.actionLoading[s.withdrawTarget.id] === "withdraw" : false}
            dateLabel={s.withdrawTarget?.dateLabel ?? ""}
            date={s.withdrawTarget?.date ?? ""}
            status={s.withdrawTarget?.status ?? ""}
            statusColor={s.withdrawTarget?.statusColor ?? ""}
            statusBg={s.withdrawTarget?.statusBg ?? ""}
            orderTitle={s.withdrawTarget?.orderTitle ?? ""}
            customer={s.withdrawTarget?.customer ?? ""}
            orderDate={s.withdrawTarget?.orderDate ?? ""}
            badges={s.withdrawTarget?.badges ?? []}
            sum={s.withdrawTarget?.orderSum || s.withdrawTarget?.sum || ""}
            balanceReturnAmount={s.withdrawTarget?.balanceReturnAmount}
          />
        </>
      )}

      {role === "customer" && (
        <>
          <CompletionModal
            isOpen={s.completionModal}
            onClose={s.closeCompletion}
            onLeaveReview={s.openReviewFromCompletion}
          />
          <AddReviewModal
            isOpen={s.reviewModal && Boolean(s.reviewTarget)}
            customerName={s.reviewTarget?.customer ?? ""}
            orderTitle={s.reviewTarget?.orderTitle ?? ""}
            expertName={s.reviewTarget?.expertName ?? ""}
            onClose={s.closeReview}
            onSubmit={async (payload) => {
              await s.onSubmitReview(payload);
              showSuccess("Отзыв успешно опубликован");
            }}
          />
        </>
      )}
    </>
  );
}

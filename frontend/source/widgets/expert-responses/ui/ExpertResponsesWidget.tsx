"use client";

import AuthHeader from "@/widgets/header/AuthHeader";
import { Loader, Button } from "@/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useUserProfile } from "@/shared/lib/hooks/useUserProfile";
import { useNotifications } from "@/shared/ui/Notifications";
import { ResponsesState, ResponsesTabs } from "@/widgets/responses-state";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import { ResponseCard } from "@/source/entities/response";
import { useExpertResponses, getCardActions } from "@/source/features/expert-responses";
import OrderDetailsModal from "@/features/order/details/ui/OrderDetailsModal";
import WithdrawConfirmModal from "@/features/balance/withdraw/ui/WithdrawConfirmModal/WithdrawConfirmModal";
import styles from "./ExpertResponsesWidget.module.scss";

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
  useUserProfile();
  const { showSuccess } = useNotifications();
  const s = useExpertResponses();

  const handlers = {
    onWithdraw: s.onWithdraw,
    onEdit: s.onEdit,
    onShare: (pid: string) => s.onShare(pid, () => showSuccess("Ссылка скопирована")),
    onChat: s.onChat,
    onStart: s.onStart,
    onComplete: s.onComplete,
  };

  const activeLabel = s.tabs.find((t) => t.id === s.activeTab)?.label ?? "";

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text="Все отклики" as="h1" className={styles.pageTitle} />
          <Subtitle text="Отслеживайте статус ваших откликов" className={styles.pageSubtitle} />
        </div>

        <ResponsesTabs
          tabs={s.tabs.map((t) => ({ key: t.id, label: t.label, count: t.count ?? 0 }))}
          activeTab={s.activeTab}
          onChange={s.setTab}
          styles={styles}
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
              <ResponseCard
                card={r}
                actions={getCardActions(r, s.actionLoading[r.id] ?? null, handlers)}
              />
            )}
          />
        )}
      </div>

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
  );
}

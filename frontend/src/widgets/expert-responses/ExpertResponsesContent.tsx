"use client";

import AuthHeader from "@/widgets/header/AuthHeader";
import { Loader, Title, Subtitle, Button } from "@/shared/ui";
import { useUserProfile } from "@/shared/lib/hooks/useUserProfile";
import { useNotifications } from "@/shared/ui/Notifications";
import { ResponsesState, ResponsesTabs } from "@/widgets/responses-state";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import { ExpertResponseCard } from "@/features/response/list-expert/ui/ExpertResponseCard";
import OrderDetailsModal from "@/features/order/details/ui/OrderDetailsModal";
import WithdrawConfirmModal from "@/features/balance/withdraw/ui/WithdrawConfirmModal/WithdrawConfirmModal";
import { useExpertResponsesState } from "@/features/response/list-expert/model/state";
import styles from "./expert-responses.module.scss";

export function ExpertResponsesContent() {
  useUserProfile();
  const { showSuccess } = useNotifications();
  const s = useExpertResponsesState();

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text="Все отклики" className={styles.pageTitle} as="h1" />
          <Subtitle text="Отслеживайте статус ваших откликов" className={styles.pageSubtitle} />
        </div>

        <ResponsesTabs tabs={s.tabs} activeTab={s.activeTab} onChange={s.setActiveTab} styles={styles} />

        {s.isLoading ? (
          <div className={styles.statusState}><Loader label="" size="lg" /></div>
        ) : s.error ? (
          <ResponsesState title="Ошибка загрузки" subtitle={s.error} styles={styles}
            action={<Button variant="primary" size="sm" onClick={() => void s.reload()}>Повторить</Button>} />
        ) : s.items.length === 0 ? (
          <ResponsesState title={s.activeTabLabel} subtitle="Пока нет откликов" styles={styles} />
        ) : (
          <ResponsesSwiper items={s.items} resetKey={s.activeTab} getKey={(r) => r.id}
            renderItem={(r) => (
              <ExpertResponseCard
                response={r}
                actionLoading={s.actionLoading[r.id] ?? null}
                onWithdraw={s.setWithdrawTarget}
                onChangeOffer={s.setEditingResponse}
                onShare={(pid) => s.onShare(pid, () => showSuccess("Ссылка скопирована"))}
                onChat={s.onChat}
                onStart={s.onStart}
                onComplete={s.onComplete}
              />
            )}
          />
        )}
      </div>

      <OrderDetailsModal
        isOpen={Boolean(s.editingResponse)}
        order={s.editOrderDetails}
        onClose={() => s.setEditingResponse(null)}
        onRespond={s.onEditSubmit}
        isResponding={s.isEditSubmitting}
        initialStep="step2"
        initialData={s.editInitialData}
        submitLabel="Сохранить"
      />

      <WithdrawConfirmModal
        isOpen={Boolean(s.withdrawTarget)}
        onCancel={() => s.setWithdrawTarget(null)}
        onConfirm={s.onWithdrawConfirm}
        isLoading={s.withdrawTarget ? s.actionLoading[s.withdrawTarget.id] === "withdraw" : false}
        {...s.withdrawProps}
      />
    </>
  );
}

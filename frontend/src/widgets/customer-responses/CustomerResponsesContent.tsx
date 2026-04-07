"use client";

import AuthHeader from "@/widgets/header/AuthHeader";
import { Loader, Title, Subtitle, Button } from "@/shared/ui";
import { useNotifications } from "@/shared/ui/Notifications";
import { ResponsesState, ResponsesTabs } from "@/widgets/responses-state";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import { CustomerResponseCard } from "@/features/response/list-customer/ui/CustomerResponseCard";
import CompletionModal from "@/features/response/complete/ui/CompletionModal";
import AddReviewModal from "@/features/response/review/ui/AddReviewModal/AddReviewModal";
import { useCustomerResponsesState } from "@/features/response/list-customer/model/state";
import styles from "@/widgets/expert-responses/expert-responses.module.scss";

export function CustomerResponsesContent() {
  const { showSuccess, showError } = useNotifications();
  const s = useCustomerResponsesState();

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text="Отклики по моим заказам" className={styles.pageTitle} as="h1" />
          <Subtitle text="Просматривайте и принимайте решения по откликам" className={styles.pageSubtitle} />
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
              <CustomerResponseCard
                response={r}
                updatingId={s.updatingId}
                chatOpeningId={s.chatOpeningId}
                onReject={s.onReject}
                onAccept={s.onAccept}
                onSelect={s.onSelect}
                onChat={s.onChat}
                onComplete={s.onComplete}
                onLeaveReview={s.onLeaveReview}
              />
            )}
          />
        )}
      </div>

      <CompletionModal
        isOpen={s.isCompletionModalOpen}
        onClose={s.onCloseCompletion}
        onLeaveReview={s.onOpenReviewFromCompletion}
      />

      <AddReviewModal
        isOpen={s.isReviewModalOpen && !!s.reviewTarget}
        customerName={s.reviewTarget?.customerCompany || s.reviewTarget?.customer || ""}
        orderTitle={s.reviewTarget?.orderTitle || ""}
        expertName={s.reviewTarget?.expertName || ""}
        onClose={s.onCloseReview}
        onSubmit={async (payload) => {
          await s.onSubmitReview(payload);
          showSuccess("Отзыв успешно опубликован");
        }}
      />
    </>
  );
}

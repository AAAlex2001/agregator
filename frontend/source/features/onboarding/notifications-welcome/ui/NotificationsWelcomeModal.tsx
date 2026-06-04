"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/source/shared/ui/Modal";
import Button from "@/source/shared/ui/Button";
import { TabNotificationIcon } from "@/source/shared/ui/icons";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { markNotificationsIntroduced } from "../api/notifications-introduced.api";
import s from "./NotificationsWelcomeModal.module.scss";

export function NotificationsWelcomeModal() {
  const { user, role, reload } = useSession();
  const { showError } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const eligibleRole = role === "CUSTOMER" || role === "EXPERT";
  const isOpen = Boolean(user) && eligibleRole && user?.notifications_introduced === false;

  const goToProfile = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    router.push("/settings");
    try {
      await markNotificationsIntroduced();
      await reload();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить отметку");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => undefined}
      isBusy={isSubmitting}
      size="md"
      ariaLabelledBy="notifications-welcome-title"
      hideCloseButton
    >
      <div className={s.body}>
        <div className={s.iconWrap} aria-hidden="true">
          <TabNotificationIcon className={s.icon} />
        </div>
        <h2 id="notifications-welcome-title" className={s.title}>
          Почтовые уведомления
        </h2>
        <p className={s.text}>Предлагаем Вам настроить почтовые уведомления в Вашем профиле</p>
        <div className={s.actions}>
          <Button
            variant="primary"
            size="md"
            showArrow
            fullWidth
            onClick={() => void goToProfile()}
            isLoading={isSubmitting}
          >
            Перейти в профиль
          </Button>
        </div>
      </div>
    </Modal>
  );
}

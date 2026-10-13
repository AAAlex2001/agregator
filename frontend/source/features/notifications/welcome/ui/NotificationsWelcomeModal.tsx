"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/source/entities/session";
import { markNotificationsIntroduced } from "@/source/entities/user";
import Button from "@/source/shared/ui/Button";
import { TabNotificationIcon } from "@/source/shared/ui/icons";
import { Modal } from "@/source/shared/ui/Modal";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./NotificationsWelcomeModal.module.scss";

/** Показывается заказчику и исполнителю один раз после регистрации: зовёт настроить почтовые уведомления. */
export function NotificationsWelcomeModal() {
  const router = useRouter();
  const { user, role, reload } = useSession();
  const { showError } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = user?.notifications_introduced === false && (role === "CUSTOMER" || role === "EXPERT");

  const goToSettings = async () => {
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
          <Button variant="primary" size="md" showArrow fullWidth isLoading={isSubmitting} onClick={goToSettings}>
            Перейти в профиль
          </Button>
        </div>
      </div>
    </Modal>
  );
}

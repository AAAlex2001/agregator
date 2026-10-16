"use client";

import { Button } from "@/shared/ui/button";
import { TabNotificationIcon } from "@/shared/ui/icons";
import { Modal } from "@/shared/ui/modal";
import { useNotificationsIntroduction } from "../../model/use-notifications-introduction";
import type { NotificationsIntroductionOptions } from "../../model/types";
import styles from "./style.module.scss";

/** Окно знакомства закрывается только после перехода к настройке уведомлений. */
export function NotificationsWelcomeModal(props: NotificationsIntroductionOptions) {
  const { isOpen, isSaving, openSettings } = useNotificationsIntroduction(props);

  /** Оставляет приглашение открытым при Escape и нажатии на фон. */
  function keepOpen() {}

  return (
    <Modal
      open={isOpen}
      onClose={keepOpen}
      isBusy={isSaving}
      size="md"
      ariaLabelledBy="notifications-welcome-title"
      hideCloseButton
    >
      <div className={styles.body}>
        <div
          className={styles.iconWrap}
          aria-hidden="true"
        >
          <TabNotificationIcon className={styles.icon} />
        </div>
        <h2
          id="notifications-welcome-title"
          className={styles.title}
        >
          Почтовые уведомления
        </h2>
        <p className={styles.text}>
          Предлагаем Вам настроить почтовые уведомления в Вашем профиле
        </p>
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="md"
            showArrow
            fullWidth
            isLoading={isSaving}
            onClick={openSettings}
          >
            Перейти в профиль
          </Button>
        </div>
      </div>
    </Modal>
  );
}

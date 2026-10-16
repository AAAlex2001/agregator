"use client";

import { Button } from "@/shared/ui/button";
import { useDisableNotifications } from "../../model/use-disable-notifications";
import type { DisableNotificationsOptions } from "../../model/types";
import styles from "./style.module.scss";

/** Отключает все почтовые уведомления одной кнопкой. */
export function DisableNotificationsButton({
  disabled = false,
  onBusyChange,
}: DisableNotificationsOptions) {
  const { isPending, disableAll } = useDisableNotifications({
    disabled,
    onBusyChange,
  });

  return (
    <Button
      variant="danger"
      size="sm"
      className={styles.button}
      isLoading={isPending}
      disabled={disabled}
      onClick={disableAll}
    >
      Отключить все
    </Button>
  );
}

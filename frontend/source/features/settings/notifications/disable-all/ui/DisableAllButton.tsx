"use client";

import Button from "@/source/shared/ui/Button";
import { useDisableAll } from "../model/useDisableAll";
import s from "./DisableAllButton.module.scss";

/** Кнопка «Отключить все» почтовые уведомления. */
export function DisableAllButton() {
  const { isPending, disableAll } = useDisableAll();

  return (
    <Button variant="danger" size="sm" className={s.button} isLoading={isPending} onClick={disableAll}>
      Отключить все
    </Button>
  );
}

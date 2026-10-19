"use client";

import { ActionMenu } from "@/shared/ui/action-menu";
import type { MenuAction } from "@/shared/ui/action-menu";
import { PlusIcon } from "@/shared/ui/icons";
import { NEW_POST_ACTIONS } from "../../config/new-post-actions";
import styles from "./style.module.scss";

/** Кнопка «Новый пост» с выбором: в Telegram или на сайт. */
export function NewPostMenu() {
  const actions: MenuAction[] = NEW_POST_ACTIONS.map((action) => {
    const Icon = action.icon;

    return {
      href: action.href,
      label: action.label,
      description: action.description,
      icon: <Icon className={styles[action.tone]} />,
    };
  });

  return (
    <ActionMenu
      label="Новый пост"
      actions={actions}
      triggerClassName={styles.trigger}
      trigger={(
        <>
          <PlusIcon />
          Новый пост
        </>
      )}
    />
  );
}

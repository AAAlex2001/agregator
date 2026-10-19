"use client";

import { ActionMenuList, useActionMenu } from "@/shared/ui/action-menu";
import type { MenuAction } from "@/shared/ui/action-menu";
import { Button } from "@/shared/ui/button";
import { PlusIcon } from "@/shared/ui/icons";
import { NEW_POST_ACTIONS } from "../../config/new-post-actions";
import styles from "./style.module.scss";

/** Кнопка «Новый пост» с выбором: в Telegram или на сайт. */
export function NewPostMenu() {
  const {
    rootRef,
    isOpen,
    toggle,
    close,
  } = useActionMenu();
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
    <div
      ref={rootRef}
      className={styles.menu}
    >
      <Button
        className={styles.button}
        onClick={toggle}
      >
        <PlusIcon />
        Новый пост
      </Button>
      {isOpen && (
        <ActionMenuList
          actions={actions}
          onClose={close}
        />
      )}
    </div>
  );
}

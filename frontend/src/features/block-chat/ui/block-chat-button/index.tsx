"use client";

import type { ChatDetailData } from "@/entities/chat";
import { LockIcon } from "@/shared/ui/icons";
import { useBlockChat } from "../../model/use-block-chat";
import styles from "./style.module.scss";

/** Переписка заказчика и получатель её нового состояния. */
interface BlockChatButtonProps {
  chat: ChatDetailData;
  onChanged: (chat: ChatDetailData) => void;
}

/** Замок с подписью: заказчик блокирует исполнителя или снимает блокировку. */
export function BlockChatButton({ chat, onChanged }: BlockChatButtonProps) {
  const { isChanging, toggleBlock } = useBlockChat(chat, onChanged);
  const isBlocked = chat.is_manually_blocked;
  const label = isBlocked ? "Разблокировать" : "Заблокировать";

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.button}
        onClick={toggleBlock}
        disabled={isChanging}
        aria-label={`${label} чат`}
        data-blocked={isBlocked}
      >
        <LockIcon size={22} />
      </button>
      <span
        className={styles.label}
        data-blocked={isBlocked}
      >
        {label}
      </span>
    </div>
  );
}

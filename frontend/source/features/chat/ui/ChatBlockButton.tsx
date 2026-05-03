"use client";

import { useState } from "react";
import type { ChatDetailData } from "@/source/entities/chat";
import { LockIcon } from "@/source/shared/ui/icons";
import { blockChat, unblockChat } from "../api/chat.api";
import s from "./ChatBlockButton.module.scss";

interface ChatBlockButtonProps {
  chatUuid: string;
  isBlocked: boolean;
  onChanged: (chat: ChatDetailData) => void;
}

export function ChatBlockButton({ chatUuid, isBlocked, onChanged }: ChatBlockButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const label = isBlocked ? "Разблокировать" : "Заблокировать";

  async function handleClick() {
    if (loading) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const updatedChat = isBlocked ? await unblockChat(chatUuid) : await blockChat(chatUuid);
      onChanged(updatedChat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось изменить блокировку чата");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.wrap}>
      <button
        type="button"
        className={s.button}
        onClick={() => void handleClick()}
        disabled={loading}
        aria-label={`${label} чат`}
        data-blocked={isBlocked}
      >
        <LockIcon size={22} />
      </button>
      <span className={s.label} data-blocked={isBlocked}>{label}</span>
      {error ? <span className={s.error}>{error}</span> : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import type { ChatDetailData } from "@/source/entities/chat";
import { LockIcon } from "@/source/shared/ui/icons";
import { blockChat } from "../api/chat.api";
import s from "./ChatBlockButton.module.scss";

interface ChatBlockButtonProps {
  chatUuid: string;
  onBlocked: (chat: ChatDetailData) => void;
}

export function ChatBlockButton({ chatUuid, onBlocked }: ChatBlockButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const blockedChat = await blockChat(chatUuid);
      onBlocked(blockedChat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось заблокировать чат");
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
        aria-label="Заблокировать чат"
      >
        <LockIcon size={22} />
      </button>
      <span className={s.label}>Заблокировать</span>
      {error ? <span className={s.error}>{error}</span> : null}
    </div>
  );
}

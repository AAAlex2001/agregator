"use client";

import { useState } from "react";
import { MessageComposer } from "@/source/shared/ui/MessageComposer";
import type { ExpertRoomMessageData } from "@/source/entities/expert-room";
import { sendExpertRoomMessage } from "../api/expert-room.api";
import s from "./ExpertRoomComposer.module.scss";

interface Props {
  disabled?: boolean;
  disabledText?: string;
  onSent: (message: ExpertRoomMessageData) => void;
  onTyping: () => void;
}

export function ExpertRoomComposer({ disabled = false, disabledText, onSent, onTyping }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (sending || text.trim().length === 0) return;

    setError(null);
    setSending(true);
    try {
      const saved = await sendExpertRoomMessage(text.trim());
      setText("");
      onSent(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить сообщение");
    } finally {
      setSending(false);
    }
  }

  function handleChange(next: string) {
    setText(next);
    if (next.length > 0) {
      onTyping();
    }
  }

  return (
    <MessageComposer
      value={text}
      onChange={handleChange}
      onSend={handleSend}
      placeholder="Сообщение всем экспертам..."
      disabled={disabled}
      disabledText={disabledText ?? "Отправка недоступна"}
      sending={sending}
      extras={error ? <p className={s.error}>{error}</p> : null}
    />
  );
}

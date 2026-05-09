"use client";

import { useState } from "react";
import Loader from "@/source/shared/ui/Loader";
import { ChatSendIcon } from "@/source/shared/ui/icons";
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

  const canSend = !disabled && !sending && text.trim().length > 0;

  async function handleSend() {
    if (!canSend) return;

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

  if (disabled) {
    return (
      <div className={s.wrap}>
        <div className={`${s.bar} ${s.barBlocked}`}>
          <p className={s.blockedText}>{disabledText ?? "Отправка недоступна"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      {error ? <p className={s.error}>{error}</p> : null}

      <div className={s.bar}>
        <div className={s.inputWrap}>
          <input
            className={s.input}
            type="text"
            placeholder="Сообщение всем экспертам..."
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (event.target.value.length > 0) {
                onTyping();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSend();
              }
            }}
            disabled={sending}
          />
        </div>

        <button
          type="button"
          className={s.send}
          onClick={() => void handleSend()}
          disabled={!canSend}
          aria-label="Отправить"
        >
          {sending ? <Loader size="sm" label="" /> : <ChatSendIcon />}
        </button>
      </div>
    </div>
  );
}

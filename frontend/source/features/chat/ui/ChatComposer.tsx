"use client";

import { useRef, useState } from "react";
import Loader from "@/source/shared/ui/Loader";
import { ChatClipIcon, ChatSendIcon } from "@/source/shared/ui/icons";
import type { ChatMessageData } from "@/source/entities/chat";
import { sendChatMessage } from "../api/chat.api";
import { FilePending, UploadProgress } from "./FilePending";
import s from "./ChatComposer.module.scss";

interface ChatComposerProps {
  chatUuid: string;
  onSent: (message: ChatMessageData) => void;
}

const ACCEPT = ".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx";
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export function ChatComposer({ chatUuid, onSent }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const sendingFile = sending && file !== null;
  const canSend = !sending && (text.trim().length > 0 || file !== null);

  async function handleSend() {
    if (!canSend) {
      return;
    }

    setError(null);
    setSending(true);
    setProgress(0);

    try {
      const saved = await sendChatMessage(chatUuid, text.trim(), file, (percent) => setProgress(percent));
      setText("");
      setFile(null);
      onSent(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить сообщение");
    } finally {
      setSending(false);
      setProgress(0);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.currentTarget.files?.[0] ?? null;
    event.currentTarget.value = "";

    if (!nextFile) {
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setError("Файл больше 100 МБ не поддерживается");
      return;
    }

    setError(null);
    setFile(nextFile);
  }

  return (
    <div className={s.wrap}>
      {sendingFile ? <UploadProgress percent={progress} /> : null}
      {file && !sending ? <FilePending file={file} onRemove={() => setFile(null)} /> : null}
      {error ? <p className={s.error}>{error}</p> : null}

      <div className={s.bar}>
        <div className={s.inputWrap}>
          <input
            className={s.input}
            type="text"
            placeholder="Сообщение..."
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void handleSend();
              }
            }}
            disabled={sending}
          />

          <button
            type="button"
            className={s.clip}
            aria-label="Прикрепить файл"
            onClick={() => fileRef.current?.click()}
            disabled={sending}
          >
            <ChatClipIcon />
          </button>

          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            hidden
            onChange={handleFileChange}
          />
        </div>

        <button
          type="button"
          className={s.send}
          onClick={() => void handleSend()}
          disabled={!canSend}
          aria-label="Отправить"
        >
          {sending && !sendingFile ? <Loader size="sm" label="" /> : <ChatSendIcon />}
        </button>
      </div>
    </div>
  );
}
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
const MAX_FILES = 6;

export function ChatComposer({ chatUuid, onSent }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const sendingFiles = sending && files.length > 0;
  const canSend = !sending && (text.trim().length > 0 || files.length > 0);

  async function handleSend() {
    if (!canSend) {
      return;
    }

    setError(null);
    setSending(true);
    setProgress(0);

    try {
      const saved = await sendChatMessage(chatUuid, text.trim(), files, (percent) => setProgress(percent));
      setText("");
      setFiles([]);
      onSent(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить сообщение");
    } finally {
      setSending(false);
      setProgress(0);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    if (!nextFiles.length) {
      return;
    }

    if (files.length + nextFiles.length > MAX_FILES) {
      setError(`Можно прикрепить не больше ${MAX_FILES} файлов`);
      return;
    }

    for (const nextFile of nextFiles) {
      if (nextFile.size > MAX_FILE_SIZE) {
        setError(`Файл ${nextFile.name} больше 100 МБ не поддерживается`);
        return;
      }
    }

    setError(null);
    setFiles((currentFiles) => [...currentFiles, ...nextFiles]);
  }

  return (
    <div className={s.wrap}>
      {sendingFiles ? <UploadProgress percent={progress} /> : null}
      {files.length && !sending ? <FilePending files={files} onRemove={(index) => setFiles((currentFiles) => currentFiles.filter((_, fileIndex) => fileIndex !== index))} /> : null}
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
            onClick={() => {
              if (files.length >= MAX_FILES) {
                setError(`Можно прикрепить не больше ${MAX_FILES} файлов`);
                return;
              }

              fileRef.current?.click();
            }}
            disabled={sending}
          >
            <ChatClipIcon />
          </button>

          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            multiple
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
          {sending ? <Loader size="sm" label="" /> : <ChatSendIcon />}
        </button>
      </div>
    </div>
  );
}
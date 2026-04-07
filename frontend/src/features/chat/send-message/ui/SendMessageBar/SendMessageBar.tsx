"use client";

import { useRef, useState } from "react";
import Button from "@/shared/ui/Button/Button";
import { ChatClipIcon, ChatSendIcon } from "@/shared/ui/icons";
import { sendChatMessage, type ChatMessage } from "@/shared/lib/chatApi";
import { FilePending, UploadProgress } from "./FilePending";
import styles from "./send-message-bar.module.scss";

interface SendMessageBarProps {
  chatUuid: string;
  onSent: (msg: ChatMessage) => void;
}

const ACCEPT = ".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx";

export function SendMessageBar({ chatUuid, onSent }: SendMessageBarProps) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const sendingFile = sending && pending !== null;
  const canSend = !sending && (text.trim().length > 0 || pending !== null);

  async function handleSend() {
    if (!canSend) return;
    const value = text.trim();
    const file = pending;
    setText("");
    setPending(null);
    setSending(true);
    setProgress(0);
    try {
      const saved = await sendChatMessage(chatUuid, value, file, (pct) => setProgress(pct));
      onSent(saved);
    } catch {
      /* noop */
    } finally {
      setSending(false);
      setProgress(0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.currentTarget.files?.[0] ?? null;
    if (f) setPending(f);
    e.currentTarget.value = "";
  }

  return (
    <div className={styles.bar}>
      {sendingFile && <UploadProgress percent={progress} />}
      {pending && !sending && <FilePending file={pending} onRemove={() => setPending(null)} />}
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          type="text"
          placeholder="Сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
        />
        <Button
          variant="transparent"
          className={styles.clip}
          aria-label="Прикрепить файл"
          onClick={() => fileRef.current?.click()}
          disabled={sending}
        >
          <ChatClipIcon />
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          style={{ display: "none" }}
          tabIndex={-1}
          onChange={handleFileChange}
        />
      </div>
      <Button
        variant="primary"
        className={styles.send}
        onClick={handleSend}
        disabled={!canSend}
        isLoading={sending && !sendingFile}
        aria-label="Отправить"
      >
        <ChatSendIcon />
      </Button>
    </div>
  );
}

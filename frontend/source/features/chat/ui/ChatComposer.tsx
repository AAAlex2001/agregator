"use client";

import { useRef } from "react";
import { AttachmentComposer } from "@/source/shared/ui/AttachmentComposer";
import type { ChatMessageData } from "@/source/entities/chat";
import { sendChatMessage } from "@/source/entities/chat";

interface ChatComposerProps {
  chatUuid: string;
  isBlocked?: boolean;
  blockedText?: string;
  onSent: (message: ChatMessageData) => void;
}

const DEFAULT_BLOCKED_TEXT = "Чат по этому заказу завершен";

export function ChatComposer({ chatUuid, isBlocked = false, blockedText = DEFAULT_BLOCKED_TEXT, onSent }: ChatComposerProps) {
  const requestRef = useRef<{
    fingerprint: string;
    id: string;
  } | null>(null);

  const send = async (
    text: string,
    files: File[],
    onProgress: (percent: number) => void,
  ) => {
    const fingerprint = JSON.stringify([
      text,
      files.map((file) => [
        file.name,
        file.size,
        file.type,
        file.lastModified,
      ]),
    ]);
    if (requestRef.current?.fingerprint !== fingerprint) {
      requestRef.current = {
        fingerprint,
        id: crypto.randomUUID(),
      };
    }
    const message = await sendChatMessage(
      chatUuid,
      text,
      files,
      requestRef.current.id,
      onProgress,
    );
    requestRef.current = null;
    return message;
  };

  return (
    <AttachmentComposer<ChatMessageData>
      send={send}
      onSent={onSent}
      disabled={isBlocked}
      disabledText={blockedText}
    />
  );
}

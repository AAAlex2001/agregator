"use client";

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
  return (
    <AttachmentComposer<ChatMessageData>
      send={(text, files, onProgress) => sendChatMessage(chatUuid, text, files, onProgress)}
      onSent={onSent}
      disabled={isBlocked}
      disabledText={blockedText}
    />
  );
}

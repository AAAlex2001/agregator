"use client";

import { AttachmentComposer } from "@/source/shared/ui/AttachmentComposer";
import type { ExpertRoomMessageData } from "@/source/entities/expert-room";
import { sendExpertRoomMessage } from "@/source/entities/expert-room";

interface Props {
  disabled?: boolean;
  disabledText?: string;
  onSent: (message: ExpertRoomMessageData) => void;
  onTyping: () => void;
}

export function ExpertRoomComposer({ disabled = false, disabledText, onSent, onTyping }: Props) {
  return (
    <AttachmentComposer<ExpertRoomMessageData>
      send={(text, files, onProgress) => sendExpertRoomMessage(text, files, onProgress)}
      onSent={onSent}
      onTextChange={(next) => {
        if (next.length > 0) onTyping();
      }}
      placeholder="Сообщение всем исполнителям..."
      disabled={disabled}
      disabledText={disabledText ?? "Отправка недоступна"}
    />
  );
}

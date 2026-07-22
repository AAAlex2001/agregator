"use client";

import { Modal } from "@/source/shared/ui";
import { ChatConversationWidget } from "./ChatConversationWidget";
import s from "./ChatModal.module.scss";

interface ChatModalProps {
  chatUuid: string | null;
  open: boolean;
  onClose: () => void;
}

export function ChatModal({ chatUuid, open, onClose }: ChatModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      hideCloseButton
      ariaLabel="Чат по сделке"
      dialogClassName={s.dialog}
    >
      {chatUuid ? (
        <ChatConversationWidget chatUuid={chatUuid} embedded onClose={onClose} />
      ) : null}
    </Modal>
  );
}

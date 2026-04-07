import { Avatar, AvatarSpacer } from "@/entities/chat/ui/Avatar";
import { MessageBubble } from "@/entities/chat/ui/MessageBubble";
import type { ChatMessage } from "@/shared/lib/chatApi";
import styles from "./message-group.module.scss";

export interface MessageGroupData {
  senderId: number;
  senderRole: string;
  messages: ChatMessage[];
}

interface MessageGroupProps {
  group: MessageGroupData;
  isMine: boolean;
  counterpartAvatarUrl?: string | null;
}

export function MessageGroup({ group, isMine, counterpartAvatarUrl }: MessageGroupProps) {
  const senderLabel = group.senderRole === "CUSTOMER" ? "Заказчик" : "Эксперт";
  const groupClass = isMine ? styles.sent : styles.received;
  const labelClass = `${styles.label} ${isMine ? styles.alignRight : ""}`;

  return (
    <div className={groupClass}>
      <span className={labelClass}>{senderLabel}</span>
      {group.messages.map((message, mi) => {
        const isLast = mi === group.messages.length - 1;
        const avatarSlot = isLast ? (
          <Avatar src={isMine ? "" : counterpartAvatarUrl} alt={isMine ? "Ваш аватар" : "Аватар собеседника"} />
        ) : (
          <AvatarSpacer />
        );

        return (
          <div key={message.id} className={isMine ? styles.rowSent : styles.rowReceived}>
            {!isMine && avatarSlot}
            <MessageBubble message={message} isMine={isMine} />
            {isMine && avatarSlot}
          </div>
        );
      })}
    </div>
  );
}

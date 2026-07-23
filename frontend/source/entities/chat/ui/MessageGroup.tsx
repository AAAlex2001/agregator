import type {
  ChatMessageData,
  ChatParticipantRole,
} from "@/source/entities/chat";
import { ChatAvatar, ChatAvatarSpacer } from "./ChatAvatar";
import { MessageBubble } from "./MessageBubble";
import s from "./MessageGroup.module.scss";

export interface ChatMessageGroupData {
  senderId: number;
  senderRole: ChatParticipantRole;
  messages: ChatMessageData[];
}

interface MessageGroupProps {
  group: ChatMessageGroupData;
  isMine: boolean;
  currentUserAvatarUrl?: string | null;
  counterpartAvatarUrl?: string | null;
}

export function MessageGroup({ group, isMine, currentUserAvatarUrl, counterpartAvatarUrl }: MessageGroupProps) {
  const senderLabel = {
    CUSTOMER: "Заказчик",
    EXPERT: "Эксперт",
    LICENSE_HOLDER: "Держатель лицензии",
  }[group.senderRole];
  const groupClass = isMine ? s.sent : s.received;
  const labelClass = `${s.label} ${isMine ? s.alignRight : ""}`.trim();

  return (
    <div className={groupClass}>
      <span className={labelClass}>{senderLabel}</span>
      {group.messages.map((message, messageIndex) => {
        const isLast = messageIndex === group.messages.length - 1;
        const avatarSrc = isMine ? currentUserAvatarUrl : counterpartAvatarUrl;
        const avatarSlot = isLast
          ? <ChatAvatar src={avatarSrc} alt={isMine ? "Ваш аватар" : "Аватар собеседника"} />
          : <ChatAvatarSpacer />;

        return (
          <div key={message.id} className={isMine ? s.rowSent : s.rowReceived}>
            {!isMine ? avatarSlot : null}
            <MessageBubble message={message} isMine={isMine} />
            {isMine ? avatarSlot : null}
          </div>
        );
      })}
    </div>
  );
}

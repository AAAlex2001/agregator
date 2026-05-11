import { ChatAvatar, ChatAvatarSpacer, MessageBubble } from "@/source/entities/chat";
import type { ChatMessageData } from "@/source/entities/chat";
import type { ExpertRoomMessageData, ExpertRoomMessageGroup as Group } from "../model/types";
import s from "./ExpertRoomMessageGroup.module.scss";

interface Props {
  group: Group;
  isMine: boolean;
  currentUserAvatarUrl?: string | null;
}

function toBubbleMessage(message: ExpertRoomMessageData, isMine: boolean): ChatMessageData {
  return {
    id: message.id,
    chat_id: 0,
    sender_id: message.sender_id,
    sender_role: isMine ? "EXPERT" : "EXPERT",
    text: message.text,
    file_url: null,
    file_name: null,
    attachments: message.attachments ?? [],
    is_read: true,
    created_at: message.created_at,
  };
}

export function ExpertRoomMessageGroup({ group, isMine, currentUserAvatarUrl }: Props) {
  const groupClass = isMine ? s.sent : s.received;
  const labelClass = `${s.label} ${isMine ? s.alignRight : ""}`.trim();
  const avatarSrc = isMine ? currentUserAvatarUrl : group.senderAvatarUrl;
  const avatarAlt = isMine ? "Ваш аватар" : `Аватар ${group.senderName}`;

  return (
    <div className={groupClass}>
      <span className={labelClass}>{isMine ? "Вы" : group.senderName}</span>
      {group.messages.map((message, index) => {
        const isLast = index === group.messages.length - 1;
        const avatarSlot = isLast
          ? <ChatAvatar src={avatarSrc} alt={avatarAlt} />
          : <ChatAvatarSpacer />;

        return (
          <div key={message.id} className={isMine ? s.rowSent : s.rowReceived}>
            {!isMine ? avatarSlot : null}
            <MessageBubble message={toBubbleMessage(message, isMine)} isMine={isMine} />
            {isMine ? avatarSlot : null}
          </div>
        );
      })}
    </div>
  );
}

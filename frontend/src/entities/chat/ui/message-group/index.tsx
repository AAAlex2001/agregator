import cn from "classnames";
import type { ChatMessageGroup } from "../../model/types";
import { ChatAvatar } from "../chat-avatar";
import { MessageBubble } from "../message-bubble";
import styles from "./style.module.scss";

/** Названия ролей отправителей над группой сообщений. */
const SENDER_LABELS = {
  CUSTOMER: "Заказчик",
  EXPERT: "Исполнитель",
  LICENSE_HOLDER: "Держатель разрешительных документов",
};

/** Сообщения одного отправителя, сторона переписки и фото отправителя. */
interface MessageGroupProps {
  group: ChatMessageGroup;
  isMine: boolean;
  avatarUrl: string | null;
}

/** Подпись роли и сообщения отправителя; фото стоит рядом с последним сообщением. */
export function MessageGroup({ group, isMine, avatarUrl }: MessageGroupProps) {
  const lastMessage = group.messages.at(-1);

  return (
    <div className={isMine ? styles.sent : styles.received}>
      <span className={cn(styles.label, { [styles.alignRight]: isMine })}>
        {SENDER_LABELS[group.senderRole]}
      </span>
      {group.messages.map((message) => {
        const avatar = message === lastMessage ? (
          <ChatAvatar
            src={avatarUrl}
            alt={isMine ? "Ваш аватар" : "Аватар собеседника"}
          />
        ) : (
          <div className={styles.avatarSpacer} />
        );

        return (
          <div
            key={message.id}
            className={isMine ? styles.rowSent : styles.rowReceived}
          >
            {!isMine && avatar}
            <MessageBubble
              message={message}
              isMine={isMine}
            />
            {isMine && avatar}
          </div>
        );
      })}
    </div>
  );
}

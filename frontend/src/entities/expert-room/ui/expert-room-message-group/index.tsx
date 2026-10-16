import cn from "classnames";
import { ChatPersonIcon } from "@/shared/ui/icons";
import { UserAvatar } from "@/shared/ui/user-avatar";
import type { ExpertRoomMessageGroup as Group } from "../../model/types";
import { ExpertRoomMessage } from "../expert-room-message";
import styles from "./style.module.scss";

/** Сообщения одного отправителя, сторона чата и фото отправителя. */
interface ExpertRoomMessageGroupProps {
  group: Group;
  isMine: boolean;
  avatarUrl: string | null;
}

/** Имя отправителя и его сообщения; фото стоит рядом с последним сообщением. */
export function ExpertRoomMessageGroup({
  group,
  isMine,
  avatarUrl,
}: ExpertRoomMessageGroupProps) {
  const lastMessage = group.messages.at(-1);

  return (
    <div className={isMine ? styles.sent : styles.received}>
      <span className={cn(styles.label, { [styles.alignRight]: isMine })}>
        {isMine ? "Вы" : group.senderName}
      </span>
      {group.messages.map((message) => {
        const avatar = message === lastMessage ? (
          <UserAvatar
            src={avatarUrl}
            alt={isMine ? "Ваш аватар" : `Аватар ${group.senderName}`}
            className={styles.avatar}
            fallback={<ChatPersonIcon className={styles.fallback} />}
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
            <ExpertRoomMessage
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

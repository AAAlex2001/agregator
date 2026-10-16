"use client";

import { countChatUnread, useChatList } from "@/entities/chat";
import type { LaborResponder } from "@/entities/labor";
import { formatMoscowDateTime } from "@/shared/lib/format-date";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Подписи ролей откликнувшихся пользователей. */
const ROLE_LABELS = {
  CUSTOMER: "Заказчик",
  EXPERT: "Исполнитель",
  LICENSE_HOLDER: "Держатель разрешительных документов",
};

/** Пользователи, откликнувшиеся на своё объявление. */
interface LaborRespondersProps {
  responders: LaborResponder[];
}

/** Показывает откликнувшихся и ссылки на чаты с непрочитанными сообщениями. */
export function LaborResponders({ responders }: LaborRespondersProps) {
  const { chats } = useChatList();

  return (
    <section className={styles.responders}>
      <h3 className={styles.title}>
        Откликнувшиеся
        <span className={styles.count}>{responders.length}</span>
      </h3>

      {responders.length === 0 ? (
        <p className={styles.empty}>Пока никто не откликнулся</p>
      ) : (
        <div className={styles.list}>
          {responders.map((responder) => {
            const unreadCount = countChatUnread(chats, responder.chat_uuid);

            return (
              <div
                key={responder.chat_uuid}
                className={styles.responder}
              >
                <div className={styles.info}>
                  <strong>{responder.name}</strong>
                  <span>
                    {ROLE_LABELS[responder.role]} ·{" "}
                    {formatMoscowDateTime(responder.responded_at)} МСК
                  </span>
                </div>
                <Button
                  variant="chat"
                  size="sm"
                  href={`/chat/${responder.chat_uuid}`}
                >
                  Открыть чат
                  {unreadCount > 0 && <span className={styles.unread}>{unreadCount}</span>}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

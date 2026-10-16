import { MessageSkeleton } from "@/entities/chat";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет разметку чата исполнителей: шапку, сообщения и поле ввода. */
export function ExpertRoomSkeleton() {
  return (
    <div
      className={styles.card}
      aria-hidden="true"
    >
      <div className={styles.header}>
        <Skeleton
          className={styles.backButton}
          rounded="lg"
        />
        <div className={styles.banner}>
          <div className={styles.badges}>
            <Skeleton
              className={styles.badge}
              rounded="pill"
            />
            <Skeleton
              className={styles.badgeShort}
              rounded="pill"
            />
          </div>
          <Skeleton className={styles.title} />
          <Skeleton
            className={styles.meta}
            rounded="pill"
          />
        </div>
      </div>

      <div className={styles.thread}>
        <div className={styles.dateSeparator}>
          <Skeleton
            className={styles.datePill}
            rounded="pill"
          />
        </div>
        <MessageSkeleton isMine />
        <MessageSkeleton isMine={false} />
        <MessageSkeleton isMine />
        <MessageSkeleton isMine={false} />
        <MessageSkeleton isMine />
        <MessageSkeleton isMine={false} />
        <MessageSkeleton isMine />
      </div>

      <div className={styles.composer}>
        <Skeleton
          className={styles.attachButton}
          rounded="lg"
        />
        <Skeleton
          className={styles.input}
          rounded="lg"
        />
        <Skeleton
          className={styles.sendButton}
          rounded="pill"
        />
      </div>
    </div>
  );
}

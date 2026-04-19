import Skeleton from "@/source/shared/ui/Skeleton";
import s from "./ChatConversationSkeleton.module.scss";

export function ChatConversationSkeleton() {
  return (
    <div className={s.card} aria-hidden="true">
      <div className={s.header}>
        <Skeleton className={s.backButton} rounded="lg" />
        <div className={s.banner}>
          <div className={s.badges}>
            <Skeleton className={s.badge} rounded="pill" />
            <Skeleton className={s.badgeShort} rounded="pill" />
          </div>
          <Skeleton className={s.title} />
          <Skeleton className={s.meta} rounded="pill" />
        </div>
      </div>

      <div className={s.thread}>
        <div className={s.dateSeparator}>
          <Skeleton className={s.datePill} rounded="pill" />
        </div>
        <div className={s.messageMine}>
          <Skeleton className={s.messageWide} rounded="lg" />
          <Skeleton className={s.messageShort} rounded="lg" />
        </div>
        <div className={s.messageOther}>
          <Skeleton className={s.messageOtherWide} rounded="lg" />
          <Skeleton className={s.messageOtherShort} rounded="lg" />
        </div>
        <div className={s.messageMine}>
          <Skeleton className={s.messageWide} rounded="lg" />
          <Skeleton className={s.messageShort} rounded="lg" />
        </div>
        <div className={s.messageOther}>
          <Skeleton className={s.messageOtherWide} rounded="lg" />
          <Skeleton className={s.messageOtherShort} rounded="lg" />
        </div>
        <div className={s.messageMine}>
          <Skeleton className={s.messageWide} rounded="lg" />
          <Skeleton className={s.messageShort} rounded="lg" />
        </div>
        <div className={s.messageOther}>
          <Skeleton className={s.messageOtherWide} rounded="lg" />
          <Skeleton className={s.messageOtherShort} rounded="lg" />
        </div>
        <div className={s.messageMine}>
          <Skeleton className={s.messageWide} rounded="lg" />
          <Skeleton className={s.messageShort} rounded="lg" />
        </div>
      </div>

      <div className={s.composer}>
        <Skeleton className={s.attachButton} rounded="lg" />
        <Skeleton className={s.input} rounded="lg" />
        <Skeleton className={s.sendButton} rounded="pill" />
      </div>
    </div>
  );
}
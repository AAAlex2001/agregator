"use client";

import { useSession } from "@/source/features/session";
import {
  groupExpertRoomMessages,
  ExpertRoomMessageGroupView,
} from "@/source/entities/expert-room";
import {
  ExpertRoomComposer,
  RulesBanner,
  TypingIndicator,
  useExpertRoomThread,
} from "@/source/features/expert-room";
import { ChatConversationSkeleton } from "@/source/widgets/chat";
import s from "./ExpertRoomWidget.module.scss";

export function ExpertRoomWidget() {
  const { user } = useSession();
  const currentUserId = user?.id ?? 0;

  const {
    messages,
    loading,
    error,
    forbidden,
    threadRef,
    typingEntries,
    notifyTyping,
    appendMine,
  } = useExpertRoomThread(currentUserId);

  const groups = groupExpertRoomMessages(messages);

  if (loading) {
    return (
      <div className={s.card}>
        <RulesBanner />
        <ChatConversationSkeleton />
      </div>
    );
  }

  return (
    <div className={s.card}>
      <RulesBanner />

      <div className={s.thread} ref={threadRef}>
        {error && messages.length === 0 ? (
          <div className={s.threadLoader}>
            <p className={s.error}>{error}</p>
          </div>
        ) : groups.length === 0 ? (
          <div className={s.threadLoader}>
            <p className={s.empty}>Сообщений пока нет — будь первым</p>
          </div>
        ) : (
          groups.map((group, index) => (
            <ExpertRoomMessageGroupView
              key={`${group.senderId}-${index}`}
              group={group}
              isMine={group.senderId === currentUserId}
              currentUserAvatarUrl={user?.avatar_url ?? null}
            />
          ))
        )}
      </div>

      <TypingIndicator entries={typingEntries} />

      <ExpertRoomComposer
        disabled={forbidden}
        disabledText={forbidden ? error ?? "Вы заблокированы в чате экспертов" : undefined}
        onSent={appendMine}
        onTyping={notifyTyping}
      />
    </div>
  );
}

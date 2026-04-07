"use client";

import { useParams, useRouter } from "next/navigation";
import AuthHeader from "@/widgets/header/AuthHeader";
import Button from "@/shared/ui/Button/Button";
import Loader from "@/shared/ui/Loader";
import { ArrowIcon } from "@/shared/ui/icons";
import { useUserProfile } from "@/shared/lib/hooks/useUserProfile";
import { useLockBodyScroll } from "@/shared/lib/hooks/useLockBodyScroll";
import { useChatList } from "@/features/chat/use-chat-list";
import { useChatThread, groupMessages } from "@/features/chat/use-chat-thread";
import { SendMessageBar } from "@/features/chat/send-message";
import { OrderBanner } from "@/features/chat/order-banner";
import { MessageGroup } from "@/entities/chat/ui/MessageGroup";
import { ChatSidebar } from "./ChatSidebar";
import styles from "./chat-window.module.scss";

export default function ChatWindow({ routeBase }: { routeBase: string }) {
  const { id: chatUuid } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useUserProfile();
  const currentUserId = profile?.id ?? 0;

  useLockBodyScroll();

  const { chats, setChats } = useChatList();
  const { chat, messages, loading, threadRef, appendMessage } = useChatThread(chatUuid, currentUserId);

  const groups = groupMessages(messages);

  return (
    <>
      <AuthHeader />
      <main className={styles.body}>
        <ChatSidebar
          chats={chats}
          activeUuid={chatUuid}
          currentUserId={currentUserId}
          routeBase={routeBase}
        />

        <div className={styles.card}>
          <div className={styles.orderNav}>
            <div className={styles.backBtnWrap}>
              <Button variant="outline" className={styles.backBtn} aria-label="Назад" onClick={() => router.push(routeBase)}>
                <ArrowIcon color="currentColor" />
              </Button>
            </div>
            {chat && (
              <OrderBanner
                title={chat.order_title}
                customer={chat.order_company}
                date={chat.order_date}
                sum={chat.order_sum}
                badges={chat.order_badges}
              />
            )}
          </div>

          <div className={styles.thread} ref={threadRef}>
            {loading ? (
              <div className={styles.threadLoader}>
                <Loader size="lg" label="" />
              </div>
            ) : (
              <>
                <div className={styles.dateSeparator}>
                  <div className={styles.datePill}><span>Сегодня</span></div>
                </div>
                {groups.map((group, i) => (
                  <MessageGroup
                    key={i}
                    group={group}
                    isMine={group.senderId === currentUserId}
                    counterpartAvatarUrl={chat?.counterpart_avatar_url}
                  />
                ))}
              </>
            )}
          </div>

          {chat && <SendMessageBar chatUuid={chat.uuid} onSent={appendMessage} />}
        </div>
      </main>
    </>
  );
}

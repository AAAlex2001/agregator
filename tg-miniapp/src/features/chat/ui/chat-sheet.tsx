import { useEffect, useRef, useState } from "react";
import { useSession } from "@/features/session";
import { tapHaptic } from "@/shared/services/telegram";
import { Button, EmptyState, FullSheet, SheetHero, Spinner } from "@/shared/ui";
import { ArrowLeftIcon, CloseIcon, PaperclipIcon, SendIcon } from "@/shared/ui/icons/interface";
import { EmptyAcceptedIcon } from "@/shared/ui/icons/empty";
import { ChatCard, MessageBubble, type ChatListItem } from "@/entites/chat";
import { useChats } from "../model/use-chats";
import { useChatThread } from "../model/use-chat-thread";
import { groupMessagesByDay } from "../model/group-messages";
import s from "./chat-sheet.module.scss";

interface Props {
  open: boolean;
  onClose: () => void;
  initialUuid?: string | null;
}

export function ChatSheet({ open, onClose, initialUuid = null }: Props) {
  const { role } = useSession();
  const [active, setActive] = useState<string | null>(null);
  const { chats, reload } = useChats(open);
  const { state, dispatch, canSend, send } = useChatThread(active);
  const endRef = useRef<HTMLDivElement>(null);
  const messagesCount = state.detail?.messages.length ?? 0;

  useEffect(() => {
    if (open) setActive(initialUuid);
  }, [open, initialUuid]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messagesCount, active]);

  const openThread = (chat: ChatListItem) => {
    tapHaptic();
    setActive(chat.uuid);
  };

  const backToList = () => {
    tapHaptic();
    setActive(null);
    void reload();
  };

  const listHero = (
    <SheetHero
      light="/respond-order/step-3-light.webp"
      dark="/respond-order/step-3-dark.webp"
      label="Общение"
      title="Чаты по заказам"
      desc="Переписка с участниками сделок"
      onClose={onClose}
    />
  );

  const threadHero = state.detail && (
    <div className={s.threadHead}>
      <button type="button" className={s.headBtn} onClick={backToList} aria-label="Назад">
        <ArrowLeftIcon width={20} height={20} />
      </button>
      <div className={s.headText}>
        <span className={s.headName}>{state.detail.counterpart_name}</span>
        <span className={s.headOrder}>{state.detail.order_title}</span>
      </div>
      <button
        type="button"
        className={s.headBtn}
        onClick={() => {
          tapHaptic();
          onClose();
        }}
        aria-label="Закрыть"
      >
        <CloseIcon width={18} height={18} />
      </button>
    </div>
  );

  const threadFooter = state.detail && !state.detail.is_blocked && (
    <div className={s.composer}>
      {state.files.length > 0 && (
        <div className={s.chips}>
          {state.files.map((file, i) => (
            <span key={`${file.name}-${i}`} className={s.chip}>
              <span className={s.chipName}>{file.name}</span>
              <button
                type="button"
                className={s.chipRemove}
                onClick={() => dispatch({ type: "removeFile", index: i })}
                aria-label="Убрать файл"
              >
                <CloseIcon width={12} height={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className={s.composerRow}>
        <label className={s.attachBtn} aria-label="Прикрепить файл">
          <PaperclipIcon width={20} height={20} />
          <input
            type="file"
            multiple
            className={s.attachInput}
            onClick={() => tapHaptic()}
            onChange={(e) => {
              dispatch({ type: "addFiles", files: e.target.files ? Array.from(e.target.files) : [] });
              e.target.value = "";
            }}
          />
        </label>
        <input
          className={s.input}
          placeholder="Сообщение…"
          value={state.text}
          onChange={(e) => dispatch({ type: "text", value: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSend) void send();
          }}
        />
        <button
          type="button"
          className={s.sendBtn}
          disabled={!canSend}
          onClick={() => void send()}
          aria-label="Отправить"
        >
          <SendIcon width={19} height={19} />
        </button>
      </div>
    </div>
  );

  return (
    <FullSheet
      open={open}
      onClose={onClose}
      hero={active ? threadHero : listHero}
      footer={active ? threadFooter : null}
    >
      {!active ? (
        chats === null ? (
          <div className={s.loading}>
            <Spinner />
          </div>
        ) : chats.length === 0 ? (
          <EmptyState
            icon={<EmptyAcceptedIcon />}
            title="Пока нет чатов"
            subtitle="Чат появится, когда по заказу начнётся общение с экспертом или заказчиком"
          />
        ) : (
          <div className={s.list}>
            {chats.map((chat) => (
              <ChatCard key={chat.uuid} chat={chat} onClick={openThread} />
            ))}
          </div>
        )
      ) : state.detail === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : (
        <div className={s.thread}>
          {state.detail.messages.length === 0 && (
            <p className={s.threadEmpty}>Сообщений пока нет — напишите первым</p>
          )}
          {groupMessagesByDay(state.detail.messages).map((group) => (
            <div key={group.day} className={s.dayGroup}>
              <span className={s.day}>{group.day}</span>
              {group.items.map((message) => (
                <MessageBubble key={message.id} message={message} mine={message.sender_role === role} />
              ))}
            </div>
          ))}
          {state.detail.is_blocked && (
            <p className={s.blocked}>Чат недоступен — переписка по этому заказу закрыта</p>
          )}
          <div ref={endRef} />
        </div>
      )}
      {!active && chats !== null && chats.length === 0 && (
        <div className={s.emptyAction}>
          <Button variant="outline" onClick={onClose}>
            Понятно
          </Button>
        </div>
      )}
    </FullSheet>
  );
}

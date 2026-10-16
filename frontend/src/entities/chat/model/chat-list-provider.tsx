"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getChatList } from "../api/get-chat-list";
import {
  applyLastMessage,
  changeChatBlocked,
  resetChatUnread,
  sortChats,
} from "./chat-list";
import type { ChatListItemData, ChatMessageData } from "./types";

/** Диалоги кабинета и результат их загрузки. */
interface ChatListState {
  chats: ChatListItemData[];
  isLoading: boolean;
  error: string | null;
}

/** Диалоги, их повторная загрузка и изменения из открытой переписки. */
interface ChatListValue extends ChatListState {
  refresh: () => void;
  markChatRead: (chatUuid: string) => void;
  setChatBlocked: (chatUuid: string, isBlocked: boolean) => void;
  updateLastMessage: (
    chatUuid: string,
    message: ChatMessageData,
    currentUserId: number,
  ) => void;
}

/** Роль открытого аккаунта и содержимое кабинета. */
interface ChatListProviderProps {
  role: string;
  children: ReactNode;
}

const ChatListContext = createContext<ChatListValue | null>(null);

/** Загружает диалоги при входе, смене роли и каждом открытии списка чатов. */
export function ChatListProvider({ role, children }: ChatListProviderProps) {
  const pathname = usePathname();
  const isChatListPage = pathname === "/chat";
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<ChatListState>({
    chats: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getChatList()
      .then((chats) => {
        if (isActive) {
          setState({
            chats: sortChats(chats),
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState((current) => ({
            ...current,
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить чаты",
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [role, isChatListPage, version]);

  /** Загружает диалоги заново, например после закрытия объявления. */
  function refresh() {
    setVersion((current) => current + 1);
  }

  /** Изменения из открытой переписки; ссылка постоянна, их можно вызывать из эффектов. */
  const [chatChanges] = useState(() => ({
    /** Обнуляет счётчик диалога, который пользователь прочитал. */
    markChatRead(chatUuid: string) {
      setState((current) => ({
        ...current,
        chats: resetChatUnread(current.chats, chatUuid),
      }));
    },

    /** Сохраняет блокировку, изменённую в открытой переписке. */
    setChatBlocked(chatUuid: string, isBlocked: boolean) {
      setState((current) => ({
        ...current,
        chats: changeChatBlocked(current.chats, chatUuid, isBlocked),
      }));
    },

    /** Показывает новое сообщение последним в диалоге и поднимает диалог наверх. */
    updateLastMessage(chatUuid: string, message: ChatMessageData, currentUserId: number) {
      setState((current) => ({
        ...current,
        chats: applyLastMessage(current.chats, chatUuid, message, currentUserId),
      }));
    },
  }));

  return (
    <ChatListContext.Provider
      value={{
        ...state,
        ...chatChanges,
        refresh,
      }}
    >
      {children}
    </ChatListContext.Provider>
  );
}

/** Возвращает диалоги текущего аккаунта, их перезагрузку и изменения из переписки. */
export function useChatList(): ChatListValue {
  const value = useContext(ChatListContext);

  if (!value) {
    throw new Error("Список чатов доступен только внутри ChatListProvider");
  }

  return value;
}

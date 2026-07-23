"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ChatListItemData, ChatMessageData } from "@/source/entities/chat";
import { fetchChatList } from "@/source/entities/chat";

interface ChatListContextValue {
  chats: ChatListItemData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markChatAsRead: (chatUuid: string) => void;
  setChatBlocked: (chatUuid: string, isBlocked: boolean) => void;
  syncChatMessage: (chatUuid: string, message: ChatMessageData, currentUserId: number) => void;
  unreadForLabor: number;
  unreadForExpertSearch: number;
  unreadForEmployment: number;
  unreadForDeals: number;
  unreadForDeal: (dealId: number) => number;
}

const ChatListContext = createContext<ChatListContextValue | null>(null);

function sortChats(chats: ChatListItemData[]) {
  return [...chats].sort((left, right) => {
    return Date.parse(right.last_message_at || right.updated_at) - Date.parse(left.last_message_at || left.updated_at);
  });
}

function getMessagePreview(message: ChatMessageData): string {
  const normalizedText = message.text.trim();

  if (normalizedText) {
    return normalizedText;
  }

  if (message.attachments.length === 1) {
    return message.attachments[0].name;
  }

  if (message.attachments.length > 1) {
    return `Файлы: ${message.attachments.length}`;
  }

  return message.file_name || "Файл";
}

export function ChatListProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<ChatListItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const items = await fetchChatList();
      setChats(sortChats(items));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить чаты");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function markChatAsRead(chatUuid: string) {
    setChats((currentChats) => currentChats.map((chat) => (
      chat.uuid === chatUuid ? { ...chat, unread_count: 0 } : chat
    )));
  }

  function setChatBlocked(chatUuid: string, isBlocked: boolean) {
    setChats((currentChats) => currentChats.map((chat) => (
      chat.uuid === chatUuid
        ? { ...chat, is_blocked: isBlocked }
        : chat
    )));
  }

  function syncChatMessage(chatUuid: string, message: ChatMessageData, currentUserId: number) {
    setChats((currentChats) => {
      const nextChats = currentChats.map((chat) => {
        if (chat.uuid !== chatUuid) {
          return chat;
        }

        return {
          ...chat,
          last_message_text: getMessagePreview(message),
          last_message_sender_id: message.sender_id,
          last_message_at: message.created_at,
          updated_at: message.created_at,
          unread_count: message.sender_id === currentUserId ? 0 : chat.unread_count + 1,
        };
      });

      return sortChats(nextChats);
    });
  }

  const unreadForLabor = chats.reduce(
    (sum, chat) => (
      chat.labor_listing_id !== null && !chat.is_blocked
        ? sum + chat.unread_count
        : sum
    ),
    0,
  );
  const unreadForExpertSearch = chats.reduce(
    (sum, chat) => (
      chat.labor_listing_kind === "EXPERT_WANTED" && !chat.is_blocked
        ? sum + chat.unread_count
        : sum
    ),
    0,
  );
  const unreadForEmployment = chats.reduce(
    (sum, chat) => (
      chat.labor_listing_kind === "EXPERT_AVAILABLE" && !chat.is_blocked
        ? sum + chat.unread_count
        : sum
    ),
    0,
  );
  const unreadForDeals = chats.reduce(
    (sum, chat) => (
      chat.contact_deal_id !== null && !chat.is_blocked
        ? sum + chat.unread_count
        : sum
    ),
    0,
  );
  const unreadForDeal = (dealId: number) => chats.reduce(
    (sum, chat) => (
      chat.contact_deal_id === dealId && !chat.is_blocked
        ? sum + chat.unread_count
        : sum
    ),
    0,
  );

  return (
    <ChatListContext.Provider
      value={{
        chats,
        loading,
        error,
        refresh,
        markChatAsRead,
        setChatBlocked,
        syncChatMessage,
        unreadForLabor,
        unreadForExpertSearch,
        unreadForEmployment,
        unreadForDeals,
        unreadForDeal,
      }}
    >
      {children}
    </ChatListContext.Provider>
  );
}

export function useChatListContext() {
  const value = useContext(ChatListContext);

  if (!value) {
    throw new Error("useChatListContext must be used within ChatListProvider");
  }

  return value;
}

export function useOptionalChatListContext() {
  return useContext(ChatListContext);
}

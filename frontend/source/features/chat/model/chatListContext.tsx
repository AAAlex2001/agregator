"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
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
  unreadForLaborTab: (
    kind: "EXPERT_WANTED" | "EXPERT_AVAILABLE",
    isMine: boolean,
  ) => number;
  unreadForLaborListing: (listingId: number) => number;
  unreadForChat: (chatUuid: string) => number;
  unreadForDeals: number;
  unreadForDeal: (dealId: number) => number;
}

const ChatListContext = createContext<ChatListContextValue | null>(null);

function sortChats(chats: ChatListItemData[]) {
  return [...chats].sort((left, right) => {
    return Date.parse(right.last_message_at || right.updated_at) - Date.parse(left.last_message_at || left.updated_at);
  });
}

function countUnread(
  chats: ChatListItemData[],
  match: (chat: ChatListItemData) => boolean,
): number {
  return chats.reduce(
    (sum, chat) => (match(chat) && !chat.is_blocked ? sum + chat.unread_count : sum),
    0,
  );
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
  const pathname = usePathname();
  const isChatListPage = pathname === "/chat";
  const [chats, setChats] = useState<ChatListItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    requestRef.current?.abort();
    const request = new AbortController();
    requestRef.current = request;
    setLoading(true);
    setError(null);

    try {
      const items = await fetchChatList(request.signal);
      if (!request.signal.aborted) setChats(sortChats(items));
    } catch (err) {
      if (!request.signal.aborted) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить чаты");
      }
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isChatListPage || !requestRef.current) void refresh();
  }, [isChatListPage, refresh]);

  useEffect(() => () => {
    requestRef.current?.abort();
    requestRef.current = null;
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

  const unreadForLabor = countUnread(chats, (chat) => chat.labor_listing_id !== null);
  const unreadForExpertSearch = countUnread(chats, (chat) => chat.labor_listing_kind === "EXPERT_WANTED");
  const unreadForEmployment = countUnread(chats, (chat) => chat.labor_listing_kind === "EXPERT_AVAILABLE");
  const unreadForLaborTab = (kind: "EXPERT_WANTED" | "EXPERT_AVAILABLE", isMine: boolean) =>
    countUnread(chats, (chat) => chat.labor_listing_kind === kind && chat.labor_listing_is_mine === isMine);
  const unreadForLaborListing = (listingId: number) =>
    countUnread(chats, (chat) => chat.labor_listing_id === listingId);
  const unreadForChat = (chatUuid: string) => {
    const chat = chats.find((item) => item.uuid === chatUuid);
    return chat && !chat.is_blocked ? chat.unread_count : 0;
  };
  const unreadForDeals = countUnread(chats, (chat) => chat.contact_deal_id !== null);
  const unreadForDeal = (dealId: number) =>
    countUnread(chats, (chat) => chat.contact_deal_id === dealId);

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
        unreadForLaborTab,
        unreadForLaborListing,
        unreadForChat,
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

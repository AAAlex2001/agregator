import type {
  ChatLaborListingKind,
  ChatListItemData,
  ChatMessageData,
  ChatUnreadCounts,
} from "./types";

/** Ставит сверху диалоги с последними сообщениями. */
export function sortChats(chats: ChatListItemData[]): ChatListItemData[] {
  return chats.toSorted((left, right) => {
    const leftTime = Date.parse(left.last_message_at ?? left.updated_at);
    const rightTime = Date.parse(right.last_message_at ?? right.updated_at);

    return rightTime - leftTime;
  });
}

/** Складывает непрочитанные сообщения; заблокированные диалоги не учитываются. */
function sumUnread(chats: ChatListItemData[]): number {
  return chats
    .filter((chat) => !chat.is_blocked)
    .reduce((sum, chat) => sum + chat.unread_count, 0);
}

/** Считает непрочитанные по разделам трудовых ресурсов и сделкам контактов. */
export function countUnreadBySection(chats: ChatListItemData[]): ChatUnreadCounts {
  const laborChats = chats.filter((chat) => chat.labor_listing_id !== null);
  const dealChats = chats.filter((chat) => chat.contact_deal_id !== null);
  const expertSearchChats = chats.filter((chat) => {
    return chat.labor_listing_kind === "EXPERT_WANTED";
  });
  const employmentChats = chats.filter((chat) => {
    return chat.labor_listing_kind === "EXPERT_AVAILABLE";
  });

  return {
    labor: sumUnread(laborChats) + sumUnread(dealChats),
    deals: sumUnread(dealChats),
    expertSearch: sumUnread(expertSearchChats),
    employment: sumUnread(employmentChats),
  };
}

/** Считает непрочитанные во вкладке трудовых ресурсов: чужие или свои объявления. */
export function countLaborTabUnread(
  chats: ChatListItemData[],
  kind: ChatLaborListingKind,
  isMine: boolean,
): number {
  const tabChats = chats.filter((chat) => {
    return chat.labor_listing_kind === kind && chat.labor_listing_is_mine === isMine;
  });

  return sumUnread(tabChats);
}

/** Считает непрочитанные по одному объявлению трудовых ресурсов. */
export function countLaborListingUnread(
  chats: ChatListItemData[],
  listingId: number,
): number {
  return sumUnread(chats.filter((chat) => chat.labor_listing_id === listingId));
}

/** Считает непрочитанные по одной сделке доступа к контактам. */
export function countDealUnread(chats: ChatListItemData[], dealId: number): number {
  return sumUnread(chats.filter((chat) => chat.contact_deal_id === dealId));
}

/** Считает непрочитанные одного диалога. */
export function countChatUnread(chats: ChatListItemData[], chatUuid: string): number {
  return sumUnread(chats.filter((chat) => chat.uuid === chatUuid));
}

/** Оставляет диалоги, где имя собеседника или последнее сообщение содержит запрос. */
export function filterChats(chats: ChatListItemData[], query: string): ChatListItemData[] {
  const search = query.trim().toLowerCase();

  return chats.filter((chat) => {
    return chat.counterpart_name.toLowerCase().includes(search)
      || chat.last_message_text.toLowerCase().includes(search);
  });
}

/** Обнуляет непрочитанные в прочитанном диалоге. */
export function resetChatUnread(
  chats: ChatListItemData[],
  chatUuid: string,
): ChatListItemData[] {
  return chats.map((chat) => {
    if (chat.uuid !== chatUuid) {
      return chat;
    }

    return { ...chat, unread_count: 0 };
  });
}

/** Сохраняет новое состояние блокировки диалога. */
export function changeChatBlocked(
  chats: ChatListItemData[],
  chatUuid: string,
  isBlocked: boolean,
): ChatListItemData[] {
  return chats.map((chat) => {
    if (chat.uuid !== chatUuid) {
      return chat;
    }

    return { ...chat, is_blocked: isBlocked };
  });
}

/** Подпись сообщения в списке: текст, имя файла или число файлов. */
function getMessagePreview(message: ChatMessageData): string {
  const text = message.text.trim();

  if (text) {
    return text;
  }

  if (message.attachments.length === 1) {
    return message.attachments[0].name;
  }

  if (message.attachments.length > 1) {
    return `Файлы: ${message.attachments.length}`;
  }

  return message.file_name || "Файл";
}

/** Ставит сообщение последним в диалоге и поднимает диалог наверх; чужое — непрочитано. */
export function applyLastMessage(
  chats: ChatListItemData[],
  chatUuid: string,
  message: ChatMessageData,
  currentUserId: number,
): ChatListItemData[] {
  const updatedChats = chats.map((chat) => {
    if (chat.uuid !== chatUuid) {
      return chat;
    }

    const isMine = message.sender_id === currentUserId;

    return {
      ...chat,
      last_message_text: getMessagePreview(message),
      last_message_sender_id: message.sender_id,
      last_message_at: message.created_at,
      updated_at: message.created_at,
      unread_count: isMine ? 0 : chat.unread_count + 1,
    };
  });

  return sortChats(updatedChats);
}

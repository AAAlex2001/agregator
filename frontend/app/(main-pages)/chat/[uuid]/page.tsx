"use client";

import { useParams } from "next/navigation";
import { ChatConversationWidget } from "@/source/widgets/chat";

export default function ChatConversationPage() {
  const params = useParams<{ uuid: string }>();
  const chatUuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid;

  return chatUuid ? <ChatConversationWidget chatUuid={chatUuid} /> : null;
}
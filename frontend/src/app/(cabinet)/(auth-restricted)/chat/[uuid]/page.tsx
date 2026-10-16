import { ChatConversation } from "@/widgets/chat";

/** Идентификатор диалога из адреса страницы. */
interface ChatConversationPageProps {
  params: Promise<{ uuid: string }>;
}

/** Показывает переписку выбранного диалога; другой диалог начинается с чистого состояния. */
export default async function ChatConversationPage({ params }: ChatConversationPageProps) {
  const { uuid } = await params;

  return (
    <ChatConversation
      key={uuid}
      chatUuid={uuid}
    />
  );
}

import { ChatConversationWidget } from "@/source/widgets/chat";

interface ChatPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function Page({ params }: ChatPageProps) {
  const { uuid } = await params;

  return <ChatConversationWidget chatUuid={uuid} />;
}
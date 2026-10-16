import { ExpertHistory } from "@/widgets/orders";

/** Публичный идентификатор исполнителя из адреса. */
interface ExpertHistoryPageProps {
  params: Promise<{ publicId: string }>;
}

/** Показывает историю выполненных заказов исполнителя. */
export default async function ExpertHistoryPage({ params }: ExpertHistoryPageProps) {
  const { publicId } = await params;

  return <ExpertHistory publicId={publicId} />;
}

import { ExpertHistoryWidget } from "@/source/widgets/orders";

export const dynamic = "force-dynamic";

interface ExpertOrdersHistoryPageProps {
  params: Promise<{ publicId: string }>;
}

export default async function ExpertOrdersHistoryPage({ params }: ExpertOrdersHistoryPageProps) {
  const { publicId } = await params;
  return <ExpertHistoryWidget publicId={publicId} />;
}

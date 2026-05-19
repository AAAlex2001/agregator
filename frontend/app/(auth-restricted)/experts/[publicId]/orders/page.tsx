import { ExpertOrdersHistoryWidget } from "@/source/widgets/expert-orders-history";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ publicId: string }>;
}

export default async function ExpertOrdersHistoryPage({ params }: Props) {
  const { publicId } = await params;
  return <ExpertOrdersHistoryWidget publicId={publicId} />;
}

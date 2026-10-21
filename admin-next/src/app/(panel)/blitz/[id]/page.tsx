import { parseId } from "@/shared/lib/route-params";
import BlitzOrder from "@/widgets/admin/blitz-order";

/** Карточка заявки Блиц-эксперта. */
export default async function BlitzOrderRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <BlitzOrder key={id} orderId={parseId(id)} />;
}

import { parseId } from "@/shared/lib/route-params";
import ContactDeal from "@/widgets/admin/contact-deal";

/** Карточка сделки по покупке контактов. */
export default async function ContactDealRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ContactDeal key={id} dealId={parseId(id)} />;
}

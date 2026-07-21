import type { ContactDealListItem } from "@/source/entities/expert-contact";
import { Button, Title } from "@/source/shared/ui";
import { formatDealDate } from "../lib/formatters";
import { ContactDealStatusBadge } from "./ContactDealStatusBadge";
import s from "./ContactDealsList.module.scss";

interface ContactDealsListProps {
  deals: ContactDealListItem[];
  busy: boolean;
  onOpen: (id: number) => void;
}

export function ContactDealsList({ deals, busy, onOpen }: ContactDealsListProps) {
  if (deals.length === 0) return null;

  return (
    <section className={s.dealsSection} aria-label="Мои сделки">
      <Title text="Мои сделки" as="h2" className={s.sectionTitle} />
      <div className={s.dealRows}>
        {deals.map((deal) => (
          <article className={s.dealRow} key={deal.id}>
            <div>
              <strong>
                {deal.actor_party === "SELLER" ? deal.buyer_name : deal.seller_name}
              </strong>
              <span>{formatDealDate(deal.created_at)} · {deal.price_rubles.toLocaleString("ru-RU")} ₽</span>
            </div>
            <ContactDealStatusBadge status={deal.status} actorParty={deal.actor_party} />
            <Button
              variant="outlineOrange"
              size="sm"
              onClick={() => onOpen(deal.id)}
              disabled={busy}
            >
              Открыть
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

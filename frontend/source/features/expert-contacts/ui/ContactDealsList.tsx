import type { ContactDealListItem, ContactDealStatus } from "@/source/entities/expert-contact";
import { useOptionalChatListContext } from "@/source/features/chat";
import { Button, Title } from "@/source/shared/ui";
import { formatDealDate } from "../lib/formatters";
import { ContactDealStatusBadge } from "./ContactDealStatusBadge";
import s from "./ContactDealsList.module.scss";

interface ContactDealsListProps {
  deals: ContactDealListItem[];
  busy: boolean;
  onOpen: (id: number) => void;
  onOpenChat: (id: number) => void;
}

const CLOSED_STATUSES: ContactDealStatus[] = ["CONTACTS_RELEASED", "CANCELED"];

export function ContactDealsList({ deals, busy, onOpen, onOpenChat }: ContactDealsListProps) {
  const chat = useOptionalChatListContext();
  if (deals.length === 0) return null;

  return (
    <section className={s.dealsSection} aria-label="Мои сделки">
      <Title text="Мои сделки" as="h2" className={s.sectionTitle} />
      <div className={s.dealRows}>
        {deals.map((deal) => {
          const chatAvailable = !CLOSED_STATUSES.includes(deal.status);
          const unread = chat?.unreadForDeal(deal.id) ?? 0;
          return (
            <article className={s.dealRow} key={deal.id}>
              <div>
                <strong>
                  {deal.actor_party === "SELLER" ? deal.buyer_name : deal.seller_name}
                </strong>
                <span>{formatDealDate(deal.created_at)} · {deal.price_rubles.toLocaleString("ru-RU")} ₽</span>
              </div>
              <ContactDealStatusBadge status={deal.status} actorParty={deal.actor_party} />
              <div className={s.dealActions}>
                {chatAvailable && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenChat(deal.id)}
                    disabled={busy}
                  >
                    Открыть чат
                    {unread > 0 && <span className={s.chatUnread}>{unread > 99 ? "99+" : unread}</span>}
                  </Button>
                )}
                <Button
                  variant="outlineOrange"
                  size="sm"
                  onClick={() => onOpen(deal.id)}
                  disabled={busy}
                >
                  Открыть
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

import type { ContactDealListItem, ContactDealStatus } from "@/source/entities/expert-contact";
import { useOptionalChatListContext } from "@/source/features/chat";
import { FormSection } from "@/source/shared/ui/FormSection";
import { Button } from "@/source/shared/ui";
import { formatDealDate } from "../lib/formatters";
import { ContactDealStatusBadge } from "./ContactDealStatusBadge";
import s from "./ContactDealsList.module.scss";

interface ContactDealsListProps {
  deals: ContactDealListItem[];
  busy: boolean;
  onOpen: (id: number) => void;
  onOpenChat: (id: number) => void;
  onDelete: (deal: ContactDealListItem) => void;
}

const CLOSED_STATUSES: ContactDealStatus[] = ["CONTACTS_RELEASED", "CANCELED"];

export function ContactDealsList({
  deals,
  busy,
  onOpen,
  onOpenChat,
  onDelete,
}: ContactDealsListProps) {
  const chat = useOptionalChatListContext();
  if (deals.length === 0) return null;

  return (
    <FormSection title="Мои сделки" collapsible className={s.dealsSection} titleClassName={s.sectionTitle}>
      <div className={s.dealRows}>
        {deals.map((deal) => {
          const chatAvailable = !CLOSED_STATUSES.includes(deal.status);
          const unread = chat?.unreadForDeal(deal.id) ?? 0;
          return (
            <article className={s.dealRow} key={deal.id}>
              <div className={s.dealInfo}>
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
                    className={s.chatAction}
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
                  className={s.openAction}
                  size="sm"
                  onClick={() => onOpen(deal.id)}
                  disabled={busy}
                >
                  Открыть
                </Button>
                {deal.actor_party === "BUYER" && (
                  <Button
                    variant="danger"
                    className={s.deleteAction}
                    size="sm"
                    onClick={() => onDelete(deal)}
                    disabled={busy}
                  >
                    Удалить
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </FormSection>
  );
}

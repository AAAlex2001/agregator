import { DealStatusBadge } from "@/entities/expert-contact";
import type { ContactDealListItem } from "@/entities/expert-contact";
import { DeleteContactDealButton } from "@/features/delete-contact-deal";
import { OpenContactDealButton } from "@/features/open-contact-deal";
import { OpenDealChatButton } from "@/features/open-contact-deal-chat";
import styles from "./style.module.scss";

/** Сделка текущего пользователя в списке «Мои сделки». */
interface ContactDealRowProps {
  deal: ContactDealListItem;
}

/** Показывает вторую сторону, дату, цену и этап сделки с действиями по ней. */
export function ContactDealRow({ deal }: ContactDealRowProps) {
  const isClosed = deal.status === "CONTACTS_RELEASED" || deal.status === "CANCELED";
  const counterpart = deal.actor_party === "SELLER" ? deal.buyer_name : deal.seller_name;
  const createdAt = new Date(deal.created_at).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className={styles.row}>
      <div className={styles.info}>
        <strong>{counterpart}</strong>
        <span>
          {createdAt} · {deal.price_rubles.toLocaleString("ru-RU")} ₽
        </span>
      </div>
      <DealStatusBadge
        status={deal.status}
        party={deal.actor_party}
      />
      <div className={styles.actions}>
        {!isClosed && (
          <OpenDealChatButton
            dealId={deal.id}
            className={styles.chatAction}
          />
        )}
        <OpenContactDealButton
          dealId={deal.id}
          className={styles.openAction}
        />
        {deal.actor_party === "BUYER" && (
          <DeleteContactDealButton
            dealId={deal.id}
            className={styles.deleteAction}
          />
        )}
      </div>
    </article>
  );
}

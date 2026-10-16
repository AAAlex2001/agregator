"use client";

import { DealStatusBadge } from "@/entities/expert-contact";
import type { ExpertContact } from "@/entities/expert-contact";
import { useUser } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { LockIcon } from "@/shared/ui/icons";
import { useOpenContactDeal } from "../../model/use-open-contact-deal";
import styles from "./style.module.scss";

/** Исполнитель из каталога и вход для гостя, который хочет купить контакты. */
interface ContactAccessProps {
  expert: ExpertContact;
  onOpenLogin: () => void;
}

/** Показывает цену или этап сделки и открывает покупку контактов исполнителя. */
export function ContactAccess({ expert, onOpenLogin }: ContactAccessProps) {
  const { user } = useUser();
  const { isOpening, openDeal, buyContacts } = useOpenContactDeal();

  /** Просит гостя войти, иначе открывает начатую сделку или создаёт новую. */
  function openAccess() {
    if (!user) {
      onOpenLogin();
      return;
    }

    if (expert.deal_id) {
      void openDeal(expert.deal_id);
      return;
    }

    void buyContacts(expert.id);
  }

  return (
    <div className={styles.access}>
      <span className={styles.label}>Доступ к контактам</span>
      {expert.is_mine ? (
        <span className={styles.muted}>Это ваша карточка исполнителя</span>
      ) : expert.deal_status ? (
        <>
          <DealStatusBadge
            status={expert.deal_status}
            party="BUYER"
          />
          <Button
            variant="outlineOrange"
            size="sm"
            onClick={openAccess}
            isLoading={isOpening}
          >
            Открыть сделку
          </Button>
        </>
      ) : expert.sales_enabled ? (
        <>
          <span className={styles.label}>Цена</span>
          <strong className={styles.price}>
            {expert.price_rubles?.toLocaleString("ru-RU")} ₽
          </strong>
          <Button
            variant="primary"
            size="sm"
            onClick={openAccess}
            isLoading={isOpening}
          >
            <LockIcon /> Получить контакты
          </Button>
        </>
      ) : (
        <span className={styles.muted}>Исполнитель пока не открыл доступ к контактам</span>
      )}
    </div>
  );
}

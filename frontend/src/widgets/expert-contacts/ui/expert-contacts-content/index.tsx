"use client";

import { useState } from "react";
import { useExpertContacts } from "@/entities/expert-contact";
import type { ContactDeal } from "@/entities/expert-contact";
import { ContactOfferSettings } from "@/features/edit-contact-offer";
import { LeaveDealReviewModal } from "@/features/leave-review";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { ContactDealModal } from "../contact-deal-modal";
import { ContactDeals } from "../contact-deals";
import { ExpertContactsCatalog } from "../expert-contacts-catalog";
import styles from "./style.module.scss";

/** Исполнитель из ссылки и вход для гостя, который хочет купить контакты. */
interface ExpertContactsContentProps {
  targetExpertId?: string;
  onOpenLogin: () => void;
}

/** Собирает раздел: свои условия, сделки, каталог и окна сделки и отзыва. */
export function ExpertContactsContent({
  targetExpertId,
  onOpenLogin,
}: ExpertContactsContentProps) {
  const { offer, openedDeal, closeDeal } = useExpertContacts();
  const [reviewDeal, setReviewDeal] = useState<ContactDeal | null>(null);

  /** Закрывает договор и открывает отзыв по этой сделке. */
  function startReview() {
    setReviewDeal(openedDeal);
    closeDeal();
  }

  /** Закрывает форму отзыва. */
  function closeReview() {
    setReviewDeal(null);
  }

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <Title
          text="Контакты исполнителей"
          as="h1"
          className={styles.title}
        />
        <Subtitle
          text={
            "Выберите специалиста и получите контакты после подписания договора "
            + "и подтверждения прямой оплаты"
          }
          className={styles.subtitle}
        />
      </header>

      {offer && <ContactOfferSettings initialOffer={offer} />}
      <ContactDeals />
      <ExpertContactsCatalog
        targetExpertId={targetExpertId}
        onOpenLogin={onOpenLogin}
      />

      {openedDeal && (
        <ContactDealModal
          deal={openedDeal}
          onReview={startReview}
        />
      )}
      {reviewDeal && (
        <LeaveDealReviewModal
          deal={reviewDeal}
          onPublished={closeReview}
          onClose={closeReview}
        />
      )}
    </main>
  );
}

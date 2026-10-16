"use client";

import {
  DealContract,
  DealReceipts,
  DealStatusBadge,
  SellerContacts,
  getContactContractUrl,
  useExpertContacts,
} from "@/entities/expert-contact";
import type { ContactDeal } from "@/entities/expert-contact";
import { ContactPaymentCheck } from "@/features/check-contact-payment";
import { SignContactDealForm } from "@/features/sign-contact-deal";
import { ContactPaymentForm } from "@/features/upload-contact-receipt";
import { Button } from "@/shared/ui/button";
import { FileIcon } from "@/shared/ui/icons";
import { Modal } from "@/shared/ui/modal";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Открытая сделка и переход к отзыву после получения контактов. */
interface ContactDealModalProps {
  deal: ContactDeal;
  onReview: () => void;
}

/** Показывает договор и действия текущей стороны: подпись, оплату, проверку и отзыв. */
export function ContactDealModal({ deal, onReview }: ContactDealModalProps) {
  const { closeDeal } = useExpertContacts();
  const isBuyer = deal.actor_party === "BUYER";
  const isSeller = deal.actor_party === "SELLER";
  const needsSignature = (isBuyer && deal.status === "AWAITING_BUYER_SIGNATURE")
    || (isSeller && deal.status === "AWAITING_SELLER_SIGNATURE");
  const canPay = isBuyer
    && (deal.status === "AWAITING_PAYMENT" || deal.status === "PAYMENT_REJECTED");
  const canCheckPayment = isSeller && deal.status === "PAYMENT_REPORTED";
  const sellerContacts = deal.status === "CONTACTS_RELEASED" ? deal.seller_contacts : null;

  return (
    <Modal
      open
      onClose={closeDeal}
      size="xl"
      ariaLabelledBy="contact-deal-title"
      dialogClassName={styles.dialog}
    >
      <header className={styles.header}>
        <div>
          <span className={styles.number}>Договор № {deal.contract.number}</span>
          <Title
            id="contact-deal-title"
            text={deal.contract.title}
            as="h2"
            className={styles.title}
          />
        </div>
        <DealStatusBadge
          status={deal.status}
          party={deal.actor_party}
        />
      </header>

      <DealContract
        contract={deal.contract}
        documentHash={deal.contract_hash}
      />

      <div className={styles.actions}>
        <Button
          href={getContactContractUrl(deal.id)}
          target="_blank"
          rel="noreferrer"
          variant="outlineOrange"
          size="sm"
        >
          <FileIcon /> Скачать договор
        </Button>
        {needsSignature && <SignContactDealForm dealId={deal.id} />}
        {canPay && <ContactPaymentForm deal={deal} />}
        {deal.receipts.length > 0 && <DealReceipts receipts={deal.receipts} />}
        {canCheckPayment && <ContactPaymentCheck dealId={deal.id} />}
        {sellerContacts && <SellerContacts contacts={sellerContacts} />}
        {deal.can_review && (
          <Button
            variant="outlineOrange"
            size="sm"
            onClick={onReview}
          >
            Оставить отзыв
          </Button>
        )}
        {deal.has_review && (
          <p className={styles.reviewPublished}>Отзыв по этой сделке опубликован</p>
        )}
      </div>
    </Modal>
  );
}

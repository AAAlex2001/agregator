"use client";

import {
  contactContractUrl,
  type ContactDealDetail,
} from "@/source/entities/expert-contact";
import { Button, Modal, Title } from "@/source/shared/ui";
import { FileIcon } from "@/source/shared/ui/icons";
import { ContactContract } from "./ContactContract";
import { ContactPaymentPanel } from "./ContactPaymentPanel";
import { ContactSignatureForm } from "./ContactSignatureForm";
import { ContactDealStatusBadge } from "./ContactDealStatusBadge";
import s from "./ContactDealModal.module.scss";

interface ContactDealModalProps {
  deal: ContactDealDetail | null;
  busy: boolean;
  onClose: () => void;
  onSign: (password: string) => Promise<void>;
  onUploadReceipt: (file: File) => Promise<void>;
  onConfirmPayment: () => Promise<void>;
  onRejectPayment: (reason: string) => Promise<void>;
}

export function ContactDealModal({
  deal,
  busy,
  onClose,
  onSign,
  onUploadReceipt,
  onConfirmPayment,
  onRejectPayment,
}: ContactDealModalProps) {
  if (!deal) return null;

  const needsSignature =
    (deal.actor_party === "BUYER" && deal.status === "AWAITING_BUYER_SIGNATURE")
    || (deal.actor_party === "SELLER" && deal.status === "AWAITING_SELLER_SIGNATURE");

  return (
    <Modal
      open
      onClose={onClose}
      isBusy={busy}
      size="xl"
      ariaLabelledBy="contact-deal-title"
      dialogClassName={s.dialog}
    >
      <header className={s.header}>
        <div>
          <span className={s.contractNumber}>Договор № {deal.contract.number}</span>
          <div id="contact-deal-title">
            <Title text={deal.contract.title} as="h2" className={s.title} />
          </div>
        </div>
        <ContactDealStatusBadge status={deal.status} actorParty={deal.actor_party} />
      </header>

      <ContactContract contract={deal.contract} documentHash={deal.contract_hash} />

      <div className={s.actions}>
        <Button
          href={contactContractUrl(deal.id)}
          target="_blank"
          rel="noreferrer"
          variant="outlineOrange"
          size="sm"
        >
          <FileIcon /> Скачать договор
        </Button>

        {needsSignature && <ContactSignatureForm busy={busy} onSign={onSign} />}

        <ContactPaymentPanel
          deal={deal}
          busy={busy}
          onUploadReceipt={onUploadReceipt}
          onConfirmPayment={onConfirmPayment}
          onRejectPayment={onRejectPayment}
        />
      </div>
    </Modal>
  );
}

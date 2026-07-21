import type {
  ContactDealParty,
  ContactDealStatus,
} from "@/source/entities/expert-contact";
import { contactDealStatusLabel } from "../lib/formatters";
import s from "./ContactDealStatusBadge.module.scss";

interface ContactDealStatusBadgeProps {
  status: ContactDealStatus;
  actorParty?: ContactDealParty | null;
}

const STATUS_TONES: Record<ContactDealStatus, string> = {
  AWAITING_BUYER_SIGNATURE: s.blue,
  AWAITING_SELLER_SIGNATURE: s.blue,
  AWAITING_PAYMENT: s.orange,
  PAYMENT_REPORTED: s.brown,
  PAYMENT_REJECTED: s.red,
  CONTACTS_RELEASED: s.green,
  CANCELED: s.gray,
};

export function ContactDealStatusBadge({
  status,
  actorParty = null,
}: ContactDealStatusBadgeProps) {
  return (
    <span className={`${s.badge} ${STATUS_TONES[status]}`}>
      {contactDealStatusLabel(status, actorParty)}
    </span>
  );
}

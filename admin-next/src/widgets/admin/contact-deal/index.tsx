"use client";

import { DEAL_STATUS_LABELS, DEAL_STATUS_TONES } from "@/entities/contact-deal";
import {
  DealContractPanel,
  DealReceipts,
  DealSignatures,
  DealSummary,
  ReleaseForm,
  useDeal,
} from "@/features/contact-deals-admin";
import { CONTACT_DEALS_PATH } from "@/shared/lib/admin-paths";
import Badge from "@/shared/ui/badge";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";

type ContactDealProps = {
  dealId: number;
};

/** Карточка сделки: факты, ручная выдача контактов, чеки, подписи и текст договора. */
const ContactDeal = ({ dealId }: ContactDealProps) => {
  const { state, canRelease, changeNote, release } = useDeal(dealId);
  const { deal } = state;

  if (state.status === "failed") return <Message tone="error">Не удалось загрузить сделку.</Message>;
  if (!deal) return <Loader size="lg" />;

  return (
    <Page>
      <PageHeader
        backHref={CONTACT_DEALS_PATH}
        title={`Сделка #${deal.public_id.slice(0, 8).toUpperCase()}`}
        description={`${deal.seller_name} → ${deal.buyer_name}`}
        action={<Badge tone={DEAL_STATUS_TONES[deal.status]}>{DEAL_STATUS_LABELS[deal.status]}</Badge>}
      />

      <DealSummary deal={deal} />

      <ReleaseForm
        deal={deal}
        note={state.note}
        pending={state.pending}
        canRelease={canRelease}
        onChange={changeNote}
        onRelease={release}
      />

      <DealReceipts dealId={deal.id} receipts={deal.receipts} />
      <DealSignatures signatures={deal.signatures} />
      <DealContractPanel contract={deal.contract} />
    </Page>
  );
};

export default ContactDeal;

"use client";

import { useState, type FormEvent } from "react";
import {
  contactContractUrl,
  type ContactDealDetail,
} from "@/source/entities/expert-contact";
import { Button, Modal, PasswordInput, TextInput } from "@/source/shared/ui";
import { FileIcon, LockIcon } from "@/source/shared/ui/icons";
import { contactDealStatusLabel } from "../lib/formatters";
import s from "./ExpertContacts.module.scss";

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
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!deal) return null;

  const needsSignature =
    (deal.actor_party === "BUYER" && deal.status === "AWAITING_BUYER_SIGNATURE")
    || (deal.actor_party === "SELLER" && deal.status === "AWAITING_SELLER_SIGNATURE");

  const submitSignature = async (event: FormEvent) => {
    event.preventDefault();
    if (!accepted) return;
    await onSign(password);
    setPassword("");
  };

  const submitReceipt = async (event: FormEvent) => {
    event.preventDefault();
    if (receipt) await onUploadReceipt(receipt);
  };

  return (
    <Modal
      open
      onClose={onClose}
      isBusy={busy}
      size="xl"
      ariaLabelledBy="contact-deal-title"
      dialogClassName={s.dealDialog}
    >
      <header className={s.dealHead}>
        <div>
          <span>Договор № {deal.contract.number}</span>
          <h2 id="contact-deal-title">{deal.contract.title}</h2>
        </div>
        <span className={s.dealStatus}>{contactDealStatusLabel(deal.status)}</span>
      </header>

      <div className={s.contractBody}>
        <p>{deal.contract.preamble}</p>
        <ol>
          {deal.contract.clauses.map((clause, index) => <li key={index}>{clause}</li>)}
        </ol>
        <div className={s.requisites}>
          <PartyRequisites title="Продавец" values={deal.contract.seller_requisites} />
          <PartyRequisites title="Покупатель" values={deal.contract.buyer_requisites} />
        </div>
        <p className={s.documentHash}>SHA-256: {deal.contract_hash}</p>
      </div>

      <div className={s.dealActions}>
        <Button
          href={contactContractUrl(deal.id)}
          target="_blank"
          variant="outlineOrange"
          size="sm"
        >
          <FileIcon /> Скачать договор
        </Button>

        {needsSignature && (
          <form className={s.signForm} onSubmit={submitSignature}>
            <label className={s.acceptRow}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
              />
              <span>Принимаю условия договора и подписываю его простой электронной подписью</span>
            </label>
            <PasswordInput
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введите пароль от аккаунта"
              required
            />
            <Button type="submit" variant="primary" size="sm" isLoading={busy} disabled={!accepted}>
              <LockIcon /> Подписать договор
            </Button>
          </form>
        )}

        {deal.actor_party === "BUYER"
          && ["AWAITING_PAYMENT", "PAYMENT_REJECTED"].includes(deal.status)
          && (
            <form className={s.paymentBlock} onSubmit={submitReceipt}>
              <div>
                <span>Реквизиты эксперта</span>
                <strong>{deal.payment_details}</strong>
                <p>Переведите {deal.price_rubles.toLocaleString("ru-RU")} ₽ напрямую эксперту и загрузите чек.</p>
              </div>
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={(event) => setReceipt(event.target.files?.[0] ?? null)}
                required
              />
              <Button type="submit" variant="primary" size="sm" isLoading={busy} disabled={!receipt}>
                Отправить чек
              </Button>
            </form>
          )}

        {deal.receipts.length > 0 && (
          <div className={s.receipts}>
            <strong>Загруженные чеки</strong>
            {deal.receipts.map((item) => (
              <a href={item.download_url} target="_blank" rel="noreferrer" key={item.id}>
                {item.original_name} · {item.status}
              </a>
            ))}
          </div>
        )}

        {deal.actor_party === "SELLER" && deal.status === "PAYMENT_REPORTED" && (
          <div className={s.reviewActions}>
            <Button variant="green" size="sm" onClick={() => void onConfirmPayment()} isLoading={busy}>
              Подтвердить оплату и открыть контакты
            </Button>
            <TextInput
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Причина отклонения чека"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => void onRejectPayment(rejectionReason)}
              disabled={rejectionReason.trim().length < 3 || busy}
            >
              Отклонить чек
            </Button>
          </div>
        )}

        {deal.status === "CONTACTS_RELEASED" && deal.seller_contacts && (
          <div className={s.releasedContacts}>
            <span>Контакты эксперта открыты</span>
            {deal.seller_contacts.phone && <a href={`tel:${deal.seller_contacts.phone}`}>{deal.seller_contacts.phone}</a>}
            {deal.seller_contacts.email && <a href={`mailto:${deal.seller_contacts.email}`}>{deal.seller_contacts.email}</a>}
          </div>
        )}
      </div>
    </Modal>
  );
}

function PartyRequisites({ title, values }: { title: string; values: Record<string, string> }) {
  return (
    <section>
      <h3>{title}</h3>
      {Object.entries(values).map(([label, value]) => (
        <p key={label}><span>{label}:</span> {value}</p>
      ))}
    </section>
  );
}

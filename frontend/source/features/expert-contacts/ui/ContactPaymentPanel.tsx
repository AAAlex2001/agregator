"use client";

import { useState, type FormEvent } from "react";
import type { ContactDealDetail } from "@/source/entities/expert-contact";
import { Button, TextInput, Title } from "@/source/shared/ui";
import { FileIcon } from "@/source/shared/ui/icons";
import { contactReceiptStatusLabel } from "../lib/formatters";
import { ReceiptFileField } from "./ReceiptFileField";
import s from "./ContactPaymentPanel.module.scss";

interface ContactPaymentPanelProps {
  deal: ContactDealDetail;
  busy: boolean;
  onUploadReceipt: (file: File) => Promise<void>;
  onConfirmPayment: () => Promise<void>;
  onRejectPayment: (reason: string) => Promise<void>;
}

export function ContactPaymentPanel({
  deal,
  busy,
  onUploadReceipt,
  onConfirmPayment,
  onRejectPayment,
}: ContactPaymentPanelProps) {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const canUploadReceipt = deal.actor_party === "BUYER"
    && ["AWAITING_PAYMENT", "PAYMENT_REJECTED"].includes(deal.status);

  const submitReceipt = async (event: FormEvent) => {
    event.preventDefault();
    if (!receipt) return;
    await onUploadReceipt(receipt);
    setReceipt(null);
  };

  return (
    <>
      {canUploadReceipt && (
        <form className={s.paymentBlock} onSubmit={submitReceipt}>
          <div className={s.paymentSummary}>
            <div className={s.priceSummary}>
              <span>Цена контактов</span>
              <strong>{deal.price_rubles.toLocaleString("ru-RU")} ₽</strong>
            </div>
            <div className={s.paymentDetails}>
              <span>Реквизиты эксперта для прямого перевода</span>
              <strong>{deal.payment_details}</strong>
            </div>
            <p>Площадка не принимает платёж. Переведите указанную сумму эксперту и приложите чек.</p>
          </div>
          <div className={s.receiptUploadRow}>
            <ReceiptFileField file={receipt} onChange={setReceipt} />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={busy}
              disabled={!receipt}
            >
              Отправить чек
            </Button>
          </div>
        </form>
      )}

      {deal.receipts.length > 0 && (
        <section className={s.receipts} aria-label="Загруженные чеки">
          <Title text="Загруженные чеки" as="h3" className={s.receiptsTitle} />
          <div className={s.receiptButtons}>
            {deal.receipts.map((item, index) => (
              <div className={s.receiptItem} key={item.id}>
                <Button
                  href={item.download_url}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlineOrange"
                  size="sm"
                >
                  <FileIcon /> Скачать чек {index + 1}
                </Button>
                <span>{contactReceiptStatusLabel(item.status)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {deal.actor_party === "SELLER" && deal.status === "PAYMENT_REPORTED" && (
        <section className={s.reviewActions} aria-label="Проверка оплаты">
          <Button
            variant="green"
            size="sm"
            onClick={() => void onConfirmPayment()}
            isLoading={busy}
          >
            Подтвердить оплату и открыть контакты
          </Button>
          <TextInput
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Причина отклонения чека"
            aria-label="Причина отклонения чека"
          />
          <Button
            variant="danger"
            size="sm"
            onClick={() => void onRejectPayment(rejectionReason)}
            disabled={rejectionReason.trim().length < 3 || busy}
          >
            Отклонить чек
          </Button>
        </section>
      )}

      {deal.status === "CONTACTS_RELEASED" && deal.seller_contacts && (
        <section className={s.releasedContacts} aria-label="Открытые контакты эксперта">
          <strong>Контакты эксперта открыты</strong>
          <div>
            {deal.seller_contacts.phone && (
              <a href={`tel:${deal.seller_contacts.phone}`}>{deal.seller_contacts.phone}</a>
            )}
            {deal.seller_contacts.email && (
              <a href={`mailto:${deal.seller_contacts.email}`}>{deal.seller_contacts.email}</a>
            )}
          </div>
        </section>
      )}
    </>
  );
}

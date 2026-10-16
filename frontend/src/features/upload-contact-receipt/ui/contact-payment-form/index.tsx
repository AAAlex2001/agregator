"use client";

import { useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ContactDeal } from "@/entities/expert-contact";
import { Button } from "@/shared/ui/button";
import { FileGallery } from "@/shared/ui/file-gallery";
import { useUploadContactReceipt } from "../../model/use-upload-contact-receipt";
import styles from "./style.module.scss";

/** Сделка, по которой покупатель переводит оплату исполнителю. */
interface ContactPaymentFormProps {
  deal: ContactDeal;
}

/** Показывает сумму и реквизиты прямого перевода и принимает чек об оплате. */
export function ContactPaymentForm({ deal }: ContactPaymentFormProps) {
  const form = useUploadContactReceipt(deal.id);
  const inputRef = useRef<HTMLInputElement>(null);
  const receipt = form.receipt;
  const items = receipt
    ? [
      {
        id: receipt.previewUrl,
        name: receipt.file.name,
        url: receipt.previewUrl,
        onRemove: form.clearReceipt,
      },
    ]
    : [];

  /** Открывает системный выбор файла. */
  function openFilePicker() {
    inputRef.current?.click();
  }

  /** Сохраняет выбранный файл и позволяет выбрать тот же файл повторно. */
  function changeFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      form.selectReceipt(file);
    }

    event.target.value = "";
  }

  /** Отправляет чек без перезагрузки страницы. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void form.upload();
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Цена контактов</span>
          <strong className={styles.price}>
            {deal.price_rubles.toLocaleString("ru-RU")} ₽
          </strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Реквизиты исполнителя для прямого перевода</span>
          <strong className={styles.details}>{deal.payment_details}</strong>
        </div>
        <p>
          Площадка не принимает платёж. Переведите указанную сумму исполнителю и приложите чек.
        </p>
      </div>
      <div className={styles.uploadRow}>
        <FileGallery
          items={items}
          label="Чек об оплате"
          hint="PDF, JPG, PNG или WEBP, не более 8 МБ"
          variant="editable"
          onAdd={openFilePicker}
          blockClassName={styles.receiptField}
          input={
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className={styles.fileInput}
              onChange={changeFile}
            />
          }
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={form.isUploading}
          disabled={!receipt}
        >
          Отправить чек
        </Button>
      </div>
    </form>
  );
}

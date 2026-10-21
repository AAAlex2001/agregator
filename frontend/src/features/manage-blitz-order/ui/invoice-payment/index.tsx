"use client";

import { useState } from "react";
import {
  BlitzFilePicker,
  blitzInvoiceUrl,
  getBlitzOrder,
  issueBlitzInvoice,
  reportBlitzInvoicePaid,
  useBlitzFiles,
} from "@/entities/blitz-order";
import type { BlitzProofKind } from "@/entities/blitz-order";
import { formatWithTime } from "@/shared/lib/format-date";
import { formatRub } from "@/shared/lib/format-rub";
import { Button } from "@/shared/ui/button";
import { Tabs } from "@/shared/ui/tabs";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import styles from "./style.module.scss";

/** Чем подтверждается оплата. */
const PROOF_TABS = [
  { id: "payment_order", label: "Платёжное поручение" },
  { id: "guarantee_letter", label: "Гарантийное письмо" },
];

/** Виды подтверждения в порядке вкладок. */
const PROOF_KINDS: BlitzProofKind[] = ["payment_order", "guarantee_letter"];

/** Вид подтверждения из вкладки. */
function toProofKind(id: string): BlitzProofKind {
  return PROOF_KINDS.find((kind) => kind === id) ?? "payment_order";
}

/** Организация получает счёт, оплачивает его и сообщает об оплате с платёжкой. */
export function InvoicePayment({ order, onChange }: BlitzStepProps) {
  const [proofKind, setProofKind] = useState<BlitzProofKind>("payment_order");
  const proof = useBlitzFiles(1);
  const { isPending, run } = useBlitzAction(onChange);
  const invoice = order.invoices.find(
    (item) => item.stage === order.stage && !item.paid_at && !item.canceled_at,
  );

  /** Выставляет счёт и показывает его в заявке. */
  function issue() {
    void run(async () => {
      await issueBlitzInvoice(order.id);
      return getBlitzOrder(order.id);
    });
  }

  /** Сообщает об оплате счёта. */
  function report(invoiceId: number) {
    void run(async () => {
      await reportBlitzInvoicePaid(order.id, invoiceId, proofKind, proof.files[0] ?? null);
      proof.clearFiles();
      return getBlitzOrder(order.id);
    }, "Спасибо! Подтвердим оплату, как только деньги поступят");
  }

  if (!invoice) {
    return (
      <Button
        isLoading={isPending}
        onClick={issue}
      >
        Получить счёт
      </Button>
    );
  }

  return (
    <div className={styles.invoice}>
      <div className={styles.head}>
        <span className={styles.title}>Счёт № {invoice.number} на {formatRub(invoice.amount)}</span>
        <a
          className={styles.link}
          href={blitzInvoiceUrl(order.id, invoice.id)}
        >
          Скачать PDF
        </a>
      </div>
      {invoice.reported_at ? (
        <p className={styles.reported}>
          Вы сообщили об оплате {formatWithTime(invoice.reported_at)}.
          Ждём поступления на расчётный счёт.
        </p>
      ) : (
        <>
          <Tabs
            tabs={PROOF_TABS}
            activeTab={proofKind}
            onTabChange={(id) => setProofKind(toProofKind(id))}
          />
          <BlitzFilePicker
            label="Документ об оплате (необязательно)"
            hint="Приложите платёжку — так подтвердим оплату быстрее"
            items={proof.items}
            isFull={proof.isFull}
            multiple={false}
            onAdd={proof.addFiles}
          />
          <Button
            isLoading={isPending}
            onClick={() => report(invoice.id)}
          >
            Я оплатил счёт
          </Button>
        </>
      )}
    </div>
  );
}

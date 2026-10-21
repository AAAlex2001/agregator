"use client";

import { useState } from "react";
import { changeBlitzPrice } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/money";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import { useBlitzCommand } from "../model/use-blitz-command";
import type { BlitzCommandProps } from "../model/types";
import styles from "./style.module.scss";

/** Цена из поля: пробелы и запятая допустимы. */
const parsePrice = (value: string) => Number(value.replace(/\s/g, "").replace(",", "."));

/**
 * Меняет цену заявки с причиной. Неоплаченные счета аннулируются, остаток считается
 * от новой цены минус уже оплаченное. Стороны получат уведомление.
 */
export function PriceForm({ order, onChange }: BlitzCommandProps) {
  const [price, setPrice] = useState("");
  const [reason, setReason] = useState("");
  const command = useBlitzCommand(onChange);
  const amount = parsePrice(price);
  const valid = amount > 0 && amount !== order.price && amount >= order.paid_amount && reason.trim().length >= 3;

  async function save() {
    const done = await command.run(() => changeBlitzPrice(order.id, amount, reason.trim()), "Цена изменена");

    if (done) {
      setPrice("");
      setReason("");
    }
  }

  return (
    <Panel title="Цена">
      <div className={styles.form}>
        <p className={styles.hint}>
          Сейчас {formatRub(order.price)}, оплачено {formatRub(order.paid_amount)}. Новая цена не может быть меньше
          оплаченного.
        </p>
        <Field label="Новая цена, ₽">
          <Input value={price} placeholder="Например, 60 000" ariaLabel="Новая цена" onChange={setPrice} />
        </Field>
        <Field label="Причина" hint="Её увидят заказчик и эксперт">
          <Textarea value={reason} rows={2} maxLength={1000} onChange={setReason} />
        </Field>
        <Button loading={command.pending} disabled={!valid} onClick={() => void save()}>
          Изменить цену
        </Button>
      </div>
    </Panel>
  );
}

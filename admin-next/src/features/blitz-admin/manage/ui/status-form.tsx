"use client";

import { useState } from "react";
import { BLITZ_STATUS_LABELS, BLITZ_STATUSES, setBlitzStatus, type BlitzStatus } from "@/entities/blitz-order";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Panel from "@/shared/ui/panel";
import Select from "@/shared/ui/select";
import Textarea from "@/shared/ui/textarea";
import { useBlitzCommand } from "../model/use-blitz-command";
import type { BlitzCommandProps } from "../model/types";
import styles from "./style.module.scss";

/** Статусы, которые есть только у аудита. */
const AUDIT_ONLY: BlitzStatus[] = ["consultation", "offer", "counter", "plan", "plan_review"];

/** Ставит статус вручную, когда стороны договорились иначе. Стороны получат уведомление с пояснением. */
export function StatusForm({ order, onChange }: BlitzCommandProps) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const command = useBlitzCommand(onChange);
  const options = BLITZ_STATUSES
    .filter((item) => order.service === "audit" || !AUDIT_ONLY.includes(item))
    .map((item) => ({ value: item, label: BLITZ_STATUS_LABELS[item] }));

  async function save() {
    const done = await command.run(() => setBlitzStatus(order.id, status, note.trim()), "Статус изменён");

    if (done) setNote("");
  }

  return (
    <Panel title="Статус">
      <div className={styles.form}>
        <Field label="Новый статус" hint="Шаг запишется в историю заявки с пометкой «Администратор»">
          <Select
            value={status}
            options={options}
            ariaLabel="Статус заявки"
            onChange={(value) => setStatus(BLITZ_STATUSES.find((item) => item === value) ?? order.status)}
          />
        </Field>
        <Field label="Пояснение для сторон">
          <Textarea value={note} rows={2} maxLength={1000} placeholder="Необязательно" onChange={setNote} />
        </Field>
        <Button loading={command.pending} disabled={status === order.status} onClick={() => void save()}>
          Сохранить статус
        </Button>
      </div>
    </Panel>
  );
}

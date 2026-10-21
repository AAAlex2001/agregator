"use client";

import { useState } from "react";
import { assignBlitzExpert } from "@/entities/blitz-order";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Panel from "@/shared/ui/panel";
import Select from "@/shared/ui/select";
import { useBlitzCommand } from "../model/use-blitz-command";
import { useExpertOptions } from "../model/use-expert-options";
import type { BlitzCommandProps } from "../model/types";
import styles from "./style.module.scss";

/**
 * Назначает исполнителя до подписания договора. У экспертизы подходящие по удостоверениям — первыми,
 * аудит проводят только руководители аудиторских групп. Без цены назначить нельзя.
 */
export function ExpertForm({ order, onChange }: BlitzCommandProps) {
  const [expertId, setExpertId] = useState("");
  const [contractKind, setContractKind] = useState("");
  const { experts, catalog } = useExpertOptions(order.id);
  const command = useBlitzCommand(onChange);
  const isAudit = order.service === "audit";
  const object = catalog?.objects.find((item) => item.code === order.object_code);
  const kinds = catalog?.kinds.filter((kind) => !object || object.kinds.includes(kind.code)) ?? [];
  const needsKind = !order.contract_kind && kinds.length > 1;
  const fitLabel = (fits: boolean) => (fits ? "подходит" : "удостоверения не совпадают");
  const expertOptions = [
    { value: "", label: isAudit ? "Выберите руководителя группы" : "Выберите эксперта" },
    ...experts.map((expert) => ({
      value: String(expert.id),
      label: isAudit ? expert.name : `${expert.name} — ${fitLabel(expert.fits)}`,
    })),
  ];

  async function assign() {
    const done = await command.run(
      () => assignBlitzExpert(order.id, Number(expertId), contractKind),
      "Исполнитель назначен, заказчик получит договор",
    );

    if (done) setExpertId("");
  }

  return (
    <Panel title={isAudit ? "Руководитель группы" : "Эксперт"}>
      <div className={styles.form}>
        <p className={styles.hint}>
          Сейчас: {order.expert_name ?? "не назначен"}. Новый исполнитель заменит текущего, заказчику уйдёт
          договор.
          {order.price === null && " Сначала укажите цену заявки."}
        </p>
        <Field label="Назначить">
          <Select value={expertId} options={expertOptions} ariaLabel="Исполнитель" onChange={setExpertId} />
        </Field>
        {needsKind && (
          <Field label="Вид договора">
            <Select
              value={contractKind}
              options={[{ value: "", label: "Выберите вид" }, ...kinds.map((kind) => ({ value: kind.code, label: kind.title }))]}
              ariaLabel="Вид договора"
              onChange={setContractKind}
            />
          </Field>
        )}
        <Button
          loading={command.pending}
          disabled={!expertId || order.price === null || (needsKind && !contractKind)}
          onClick={() => void assign()}
        >
          Назначить
        </Button>
      </div>
    </Panel>
  );
}

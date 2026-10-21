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

/** Назначает эксперта до подписания договора. Подходящие по удостоверениям — первыми в списке. */
export function ExpertForm({ order, onChange }: BlitzCommandProps) {
  const [expertId, setExpertId] = useState("");
  const [contractKind, setContractKind] = useState("");
  const { experts, catalog } = useExpertOptions(order.id);
  const command = useBlitzCommand(onChange);
  const object = catalog?.objects.find((item) => item.code === order.object_code);
  const kinds = catalog?.kinds.filter((kind) => !object || object.kinds.includes(kind.code)) ?? [];
  const needsKind = !order.contract_kind && kinds.length > 1;
  const expertOptions = [
    { value: "", label: "Выберите эксперта" },
    ...experts.map((expert) => ({
      value: String(expert.id),
      label: expert.fits ? `${expert.name} — подходит` : `${expert.name} — удостоверения не совпадают`,
    })),
  ];

  async function assign() {
    const done = await command.run(
      () => assignBlitzExpert(order.id, Number(expertId), contractKind),
      "Эксперт назначен, заказчик получит договор",
    );

    if (done) setExpertId("");
  }

  return (
    <Panel title="Эксперт">
      <div className={styles.form}>
        <p className={styles.hint}>
          Сейчас: {order.expert_name ?? "не назначен"}. Назначенный эксперт заменит текущего, заказчику уйдёт договор.
        </p>
        <Field label="Назначить эксперта">
          <Select value={expertId} options={expertOptions} ariaLabel="Эксперт" onChange={setExpertId} />
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
          disabled={!expertId || (needsKind && !contractKind)}
          onClick={() => void assign()}
        >
          Назначить
        </Button>
      </div>
    </Panel>
  );
}

"use client";

import { useState } from "react";
import { setBlitzTeam, useBlitzAuditors } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Loader } from "@/shared/ui/loader";
import { Select } from "@/shared/ui/select";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepNote } from "../step-note";
import styles from "./style.module.scss";

/** Руководитель набирает аудиторскую группу: заказчик увидит её в Плане аудита. */
export function TeamPanel({ order, onChange }: BlitzStepProps) {
  const members = order.team.filter((member) => !member.lead);
  const current = members.map((member) => String(member.id));
  const [chosen, setChosen] = useState(current);
  const { auditors, error } = useBlitzAuditors();
  const { isPending, run } = useBlitzAction(onChange);
  const leadId = order.team.find((member) => member.lead)?.id;
  const options = (auditors ?? [])
    .filter((auditor) => auditor.id !== leadId)
    .map((auditor) => ({
      value: String(auditor.id),
      label: [auditor.name, ...auditor.areas].join(" · "),
    }));
  const isChanged = chosen.join() !== current.join();

  /** Сохраняет состав группы. */
  function save() {
    void run(
      () => setBlitzTeam(order.id, chosen.map(Number)),
      "Состав группы сохранён",
    );
  }

  return (
    <StepNote
      title="Аудиторская группа"
      text={"Вы — руководитель группы. Добавьте аудиторов: "
        + "их ФИО и области аттестации попадут в План."}
    >
      {auditors === null && (
        <div className={styles.loader}>
          <Loader label="" />
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {auditors !== null && (
        <Field label="Аудиторы">
          <Select
            multiple
            ariaLabel="Аудиторы группы"
            placeholder={options.length > 0 ? "Выберите аудиторов" : "Других аудиторов пока нет"}
            options={options}
            value={chosen}
            onChange={setChosen}
          />
        </Field>
      )}
      <div className={styles.actions}>
        <Button
          size="field"
          variant="outline"
          isLoading={isPending}
          disabled={!isChanged}
          onClick={save}
        >
          Сохранить группу
        </Button>
      </div>
    </StepNote>
  );
}
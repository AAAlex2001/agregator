"use client";

import { useState } from "react";
import { postBlitzAction, useBlitzCatalog } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Select } from "@/shared/ui/select";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepNote } from "../step-note";

/** Эксперт берёт новую заявку по цене заказчика и, если нужно, выбирает вид договора. */
export function AcceptPanel({ order, onChange }: BlitzStepProps) {
  const [contractKind, setContractKind] = useState("");
  const { catalog } = useBlitzCatalog();
  const { isPending, run } = useBlitzAction(onChange);
  const object = catalog?.objects.find((item) => item.code === order.object_code);
  const allowed = object ? object.kinds : catalog?.kinds.map((kind) => kind.code) ?? [];
  const kinds = catalog?.kinds.filter((kind) => allowed.includes(kind.code)) ?? [];
  const needsKind = order.contract_kind === null && kinds.length > 1;

  /** Закрепляет заявку за экспертом. */
  function accept() {
    void run(
      () => postBlitzAction(
        order.id,
        "accept",
        { contract_kind: contractKind || null },
        "Не удалось взять заявку",
      ),
      "Заявка ваша: ждём подписи договора",
    );
  }

  return (
    <StepNote
      title="Возьмёте заявку?"
      text={`Заказчик предлагает ${formatRub(order.price)}. `
        + "Посмотрите документацию: если цена и объём подходят, нажмите «Готов провести». "
        + "Заявку получит тот, кто ответит первым."}
    >
      {needsKind && (
        <Field
          label="Вид договора"
          hint="Заказчик не знал вид проекта — определите его по документации"
        >
          <Select
            ariaLabel="Вид договора"
            placeholder="Выберите вид"
            options={kinds.map((kind) => ({ value: kind.code, label: kind.title }))}
            value={contractKind}
            onChange={setContractKind}
          />
        </Field>
      )}
      <Button
        isLoading={isPending}
        disabled={needsKind && !contractKind}
        onClick={accept}
      >
        Готов провести за {formatRub(order.price)}
      </Button>
    </StepNote>
  );
}

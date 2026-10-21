"use client";

import { useState } from "react";
import { BLITZ_SIGNED_ACCEPT, uploadBlitzStep } from "@/entities/blitz-order";
import type { BlitzResult, BlitzUpload } from "@/entities/blitz-order";
import { Field } from "@/shared/ui/field";
import { Tabs } from "@/shared/ui/tabs";
import { useBlitzAction } from "../../model/use-blitz-action";
import type { BlitzStepProps } from "../../model/types";
import { StepFilesForm } from "../step-files-form";
import { StepNote } from "../step-note";

/** Исход экспертизы. */
const RESULT_TABS = [
  { id: "positive", label: "Положительное" },
  { id: "negative", label: "Отрицательное" },
];

/** Исходы в порядке вкладок. */
const RESULTS: BlitzResult[] = ["positive", "negative"];

/** Эксперт отправляет подписанное ЭЦП заключение и указывает исход. */
export function ConclusionPanel({ order, onChange }: BlitzStepProps) {
  const [result, setResult] = useState<BlitzResult>("positive");
  const { isPending, run } = useBlitzAction(onChange);

  /** Отправляет заключение. */
  function send({ files }: BlitzUpload): Promise<boolean> {
    return run(
      () => uploadBlitzStep(
        order.id,
        "conclusion",
        { files, fields: [["result", result]] },
        "Не удалось отправить заключение",
      ),
      "Заключение отправлено заказчику",
    );
  }

  return (
    <StepNote
      title="Оплачено полностью — отправьте заключение"
      text="Подпишите заключение ЭЦП и приложите PDF с подписью или файл подписи (.sig, .p7s)."
    >
      <StepFilesForm
        filesLabel="Заключение"
        submitLabel="Отправить заключение"
        isPending={isPending}
        needsFiles
        accept={BLITZ_SIGNED_ACCEPT}
        extra={
          <Field label="Исход экспертизы">
            <Tabs
              tabs={RESULT_TABS}
              activeTab={result}
              onTabChange={(id) => setResult(RESULTS.find((item) => item === id) ?? "positive")}
            />
          </Field>
        }
        onSubmit={send}
      />
    </StepNote>
  );
}

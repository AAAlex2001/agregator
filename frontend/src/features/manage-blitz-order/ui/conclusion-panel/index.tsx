"use client";

import { useState } from "react";
import { BLITZ_SIGNED_ACCEPT, blitzWording, uploadBlitzStep } from "@/entities/blitz-order";
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

/** Исполнитель отправляет подписанный ЭЦП результат. У экспертизы ещё исход заключения. */
export function ConclusionPanel({ order, onChange }: BlitzStepProps) {
  const [result, setResult] = useState<BlitzResult>("positive");
  const { isPending, run } = useBlitzAction(onChange);
  const wording = blitzWording(order.service);
  const isAudit = order.service === "audit";

  /** Отправляет результат. */
  function send({ files }: BlitzUpload): Promise<boolean> {
    return run(
      () => uploadBlitzStep(
        order.id,
        "conclusion",
        { files, fields: isAudit ? [] : [["result", result]] },
        `Не удалось отправить ${wording.result}`,
      ),
      wording.resultSent,
    );
  }

  return (
    <StepNote
      title={`Оплачено полностью — отправьте ${wording.result}`}
      text="Подпишите документ ЭЦП и приложите PDF с подписью или файл подписи (.sig, .p7s)."
    >
      <StepFilesForm
        filesLabel={wording.resultTitle}
        submitLabel={`Отправить ${wording.result}`}
        isPending={isPending}
        needsFiles
        accept={BLITZ_SIGNED_ACCEPT}
        extra={!isAudit && (
          <Field label="Исход экспертизы">
            <Tabs
              tabs={RESULT_TABS}
              activeTab={result}
              onTabChange={(id) => setResult(RESULTS.find((item) => item === id) ?? "positive")}
            />
          </Field>
        )}
        onSubmit={send}
      />
    </StepNote>
  );
}

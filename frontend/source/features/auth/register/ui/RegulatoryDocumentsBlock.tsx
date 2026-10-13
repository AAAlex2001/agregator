import { LocalFilePicker } from "@/source/entities/directions/shared";
import { FormSection } from "@/source/shared/ui";
import { TextInput } from "@/source/shared/ui/Inputs";
import type { StepProps } from "./types";
import s from "./RegulatoryDocumentsBlock.module.scss";

/** Необязательные документы держателя: лицензия маркшейдера, выписки СРО, аккредитация лаборатории. */
export function RegulatoryDocumentsBlock({ state, dispatch }: StepProps) {
  return (
    <FormSection title="Дополнительные разрешительные документы" collapsible>
      <div className={s.rows}>
        <div className={s.row}>
          <TextInput
            id="register-mining-number"
            value={state.miningNumber}
            autoComplete="off"
            onChange={(event) => dispatch({ type: "set", key: "miningNumber", value: event.target.value })}
            placeholder="Лицензия на маркшейдерские работы №"
          />
          <LocalFilePicker
            label="Файл лицензии маркшейдера"
            file={state.files.mining}
            onSelect={(file) => dispatch({ type: "file", key: "mining", file })}
          />
        </div>

        <LocalFilePicker
          label="Выписка из реестра членов СРО в области проектирования"
          file={state.files.sroDesign}
          onSelect={(file) => dispatch({ type: "file", key: "sroDesign", file })}
        />

        <LocalFilePicker
          label="Выписка из реестра членов СРО в области инженерных изысканий"
          file={state.files.sroSurvey}
          onSelect={(file) => dispatch({ type: "file", key: "sroSurvey", file })}
        />

        <div className={s.row}>
          <TextInput
            id="register-lab-number"
            value={state.labNumber}
            autoComplete="off"
            onChange={(event) => dispatch({ type: "set", key: "labNumber", value: event.target.value })}
            placeholder="Свидетельство об аккредитации лаборатории №"
          />
          <LocalFilePicker
            label="Файл свидетельства аккредитации"
            file={state.files.lab}
            onSelect={(file) => dispatch({ type: "file", key: "lab", file })}
          />
        </div>
      </div>
    </FormSection>
  );
}

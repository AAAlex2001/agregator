import { Field, FilePicker, TextArea } from "@/shared/ui";
import { type FileKey } from "../../model/types";
import { type StepProps } from "./types";

const NOTE = "PDF, JPEG, PNG, DOC, XLSX, ZIP · до 6 файлов, суммарно до 100 МБ";

interface Props extends StepProps {
  onSetFile: (key: FileKey, list: FileList | null) => void;
  onAddOther: (list: FileList | null) => void;
}

export function DocsStep({ state, dispatch, onSetFile, onAddOther }: Props) {
  const picker = (key: FileKey) => (
    <FilePicker
      multiple={false}
      files={state.files[key] ? [state.files[key] as File] : []}
      onAdd={(list) => onSetFile(key, list)}
      onRemove={() => dispatch({ type: "file", key, file: null })}
      note={NOTE}
    />
  );

  return (
    <>
      <Field label="Комментарий к заказу">
        <TextArea
          maxLength={5000}
          placeholder="Опишите детали заказа…"
          value={state.comment}
          onChange={(e) => dispatch({ type: "set", key: "comment", value: e.target.value })}
        />
      </Field>

      <Field label="Техническое задание">{picker("technical")}</Field>
      <Field label="Проект договора">{picker("contract")}</Field>
      <Field label="Карточка предприятия">{picker("company")}</Field>
      <Field label="Иное">
        <FilePicker
          files={state.otherFiles}
          onAdd={onAddOther}
          onRemove={(index) => dispatch({ type: "removeOther", index })}
          note={NOTE}
        />
      </Field>
    </>
  );
}

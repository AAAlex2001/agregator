import { Field, FilePicker, TextField } from "@/shared/ui";
import { type FileKey } from "../../model/reducer";
import { type StepProps } from "./types";
import s from "./docs-step.module.scss";

const NOTE = "PDF, JPG, PNG · до 200 МБ";

export function DocsStep({ state, dispatch }: StepProps) {
  const picker = (key: FileKey) => (
    <FilePicker
      multiple={false}
      files={state.files[key] ? [state.files[key] as File] : []}
      onAdd={(list) => {
        if (list && list[0]) dispatch({ type: "file", key, file: list[0] });
      }}
      onRemove={() => dispatch({ type: "file", key, file: null })}
      note={NOTE}
    />
  );

  return (
    <>
      <p className={s.note}>Все документы необязательны — их можно добавить позже в настройках профиля.</p>

      <Field label="Лицензия ЭПБ ОПО">{picker("license")}</Field>

      <Field label="Лицензия на недра (необязательно)">
        <TextField
          placeholder="Номер лицензии на недра"
          value={state.miningNumber}
          onChange={(e) => dispatch({ type: "set", key: "miningNumber", value: e.target.value })}
        />
        {picker("mining")}
      </Field>

      <Field label="Выписка СРО на проектирование">{picker("sro")}</Field>

      <Field label="Аккредитация лаборатории (необязательно)">
        <TextField
          placeholder="Номер аттестата аккредитации"
          value={state.labNumber}
          onChange={(e) => dispatch({ type: "set", key: "labNumber", value: e.target.value })}
        />
        {picker("lab")}
      </Field>
    </>
  );
}

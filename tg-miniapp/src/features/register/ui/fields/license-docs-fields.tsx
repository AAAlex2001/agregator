import { type Dispatch } from "react";
import { FilePicker, TextField } from "@/shared/ui";
import { type FileKey, type RegisterAction, type RegisterState, type StringField } from "../../model/reducer";
import s from "../register-sheet.module.scss";

const FILE_NOTE = "PDF, JPG, PNG · до 200 МБ";

interface Props {
  state: RegisterState;
  dispatch: Dispatch<RegisterAction>;
}

export function LicenseDocsFields({ state, dispatch }: Props) {
  const filePicker = (key: FileKey) => (
    <FilePicker
      files={state.files[key] ? [state.files[key] as File] : []}
      onAdd={(list) => {
        if (list && list[0]) dispatch({ type: "file", key, file: list[0] });
      }}
      onRemove={() => dispatch({ type: "file", key, file: null })}
      note={FILE_NOTE}
    />
  );

  const numberField = (key: StringField, label: string, value: string) => (
    <TextField
      label={label}
      placeholder="Номер"
      value={value}
      onChange={(e) => dispatch({ type: "set", key, value: e.target.value })}
    />
  );

  return (
    <>
      <p className={s.sectionNote}>Все документы необязательны — их можно добавить позже в настройках профиля.</p>

      <div className={s.field}>
        <span className={s.label}>Лицензия ЭПБ ОПО</span>
        {filePicker("license")}
      </div>

      <div className={s.field}>
        {numberField("miningNumber", "Лицензия на недра (необязательно)", state.miningNumber)}
        {filePicker("mining")}
      </div>

      <div className={s.field}>
        <span className={s.label}>Выписка СРО на проектирование</span>
        {filePicker("sro")}
      </div>

      <div className={s.field}>
        {numberField("labNumber", "Аккредитация лаборатории (необязательно)", state.labNumber)}
        {filePicker("lab")}
      </div>
    </>
  );
}

import { type Dispatch } from "react";
import { Button, Checkbox, Chips } from "@/shared/ui";
import { CloseIcon } from "@/shared/ui/icons/interface";
import { type RegisterAction, type RegisterState, type StringField } from "../../model/reducer";
import s from "./attestation-fields.module.scss";
import f from "../register-sheet.module.scss";

const AREAS = Array.from({ length: 15 }, (_, i) => `Э${i + 1}`);
const OBJECTS = ["КЛ", "ТП", "КЛ/ТП", "ЗС", "ТУ", "Д", "ОБ"];
const CATEGORIES = ["1", "2", "3"];

const MAP_FIELDS = [
  { key: "name", label: "ФИО" },
  { key: "area", label: "Область аттестации" },
  { key: "object", label: "Объект экспертизы" },
  { key: "category", label: "Категория" },
  { key: "contacts", label: "Контакты" },
];

const toOptions = (values: string[]) => values.map((value) => ({ key: value, label: value }));

interface Props {
  state: RegisterState;
  dispatch: Dispatch<RegisterAction>;
}

export function AttestationFields({ state, dispatch }: Props) {
  const pick = (key: StringField, current: string) => (next: string) =>
    dispatch({ type: "set", key, value: current === next ? "" : next });
  const canAdd = state.certArea !== "" && state.certObject !== "" && state.certCategory !== "";

  return (
    <>
      <Checkbox checked={state.attested} onChange={(v) => dispatch({ type: "attested", value: v })}>
        Я являюсь аттестованным экспертом
      </Checkbox>

      {state.attested && (
        <div className={s.block}>
          <div className={f.field}>
            <span className={f.label}>Область аттестации</span>
            <Chips options={toOptions(AREAS)} value={state.certArea ? [state.certArea] : []} onToggle={pick("certArea", state.certArea)} />
          </div>
          <div className={f.field}>
            <span className={f.label}>Объект экспертизы</span>
            <Chips options={toOptions(OBJECTS)} value={state.certObject ? [state.certObject] : []} onToggle={pick("certObject", state.certObject)} />
          </div>
          <div className={f.field}>
            <span className={f.label}>Категория</span>
            <Chips options={toOptions(CATEGORIES)} value={state.certCategory ? [state.certCategory] : []} onToggle={pick("certCategory", state.certCategory)} />
          </div>

          <Button variant="outline" disabled={!canAdd} onClick={() => dispatch({ type: "addCertificate" })}>
            Добавить удостоверение
          </Button>

          {state.certificates.length > 0 && (
            <div className={s.certs}>
              {state.certificates.map((cert, index) => (
                <div key={`${cert.area}-${cert.object}-${cert.category}`} className={s.cert}>
                  <span className={s.certLabel}>
                    {cert.area} · {cert.object} · {cert.category} категория
                  </span>
                  <button
                    type="button"
                    className={s.certRemove}
                    onClick={() => dispatch({ type: "removeCertificate", index })}
                    aria-label="Удалить"
                  >
                    <CloseIcon width={14} height={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Checkbox checked={state.showOnMap} onChange={(v) => dispatch({ type: "showOnMap", value: v })}>
            Показывать меня на карте России
          </Checkbox>

          {state.showOnMap && (
            <div className={f.field}>
              <span className={f.label}>Что показывать на карте</span>
              <Chips
                options={MAP_FIELDS}
                value={state.mapFields}
                onToggle={(field) => dispatch({ type: "toggleMapField", field })}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

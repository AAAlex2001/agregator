import { Button, Checkbox, Field, Select } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { CloseIcon } from "@/shared/ui/icons/interface";
import { type StepProps } from "./types";
import s from "./attestation.module.scss";

const AREAS = Array.from({ length: 15 }, (_, i) => ({ key: `Э${i + 1}`, label: `Э${i + 1}` }));
const OBJECTS = ["КЛ", "ТП", "КЛ/ТП", "ЗС", "ТУ", "Д", "ОБ"].map((v) => ({ key: v, label: v }));
const CATEGORIES = ["1", "2", "3"].map((v) => ({ key: v, label: `${v} категория` }));

const MAP_FIELDS = [
  { key: "name", label: "ФИО" },
  { key: "area", label: "Область аттестации" },
  { key: "object", label: "Объект экспертизы" },
  { key: "category", label: "Категория" },
  { key: "contacts", label: "Контакты" },
];

export function Attestation({ state, dispatch }: StepProps) {
  const canAdd = state.certArea !== "" && state.certObject !== "" && state.certCategory !== "";

  return (
    <>
      <Checkbox checked={state.attested} onChange={(v) => dispatch({ type: "attested", value: v })}>
        Я являюсь аттестованным экспертом
      </Checkbox>

      {state.attested ? (
        <div className={s.block}>
          <Field label="Область аттестации">
            <Select
              options={AREAS}
              value={state.certArea ? [state.certArea] : []}
              placeholder="Выберите область"
              onChange={(v) => dispatch({ type: "set", key: "certArea", value: v[0] ?? "" })}
            />
          </Field>
          <Field label="Объект экспертизы">
            <Select
              options={OBJECTS}
              value={state.certObject ? [state.certObject] : []}
              placeholder="Выберите объект"
              onChange={(v) => dispatch({ type: "set", key: "certObject", value: v[0] ?? "" })}
            />
          </Field>
          <Field label="Категория">
            <Tabs
              tabs={CATEGORIES}
              active={state.certCategory}
              onChange={(k) => dispatch({ type: "set", key: "certCategory", value: k })}
            />
          </Field>

          <Button variant="outline" disabled={!canAdd} onClick={() => dispatch({ type: "addCertificate" })}>
            Добавить удостоверение
          </Button>

          {state.certificates.length > 0 ? (
            <ul className={s.certs}>
              {state.certificates.map((cert, index) => (
                <li key={`${cert.area}-${cert.object}-${cert.category}`} className={s.cert}>
                  <span className={s.certLabel}>
                    {cert.area} · {cert.object} · {cert.category} категория
                  </span>
                  <button
                    type="button"
                    className={s.certRemove}
                    aria-label="Удалить"
                    onClick={() => dispatch({ type: "removeCertificate", index })}
                  >
                    <CloseIcon width={14} height={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <Checkbox checked={state.showOnMap} onChange={(v) => dispatch({ type: "showOnMap", value: v })}>
            Показывать меня на карте России
          </Checkbox>

          {state.showOnMap ? (
            <Field label="Что показывать на карте">
              <Select
                multi
                options={MAP_FIELDS}
                value={state.mapFields}
                placeholder="Выберите поля"
                onChange={(v) => dispatch({ type: "mapFields", value: v })}
              />
            </Field>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

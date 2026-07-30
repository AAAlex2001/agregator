import { Checkbox, Field, Select } from "@/shared/ui";
import { OPO_KEYS, TABLE, TYPES } from "@/entites/expertise";
import { ORDER_WORK_OPTIONS } from "@/entites/order";
import type { ExpertiseType } from "@/entites/expertise";
import { type StepProps } from "./types";
import s from "./requirements-step.module.scss";

const TYPE_OPTIONS = TYPES.map((t) => ({ key: t, label: t }));
const OPO_OPTIONS = OPO_KEYS.map((key) => ({ key, label: `Э${key} — ${TABLE[key].name}` }));

interface Props extends StepProps {
  badgeCodes: string[];
}

export function RequirementsStep({ state, dispatch, badgeCodes }: Props) {
  return (
    <>
      <Field label="Вид работ">
        <Select
          title="Вид работ"
          options={[
            { key: "EXPERTISE", label: "Экспертиза" },
            { key: "OTHER_WORK", label: "Иная инженерная работа" },
          ]}
          value={[state.workType === "EXPERTISE" ? "EXPERTISE" : "OTHER_WORK"]}
          onChange={([value]) => dispatch({
            type: "workType",
            value: value === "EXPERTISE" ? "EXPERTISE" : state.workType === "EXPERTISE" ? "DESIGN_SURVEY" : state.workType,
          })}
        />
      </Field>

      {state.workType !== "EXPERTISE" && (
        <Field label="Категория работ">
          <div className={s.workOptions}>
            {ORDER_WORK_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`${s.workOption} ${state.workType === option.key ? s.workOptionActive : ""}`}
                onClick={() => dispatch({ type: "workType", value: option.key })}
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        </Field>
      )}

      <Field label="Кто требуется для заказа">
        <Checkbox
          checked={state.requiresExpert}
          onChange={(v) => dispatch({ type: "flag", key: "requiresExpert", value: v })}
        >
          Требуется исполнитель
        </Checkbox>
        <Checkbox
          checked={state.requiresLicense}
          onChange={(v) => dispatch({ type: "flag", key: "requiresLicense", value: v })}
        >
          Требуется лицензия
        </Checkbox>
      </Field>

      {state.workType === "EXPERTISE" && <Field label="Объекты экспертизы" hint="Основные объекты экспертизы промышленной безопасности">
        <Select
          multi
          title="Объекты экспертизы"
          options={TYPE_OPTIONS}
          value={state.types}
          placeholder="Выберите объекты"
          onChange={(v) => dispatch({ type: "types", value: v as ExpertiseType[] })}
        />
      </Field>}

      {state.workType === "EXPERTISE" && <Field label="Области аттестации исполнителей" hint="Типовые наименования опасных производственных объектов">
        <Select
          multi
          title="Области аттестации"
          options={OPO_OPTIONS}
          value={state.opos}
          placeholder="Выберите области"
          onChange={(v) => dispatch({ type: "opos", value: v })}
        />
      </Field>}

      {state.workType === "EXPERTISE" && badgeCodes.length > 0 && (
        <Field label="Будут добавлены к заказу">
          <div className={s.codes}>
            {badgeCodes.map((code) => (
              <span key={code} className={s.code}>
                {code}
              </span>
            ))}
          </div>
        </Field>
      )}
    </>
  );
}

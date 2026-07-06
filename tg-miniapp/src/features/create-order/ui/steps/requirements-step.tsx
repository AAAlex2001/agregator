import { Checkbox, Field, Select, Toggle } from "@/shared/ui";
import { OPO_KEYS, TABLE, TYPES } from "@/entites/expertise";
import type { ExpertiseType } from "@/entites/expertise";
import { ExpertPicker } from "../expert-picker";
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
      <Field label="Кто требуется для заказа">
        <Checkbox
          checked={state.requiresExpert}
          onChange={(v) => dispatch({ type: "flag", key: "requiresExpert", value: v })}
        >
          Требуется эксперт
        </Checkbox>
        <Checkbox
          checked={state.requiresLicense}
          onChange={(v) => dispatch({ type: "flag", key: "requiresLicense", value: v })}
        >
          Требуется лицензия
        </Checkbox>
      </Field>

      <Field label="Объекты экспертизы" hint="Основные объекты экспертизы промышленной безопасности">
        <Select
          multi
          title="Объекты экспертизы"
          options={TYPE_OPTIONS}
          value={state.types}
          placeholder="Выберите объекты"
          onChange={(v) => dispatch({ type: "types", value: v as ExpertiseType[] })}
        />
      </Field>

      <Field label="Области аттестации экспертов" hint="Типовые наименования опасных производственных объектов">
        <Select
          multi
          title="Области аттестации"
          options={OPO_OPTIONS}
          value={state.opos}
          placeholder="Выберите области"
          onChange={(v) => dispatch({ type: "opos", value: v })}
        />
      </Field>

      {badgeCodes.length > 0 && (
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

      <Field
        label="Кто увидит заказ"
        hint="Если никого не выбрать — заказ увидят все подходящие эксперты"
      >
        <ExpertPicker
          selected={state.visibleExperts}
          onAdd={(expert) => dispatch({ type: "addExpert", expert })}
          onRemove={(id) => dispatch({ type: "removeExpert", id })}
        />
      </Field>

      <Field label="Уведомления">
        <div className={s.notifyRow}>
          <div className={s.notifyText}>
            <span className={s.notifyTitle}>Сообщить экспертам о заказе</span>
            <span className={s.notifyHint}>Если выключить — рассылка не уйдёт никому и никуда</span>
          </div>
          <Toggle
            on={state.notifyExperts}
            onChange={(value) => dispatch({ type: "notifyExperts", value })}
          />
        </div>
      </Field>
    </>
  );
}
